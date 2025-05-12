import { useNavigate } from 'react-router-dom';
import '../css/components/NextButton.css';
import { NextButtonProps } from '../interfaces/INextButtonProps';

// ─────────────────────────────────────────────
// File: NextButton.tsx
// Component: NextButton
// Description: Knapp som forblir deaktivert inntil kunden har gjort et gyldig valg og kan gå videre i bookingflyten.
// Context: Brukes på alle sider i bookingflyten.
// ─────────────────────────────────────────────

export default function NextButton({ route, isEnabled }: NextButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isEnabled) {
      navigate(route); // Navigerer til den spesifiserte ruten
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`next-button ${isEnabled ? 'active' : 'disabled'}`}
      disabled={!isEnabled}
    >
      Next
    </button>
  );
}
