import { useState } from "react";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import PortsDropdownMenu from "../components/PortsDropdownMenu";
import NextButton from "../components/NextButton";
import ProgressBar from "../components/ProgressBar";
import { Port } from "@/interfaces/IPort";

// ─────────────────────────────────────────────
// File: Destination.tsx
// Page: Destination
// Description: Side der brukeren velger ankomsthavn.
// Context: Plassert etter avgangshavn (Departure) i bookingflyten.
// ─────────────────────────────────────────────

export default function Departure() {
  const [isPortSelected, setIsPortSelected] = useState(false);
  const [ports, setPorts] = useState<Port[]>([]);

  const handlePortSelection = (portName: string) => {
    const isValid = ports.some((port) => port.name === portName);
    setIsPortSelected(isValid);

    if (isValid) {
      sessionStorage.setItem("destinationPort", portName);
    } else {
      sessionStorage.removeItem("destinationPort");
    }
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
        <PortsDropdownMenu
          onSelectPort={handlePortSelection}
          onPortsLoaded={setPorts}
          parent="destination"
        />
        <NextButton route="/passengers" isEnabled={isPortSelected} />
      </div>
    </>
  );
}
