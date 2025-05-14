import { useState } from "react";
import { Port } from "../interfaces/IPort";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import PortsDropdownMenu from "../components/PortsDropdownMenu";
import NextButton from "../components/NextButton";
import ProgressBar from "../components/ProgressBar";

// ─────────────────────────────────────────────
// File: Departure.tsx
// Page: Departure
// Description: Side der brukeren velger avgangshavn.
// Context: Første side i bookingflyten.
// ─────────────────────────────────────────────

export default function Departure() {
  const [isPortSelected, setIsPortSelected] = useState(false);
  const [ports, setPorts] = useState<Port[]>([]);

  const handlePortSelection = (portName: string) => {
    const isValid = ports.some((port) => port.name === portName);
    setIsPortSelected(isValid);

    if (isValid) {
      sessionStorage.setItem("departurePort", portName);
    } else {
      sessionStorage.removeItem("departurePort");
    }
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

        <PortsDropdownMenu
          onSelectPort={handlePortSelection}
          onPortsLoaded={setPorts}
          parent="departure"
        />
        <NextButton route="/destination" isEnabled={isPortSelected} />
      </div>
    </>
  );
}
