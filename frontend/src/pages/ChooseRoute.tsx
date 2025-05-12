import { useEffect, useState } from 'react';
import NextButton from '../components/NextButton';
import BackButton from '../components/BackButton';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import RouteSelectionDialog from '../components/RouteSelectionDialog';

// ─────────────────────────────────────────────
// File: ChooseRoute.tsx
// Page: ChooseRoute
// Description: Side der brukeren velger ønsket reiserute.
// Context: Del av bookingflyten, plassert etter valg av reisedato (TravelDate.tsx).
// ─────────────────────────────────────────────

function getRouteFromSessionStorage() {
  const storedDeparture = sessionStorage.getItem('departurePort');
  const storedDestination = sessionStorage.getItem('destinationPort');
  if (storedDeparture && storedDestination) {
    return `${storedDeparture}  →  ${storedDestination}`;
  }
}

export default function RouteSelection() {
  const [isRouteSelected, setIsRouteSelected] = useState(false);
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    const storedRoute = getRouteFromSessionStorage();
    if (storedRoute) {
      setRoute(storedRoute);
    }
  }, []);
  return (
    <div className="page">
      <Navbar />
      <ProgressBar activeStep={4} />
      <BackButton />
      <div className="page-title-wrapper">
        <h1 className="page-title">Select your voyage</h1>
        {route && <p className="page-subtitle">{route}</p>}
      </div>
      <RouteSelectionDialog onRouteSelected={setIsRouteSelected} />
      <NextButton isEnabled={isRouteSelected} route="/cabin" />
    </div>
  );
}
