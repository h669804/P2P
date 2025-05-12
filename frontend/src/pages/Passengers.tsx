import { useState } from 'react';
import NextButton from '../components/NextButton';
import BackButton from '../components/BackButton';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import PassengersDialog from '../components/PassengersDialog';

// ─────────────────────────────────────────────
// File: Passengers.tsx
// Page: Passengers
// Description: Side der brukeren velger antall passasjerer i bookingen.
// Context: Del av bookingflyten, plassert etter valg av destinasjon (Destination).
// ─────────────────────────────────────────────

export default function Passengers() {
  const [isPassengerSelected, setIsPassengerSelected] = useState(false);
  return (
    <>
      <Navbar />
      <ProgressBar activeStep={2} />
      <BackButton />
      <div className="page">
        <div className="page-title-wrapper">
          <h1 className="page-title">How many travellers?</h1>
        </div>
        <PassengersDialog onPassengersSelected={setIsPassengerSelected} />
        <NextButton isEnabled={isPassengerSelected} route="/traveldate" />
      </div>
    </>
  );
}
