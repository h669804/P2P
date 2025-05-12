import Navbar from "../components/Navbar";
import "../css/pages/Confirmation.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// File: Confirmation.tsx
// Page: Confirmation
// Description: Viser bekreftelse på fullført booking samt mulighet for å gi tilbakemelding.
// Context: Avsluttende side i bookingflyten.
// ─────────────────────────────────────────────

const susStatements = [
  "I think that I would like to use this system frequently.",
  "I found the system unnecessarily complex.",
  "I thought the system was easy to use.",
  "I think that I would need the support of a technical person to use this system.",
  "I found the various functions in this system were well integrated.",
  "I thought there was too much inconsistency in this system.",
  "I would imagine that most people would learn to use this system very quickly.",
  "I found the system very cumbersome to use.",
  "I felt very confident using the system.",
  "I needed to learn a lot of things before I could get going with this system.",
];

const options = {
  1: "Strongly disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly agree",
};

Object.entries(options);

export default function Confirmation() {
  const [responses, setResponses] = useState<number[]>(Array(10).fill(0));
  const [submitted, setSubmitted] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const handleChange = (index: number, value: number) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { responses };

    try {
      const res = await fetch(`${baseUrl}/api/feedback/sus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Submission failed: ${data.message || "Unknown error"}`);
        return;
      }

      console.log(`SUS Score: ${data.susScore}`);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting your feedback.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <h1 className="page-title">Thanks for booking!</h1>
        <h2 className="page-subtitle">Help us improve</h2>
        <form className="sus-scheme" onSubmit={handleSubmit}>
          {susStatements.map((statement, i) => (
            <div key={i + 1} className="sus-question">
              <p>
                {i + 1}. {statement}
              </p>
              <div className="sus-options">
                {Object.entries(options).map(([value, label]) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={value}
                      checked={responses[i] === Number(value)}
                      onChange={() => handleChange(i, Number(value))}
                      required
                    />
                    {value} <span>({label})</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          {submitted ? (
            <button type="button" onClick={() => navigate("/")}>
              Back to home
            </button>
          ) : (
            <button type="submit">Submit Feedback</button>
          )}
        </form>
      </div>
    </>
  );
}
