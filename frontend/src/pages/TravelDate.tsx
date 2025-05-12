import { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import Navbar from '../components/Navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/pages/TravelDate.css';
import NextButton from '../components/NextButton';
import ProgressBar from '../components/ProgressBar';

// ─────────────────────────────────────────────
// File: TravelDate.tsx
// Page: TravelDate
// Description: Side der brukeren velger ønsket avgangsdato.
// Context: Del av bookingflyten, plassert etter valg av antall passasjerer (Passengers).
// ─────────────────────────────────────────────

export default function () {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(true);

  useEffect(() => {
    const storedDate = sessionStorage.getItem('selectedDate');
    if (storedDate) {
      // Parse the string to a timestamp and convert to Date object
      const parsedDate = new Date(Date.parse(storedDate));
      setSelectedDate(parsedDate);
    } else {
      // Handle if passenger wants to travel "today"
      sessionStorage.setItem('selectedDate', selectedDate.toISOString());
    }
  }, []);

  const handleSelectedDate = (date: Date | null) => {
    if (date) {
      setSelectedDate(date); // Update state først
      sessionStorage.setItem('selectedDate', date.toISOString()); // Lagre ny dato
      setIsDateSelected(true);
    }
  };

  return (
    <>
      <Navbar />
      <ProgressBar activeStep={3} />
      <BackButton />
      <div className="page">
        <div className="page-title-wrapper">
          <h1 className="page-title">When are you travelling?</h1>
        </div>
        <div className="custom-datepicker-wrapper">
          <DatePicker
            selected={selectedDate}
            onChange={handleSelectedDate}
            open={isOpen} // gjør den kontrollert
            onClickOutside={() => setIsOpen(false)} // når bruker klikker utenfor
            onSelect={() => setIsOpen(false)} // lukker når dato velges
            onInputClick={() => setIsOpen((prev) => !prev)} // toggle når man klikker på feltet
            toggleCalendarOnIconClick={false} // viktig – du håndterer åpning selv
            className="custom-datepicker"
          />
        </div>
        <NextButton route="/chooseroute" isEnabled={isDateSelected} />
      </div>
    </>
  );
}
