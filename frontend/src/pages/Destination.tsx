import { useState } from 'react';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import DropdownMenu from '../components/PortsDropdownMenu';
import NextButton from '../components/NextButton';
import ProgressBar from '../components/ProgressBar';

// ─────────────────────────────────────────────
// File: Destination.tsx
// Page: Destination
// Description: Side der brukeren velger ankomsthavn.
// Context: Plassert etter avgangshavn (Departure) i bookingflyten.
// ─────────────────────────────────────────────

export default function Departure() {
  const [isPortSelected, setIsPortSelected] = useState(false);

  const handlePortSelection = (portName: string) => {
    setIsPortSelected(portName !== 'Please select a port');
    sessionStorage.setItem('destinationPort', portName);
  };

  return (
    <>
      <Navbar />
      <ProgressBar activeStep={1} />
      <BackButton />
      <div className="page">
        <div className="page-title-wrapper">
          <h1 className="page-title">Where are you travelling to?</h1>
        </div>
        <DropdownMenu onSelectPort={handlePortSelection} parent="destination" />
        <NextButton route="/passengers" isEnabled={isPortSelected} />
      </div>
    </>
  );
}
