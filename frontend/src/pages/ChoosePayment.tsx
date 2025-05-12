import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import "../css/pages/ChoosePayment.css";
import NextButton from "../components/NextButton";

// ─────────────────────────────────────────────
// File: ChoosePayment.tsx
// Page: ChoosePayment
// Description: Side der brukeren velger om hele beløpet eller kun depositum skal betales.
// Context: Del av bookingflyten, plassert etter oppsummeringssiden (Summary.tsx).
// ─────────────────────────────────────────────

export default function Payment() {
  const [depositAmount, setDepositAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [paymentOption, setPaymentOption] = useState<"deposit" | "full" | null>(
    "full"
  );
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const bookingData = sessionStorage.getItem("bookingData");
    if (bookingData) {
      const parsedData = JSON.parse(bookingData);
      console.log("Parsed booking data:", parsedData);
      const total = parsedData.totalPrice;
      const deposit = Math.round(total * 0.7);
      setDepositAmount(deposit);
      setFinalAmount(total);
    }
  }, []);

  useEffect(() => {
    setIsFormValid(!!paymentOption && termsAccepted && privacyAccepted);
  }, [paymentOption, termsAccepted, privacyAccepted]);

  return (
    <div className="page">
      <Navbar />
      <BackButton />
      <ProgressBar activeStep={9} />

      <div className="payment-wrapper">
        <div className="payment-content">
          <h1 className="payment-title">Choose your payment</h1>

          <div className="payment-options">
            <button
              className={`payment-option deposit ${paymentOption === "deposit" ? "selected" : ""}`}
              onClick={() => setPaymentOption("deposit")}
            >
              <div className="payment-option-info">
                <div className="payment-option-type">Deposit</div>
                <div className="payment-option-amount">NOK {depositAmount}</div>
              </div>
              <div className="radio-button">
                <div
                  className={`radio-button-inner ${paymentOption === "deposit" ? "selected" : ""}`}
                />
              </div>
            </button>

            <button
              className={`payment-option final ${paymentOption === "full" ? "selected" : ""}`}
              onClick={() => setPaymentOption("full")}
            >
              <div className="payment-option-info">
                <div className="payment-option-type">Final payment</div>
                <div className="payment-option-amount">NOK {finalAmount}</div>
              </div>
              <div className="radio-button">
                <div
                  className={`radio-button-inner ${paymentOption === "full" ? "selected" : ""}`}
                />
              </div>
            </button>
          </div>

          <div className="terms-section">
            <button
              className="terms-row"
              onClick={() => setTermsAccepted(!termsAccepted)}
            >
              <div className="terms-checkbox">
                {termsAccepted && (
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path
                      fill="#333"
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                  </svg>
                )}
              </div>
              <div className="terms-text">
                I have read and accepted the Terms & Conditions
              </div>
            </button>

            <button
              className="terms-row"
              onClick={() => setPrivacyAccepted(!privacyAccepted)}
            >
              <div className="terms-checkbox">
                {privacyAccepted && (
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path
                      fill="#333"
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                  </svg>
                )}
              </div>
              <div className="terms-text">
                I have read and accepted the Privacy Policy
              </div>
            </button>
          </div>
        </div>
      </div>

      <NextButton isEnabled={isFormValid} route="/payment" />
    </div>
  );
}
