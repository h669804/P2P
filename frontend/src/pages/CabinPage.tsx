import { useState } from 'react';
import NextButton from '../components/NextButton';
import BackButton from '../components/BackButton';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import CabinSelectionDialog from '../components/CabinSelectionDialog';
import '../css/components/CabinDialog.css';

// ─────────────────────────────────────────────
// File: CabinPage.tsx
// Page: CabinPage
// Description: Side der brukeren velger ønsket kabin.
// Context: Del av bookingflyten, plassert etter valg av rute.
// ─────────────────────────────────────────────

export default function CabinSelection() {
  const [isCabinSelected, setIsCabinSelected] = useState(false);

  return (
    <>
      <Navbar />
      <ProgressBar activeStep={5} />
      <BackButton />
      <div className="page">
        <div className="page-title-wrapper">
          <h1 className="page-title">Select your cabin</h1>
        </div>
        <CabinSelectionDialog onCabinSelected={setIsCabinSelected} />
        <NextButton isEnabled={isCabinSelected} route="/mealpackage" />
      </div>
    </>
  );
}
