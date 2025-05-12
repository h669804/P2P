import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';

// ─────────────────────────────────────────────
// File: Payment.tsx
// Page: Payment
// Description: Side som simulerer betalingsprosessen mens bestillingen behandles.
// Context: Del av bookingflyten, plassert etter valg av betalingsmetode (full betaling eller depositum).
// ─────────────────────────────────────────────

export default function SimulatePayment() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/confirmation');
    }, 3000); // Simulate 3 second "payment"

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <ProgressBar activeStep={10} />
      <div className="page">
        <h1>Processing payment...</h1>
        <p>Please wait while we complete your transaction.</p>
        <div className="loader"></div>
      </div>
    </>
  );
}
