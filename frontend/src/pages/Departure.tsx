import { useState } from 'react';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import PortsDropdownMenu from '../components/PortsDropdownMenu';
import NextButton from '../components/NextButton';
import ProgressBar from '../components/ProgressBar';

// ─────────────────────────────────────────────
// File: Departure.tsx
// Page: Departure
// Description: Side der brukeren velger avgangshavn.
// Context: Første side i bookingflyten.
// ─────────────────────────────────────────────

export default function Departure() {
  const [isPortSelected, setIsPortSelected] = useState(false);

  const handlePortSelection = (portName: string) => {
    setIsPortSelected(portName !== 'Please select a port');
    sessionStorage.setItem('departurePort', portName);
  };
  return (
    <>
      <Navbar />
      <ProgressBar activeStep={0} />
      <BackButton />

      <div className="page">
        <div className="page-title-wrapper">
          <h1 className="page-title">Where are you travelling from?</h1>
        </div>

        <PortsDropdownMenu onSelectPort={handlePortSelection} parent="departure" />
        <NextButton route="/destination" isEnabled={isPortSelected} />
      </div>
    </>
  );
}
