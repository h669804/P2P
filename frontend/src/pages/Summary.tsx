import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import ProgressBar from '../components/ProgressBar';
import NextButton from '../components/NextButton';
import '../css/pages/Summary.css';

// ─────────────────────────────────────────────
// File: Summary.tsx
// Page: Summary
// Description: Side som viser en oppsummering av valgene i bookingen, slik at brukeren kan kontrollere informasjonen før betaling.
// Context: Del av bookingflyten, plassert etter innfylling av passasjerinformasjon (PassengerDetails).
// ─────────────────────────────────────────────

type Passenger = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
};

type PassengerCounts = Record<
  'adults' | 'children' | 'infants' | 'pensioners' | 'students',
  number
>;

type BookingData = {
  route: any;
  passengers: Passenger[];
  passengersCount: PassengerCounts;
  date: string;
  cabin: { category: string; type: string; price: number };
  mealPackage: boolean;
  totalPrice: number;
};

const typeMap: Record<string, string> = {
  adults: 'Adult',
  children: 'Child',
  infants: 'Infant',
  pensioners: 'Pensioner',
  students: 'Student',
};

export default function ReceiptPage() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    const getParsed = (key: string) => {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    };

    const route = getParsed('selectedRoute');
    const passengersCount: PassengerCounts = getParsed('selectedPassengers') || {
      adults: 0,
      children: 0,
      infants: 0,
      pensioners: 0,
      students: 0,
    };
    const date = sessionStorage.getItem('selectedDate') || '';
    const cabin = getParsed('selectedCabin');
    const passengers = getParsed('passengers') || [];
    const mealPackage = sessionStorage.getItem('mealPackage') === 'true';

    const base = Math.round(route?.price || 0);
    const cabinPrice = cabin?.price || 0;
    const mealPrice = mealPackage ? 250 * (passengersCount.adults + passengersCount.children) : 0;

    const computedData = {
      route,
      passengers,
      passengersCount,
      date,
      cabin,
      mealPackage,
      totalPrice: base + cabinPrice + mealPrice,
    };

    setBookingData(computedData);
    sessionStorage.setItem('bookingData', JSON.stringify(computedData));
  }, []);

  if (!bookingData) return <div>Loading...</div>;

  const formatDate = (str: string) =>
    new Date(str).toLocaleDateString('no-NO', { year: 'numeric', month: 'long', day: 'numeric' });

  const formatTime = (str: string) =>
    new Date(str).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });

  const passengerTypes = Object.entries(bookingData.passengersCount).flatMap(([type, count]) =>
    Array(count).fill(type),
  );
  const typeCounters = Object.fromEntries(
    Object.keys(bookingData.passengersCount).map((key) => [key, 0]),
  );

  return (
    <div className="page">
      <Navbar />
      <BackButton />
      <ProgressBar activeStep={8} />
      <section className="receipt-section">
        <h1 className="receipt-title">Booking Summary</h1>
        <div className="receipt-card">
          <div className="route-display">
            <div className="port">
              <div className="port-name">{bookingData.route?.departurePort}</div>
              <div className="port-date">
                {formatDate(bookingData.date)}
                <br />
                {formatTime(bookingData.date)}
              </div>
            </div>
            <div className="arrow">→</div>
            <div className="port">
              <div className="port-name">{bookingData.route?.arrivalPort}</div>
              <div className="port-date">
                {formatDate(bookingData.route?.arrivalTime)}
                <br />
                {formatTime(bookingData.route?.arrivalTime)}
              </div>
            </div>
          </div>

          <div className="two-column-layout">
            <div className="column">
              <h3 className="detail-heading">Travel Details</h3>
              <div className="detail-row">
                <span className="detail-label">Cabin</span>
                <span className="detail-value">
                  {bookingData.cabin.category} ({bookingData.cabin.type})
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Meal package</span>
                <span className="detail-value">{bookingData.mealPackage ? 'Yes' : 'No'}</span>
              </div>

              <h3 className="detail-heading">Price Summary</h3>
              <div className="detail-row">
                <span className="detail-label">Base price</span>
                <span className="detail-value">{Math.round(bookingData.route.price)} NOK</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Cabin</span>
                <span className="detail-value">{bookingData.cabin.price} NOK</span>
              </div>
              {bookingData.mealPackage && (
                <div className="detail-row">
                  <span className="detail-label">Meal package</span>
                  <span className="detail-value">
                    {250 *
                      (bookingData.passengersCount.adults +
                        bookingData.passengersCount.children)}{' '}
                    NOK
                  </span>
                </div>
              )}
              <div className="total-row">
                <span>Total</span>
                <span>{bookingData.totalPrice} NOK</span>
              </div>
            </div>

            <div className="column">
              <h3 className="detail-heading">Passengers</h3>
              {bookingData.passengers.map((p, i) => {
                const rawType = passengerTypes[i];
                const displayType = typeMap[rawType] || rawType;
                const typeIndex = ++typeCounters[rawType];
                const title = p.gender === 'Male' ? 'Mr.' : 'Ms.';

                return (
                  <div className="passenger-details-block" key={i}>
                    <div className="passenger-index">{`${displayType} #${typeIndex}`}</div>
                    <div className="passenger-name">
                      {title} {p.firstName} {p.lastName}
                    </div>
                    <div className="passenger-birth">{p.dateOfBirth}</div>
                    <div className="passenger-email">{p.email}</div>
                    <div className="passenger-phone">
                      {p.countryCode} {p.phoneNumber}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <NextButton isEnabled={true} route="/choosepayment" />
    </div>
  );
}
