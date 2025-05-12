import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import ProgressBar from '../components/ProgressBar';
import NextButton from '../components/NextButton';
import { PassengerFormData } from '../interfaces/PassengerFormData';
import { PassengerCounts } from '../interfaces/PassengerCounts';
import '../css/pages/PassengersDetails.css';

// ─────────────────────────────────────────────
// File: PassengerDetails.tsx
// Page: PassengerDetails
// Description: Side med skjema for å registrere nødvendig informasjon for valgte passasjerer.
// Context: Del av bookingflyten, plassert etter valg av måltidspakke (MealPackage).
// ─────────────────────────────────────────────

const labelMap: Record<string, string> = {
  adults: 'Adult',
  children: 'Child',
  infants: 'Infant',
  pensioners: 'Pensioner',
  students: 'Student',
};

export default function PassengerDetails() {
  const navigate = useNavigate();
  const [passengerButtons, setPassengerButtons] = useState<string[]>([]);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [allPassengers, setAllPassengers] = useState<PassengerFormData[]>([]);
  const [formData, setFormData] = useState<PassengerFormData>({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    citizenship: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
  });
  const [allPassengersValid, setAllPassengersValid] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('selectedPassengers');
      if (!stored) throw new Error('No passenger data found');

      const parsed: PassengerCounts = JSON.parse(stored);
      if (typeof parsed !== 'object' || parsed === null) throw new Error('Invalid format');

      // Build label list from counts
      const buttons = Object.entries(parsed).flatMap(([type, count]) => {
        const label = labelMap[type] || type;
        return Array.from({ length: count }, (_, i) => `${label} #${i + 1}`);
      });
      setPassengerButtons(buttons);

      // Initialize passenger form array
      const storedPassengers = sessionStorage.getItem('passengers');
      const passengers = storedPassengers
        ? JSON.parse(storedPassengers)
        : Array(buttons.length).fill({
            firstName: '',
            lastName: '',
            gender: '',
            dateOfBirth: '',
            citizenship: '',
            email: '',
            countryCode: '',
            phoneNumber: '',
          });
      setAllPassengers(passengers);
      setFormData(passengers[0]);
    } catch (err) {
      alert('Please select passengers before continuing.');
      navigate('/passengers');
    }
  }, [navigate]);

  useEffect(() => {
    if (allPassengers.length === 0) return;
    const updated = [...allPassengers];
    updated[currentPassengerIndex] = formData;
    setAllPassengers(updated);
    sessionStorage.setItem('passengers', JSON.stringify(updated));

    const allValid = updated.every(
      (p) =>
        p.firstName.trim() &&
        p.lastName.trim() &&
        p.gender &&
        p.dateOfBirth.trim() &&
        p.citizenship.trim(),
    );
    setAllPassengersValid(allValid);
  }, [formData]);

  useEffect(() => {
    if (allPassengers[currentPassengerIndex]) {
      setFormData(allPassengers[currentPassengerIndex]);
    }
  }, [currentPassengerIndex, allPassengers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  return (
    <>
      <Navbar />
      <BackButton />
      <ProgressBar activeStep={7} />
      <div className="page">
        <div className="passenger-details-section">
          <div className="passenger-selector">
            <span className="passenger-selector-label">
              {passengerButtons.length > 1 ? 'Passengers:' : 'Passenger:'}
            </span>
            <div className="passenger-buttons">
              {passengerButtons.map((label, index) => (
                <button
                  key={index}
                  className={currentPassengerIndex === index ? 'active' : ''}
                  onClick={() => setCurrentPassengerIndex(index)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="label-column">First name</div>
              <div className="input-column">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-column">Last name</div>
              <div className="input-column">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="label-column">Gender</div>
              <div className="input-column">
                <div className="radio-group">
                  {['Male', 'Female'].map((g) => (
                    <label key={g}>
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === g}
                        onChange={() => handleGenderChange(g)}
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="label-column">Date of birth</div>
              <div className="input-column">
                <input
                  type="text"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  placeholder="DD.MM.YYYY"
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="label-column">Citizenship</div>
              <div className="input-column">
                <input
                  type="text"
                  name="citizenship"
                  value={formData.citizenship}
                  onChange={handleChange}
                  placeholder="Citizenship"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-column">E-mail</div>
              <div className="input-column">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-mail address"
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="label-column">Country code</div>
              <div className="input-column">
                <input
                  type="text"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  placeholder="+XX"
                  className="country-code-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-column">Phone number</div>
              <div className="input-column">
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>
        </div>
        <NextButton isEnabled={allPassengersValid} route="/summary" />
      </div>
    </>
  );
}
