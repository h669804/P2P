import { useState } from 'react';
import BackButton from '../components/BackButton';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import '../css/pages/MealPackage.css';
import { useNavigate } from 'react-router-dom';
import ReusableDialog from '../components/ReusableDialog';

// ─────────────────────────────────────────────
// File: MealPackage.tsx
// Page: MealPackage
// Description: Side der brukeren velger om måltidspakke skal legges til, med informasjon om innholdet.
// Context: Del av bookingflyten, plassert etter valg av kabin (CabinPage).
// ─────────────────────────────────────────────

export default function MealPackage() {
  const navigate = useNavigate();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleAccept = () => {
    sessionStorage.setItem('mealPackage', 'true');
    navigate('/passengerdetails');
  };

  const handleReject = () => {
    sessionStorage.setItem('mealPackage', 'false');
    navigate('/passengerdetails');
  };

  return (
    <>
      <Navbar />
      <ProgressBar activeStep={6} />
      <BackButton />
      <div className="page">
        <div className="spacer" />
        <div className="page-title-wrapper">
          <h1 className="page-title">Do you want a meal package?</h1>
        </div>
        <div className="meal-wrapper">
          <div className="meal-package">
            <button className="meal-package-message" onClick={() => setIsInfoOpen(true)}>
              <span>Meal Package</span>
              <span className="info-icon">
                <img src="./src/assets/info.svg" alt="Info" />
              </span>
            </button>
            <div className="meal-package-price">
              <span>NOK 250</span>
            </div>
          </div>
          <ReusableDialog
            isOpen={isInfoOpen}
            onClose={() => setIsInfoOpen(false)}
            className="meal-info-dialog"
          >
            <div className="meal-info-dialog-content">
              <h3>Meal Package</h3>
              <p>
                Includes breakfast, lunch and dinner during your voyage. Meals are served in the
                main dining area and offer locally inspired, seasonal dishes.
              </p>
              <button onClick={() => setIsInfoOpen(false)} className="close-button">
                Close
              </button>
            </div>
          </ReusableDialog>
          <div className="button-section">
            <button className="accept" onClick={handleAccept}>
              Add meal package
            </button>
            <button className="reject" onClick={handleReject}>
              No thank you
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
