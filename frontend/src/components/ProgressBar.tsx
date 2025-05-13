import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "../css/components/ProgressBar.css";

// ─────────────────────────────────────────────
// File: ProgressBar.tsx
// Component: ProgressBar
// Description: Fremgangsindikator som tilpasser seg skjermstørrelse og fremhever hvor i bookingflyten brukeren befinner seg.
// Context: Brukes på alle sider i bookingflyten.
// ─────────────────────────────────────────────

type ProgressBarProps = {
  activeStep: number;
};

const allSteps = [
  "Departure",
  "Destination",
  "Passengers",
  "Travel Date",
  "Choose Route",
  "Cabin",
  "Meal Package",
  "Passenger Details",
  "Summary",
  "Payment Option",
  "Payment",
];

const mobileSteps = ["Departure", "Passengers", "Cabin", "Summary", "Payment"];

// Eksplicit mapping mellom detaljerte steg og mobilvisningens hovedtrinn
const stepToMobileGroup: Record<string, string> = {
  Departure: "Departure",
  Destination: "Departure",
  Passengers: "Passengers",
  "Travel Date": "Passengers",
  "Choose Route": "Cabin",
  Cabin: "Cabin",
  "Meal Package": "Cabin",
  "Passenger Details": "Summary",
  Summary: "Summary",
  "Payment Option": "Payment",
  Payment: "Payment",
};

const ProgressBar: React.FC<ProgressBarProps> = ({ activeStep }) => {
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(
    window.innerWidth <= 600
  );
  const [isShortScreen, setIsShortScreen] = useState(window.innerHeight <= 500);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsVerySmallScreen(window.innerWidth <= 600);
      setIsShortScreen(window.innerHeight <= 500);

      const windowHeight = window.innerHeight;
      const navbarHeight = Math.max(windowHeight * 0.07, 3.7 * 16);

      let navbarOffset;
      if (windowHeight >= 730) {
        navbarOffset = 16;
      } else {
        const factor = (730 - windowHeight) / (730 - 350);
        navbarOffset = 16 + factor * 16;
      }

      document.documentElement.style.setProperty(
        "--navbar-height",
        `${navbarHeight}px`
      );
      document.documentElement.style.setProperty(
        "--navbar-offset",
        `${navbarOffset}px`
      );
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const useVerticalLayout = isShortScreen;

  const stepsToRender =
    isVerySmallScreen || useVerticalLayout ? mobileSteps : allSteps;

  // Kartlegg nåværende steg til riktig steg i mobilvisning
  const currentStepName = allSteps[activeStep];
  const mappedMobileStep = stepToMobileGroup[currentStepName];
  const displayActiveStep =
    isVerySmallScreen || useVerticalLayout
      ? mobileSteps.indexOf(mappedMobileStep)
      : activeStep;

  const handleStepClick = (index: number, isMobile = false) => {
    const targetIndex = isMobile ? allSteps.indexOf(mobileSteps[index]) : index;

    if (targetIndex <= activeStep) {
      const route = `/${allSteps[targetIndex]
        .replace(/\s+/g, "")
        .toLowerCase()}`;
      navigate(route);
    }
  };

  return (
    <div
      className={`progress-container 
        ${isVerySmallScreen ? "mobile-view" : ""} 
        ${useVerticalLayout ? "vertical" : ""}`}
    >
      {stepsToRender.map((step, index) => {
        const isCompleted =
          isVerySmallScreen || useVerticalLayout
            ? allSteps.indexOf(stepToMobileGroup[step]) < activeStep
            : index < activeStep;

        const isActive = index === displayActiveStep;

        const stepStatus = isActive ? "active" : isCompleted ? "completed" : "";

        return (
          <Fragment key={step}>
            <button
              className={`progress-button-wrapper ${stepStatus}`}
              onClick={() => handleStepClick(index, isVerySmallScreen)}
            >
              <img
                src={`assets/progress-bar/${step.replace(/\s+/g, "")}${
                  isCompleted ? "-completed" : ""
                }.svg`}
                className="progress-icon"
                alt={step}
              />
            </button>
            {index < stepsToRender.length - 1 && (
              <div className={`progress-line step ${stepStatus}`} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default ProgressBar;
