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

// Mobile condensed steps - key milestone steps to show on mobile
const mobileSteps = ["Departure", "Passengers", "Cabin", "Summary", "Payment"];

// Helper function to map current step index to mobile step index
const mapToMobileIndex = (currentIndex: number) => {
  // Find the nearest mobile step that is less than or equal to current step
  const currentStep = allSteps[currentIndex];

  // If the current step is in mobileSteps, return its index
  const mobileIndex = mobileSteps.indexOf(currentStep);
  if (mobileIndex !== -1) return mobileIndex;

  // Otherwise find the nearest mobile step that comes before current step
  let nearestIndex = 0;
  for (let i = 0; i < mobileSteps.length; i++) {
    const mobileStepIndex = allSteps.indexOf(mobileSteps[i]);
    if (mobileStepIndex <= currentIndex) {
      nearestIndex = i;
    } else {
      break;
    }
  }

  return nearestIndex;
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

  const handleStepClick = (index: number, isMobile = false) => {
    // Get the appropriate step index to navigate to
    const targetIndex = isMobile ? allSteps.indexOf(mobileSteps[index]) : index;

    // Only allow navigation to completed or current steps
    if (targetIndex <= activeStep) {
      // Convert step name to route (e.g., "Travel Date" → "/travel-date")
      const route = `/${allSteps[targetIndex].replace(/\s+/g, "").toLowerCase()}`;
      navigate(route);
    }
  };

  // Determine if we should use vertical layout based on screen height
  const useVerticalLayout = isShortScreen;

  // Determine which steps array to use based on screen size or layout
  // Always use mobile steps when in vertical layout
  const stepsToRender =
    isVerySmallScreen || useVerticalLayout ? mobileSteps : allSteps;

  // Map the active step to the correct index in the condensed array if on mobile or vertical layout
  const displayActiveStep =
    isVerySmallScreen || useVerticalLayout
      ? mapToMobileIndex(activeStep)
      : activeStep;

  return (
    <div
      className={`progress-container 
                    ${isVerySmallScreen ? "mobile-view" : ""} 
                    ${useVerticalLayout ? "vertical" : ""}`}
    >
      {stepsToRender.map((step, index) => {
        const stepInFullArray = allSteps.indexOf(step);
        const isCompleted = isVerySmallScreen
          ? stepInFullArray < activeStep
          : index < activeStep;

        const isActive = isVerySmallScreen
          ? stepInFullArray === activeStep ||
            (index === displayActiveStep && stepInFullArray > activeStep)
          : index === activeStep;

        const stepStatus = isActive ? "active" : isCompleted ? "completed" : "";

        return (
          <Fragment key={allSteps.indexOf(step)}>
            <button
              className={`progress-button-wrapper ${stepStatus}`}
              onClick={() => handleStepClick(index, isVerySmallScreen)}
            >
              <img
                src={`./src/assets/progress-bar/${step.replace(/\s+/g, "")}${isCompleted ? "-completed" : ""}.svg`}
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
