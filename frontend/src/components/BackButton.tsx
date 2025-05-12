import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/components/BackButton.css';

// ─────────────────────────────────────────────
// File: BackButton.tsx
// Component: BackButton
// Description: Navigasjonsknapp for å gå tilbake i bookingprosessen.
// Context: Brukes på alle sider i bookingflyten.
// ─────────────────────────────────────────────

export default function BackButton() {
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const navbarHeight = Math.max(windowHeight * 0.07, 3.7 * 16);

      let navbarOffset;
      if (windowHeight >= 730) {
        navbarOffset = 16;
      } else {
        const factor = (730 - windowHeight) / (730 - 350);
        navbarOffset = 16 + factor * 16;
      }

      // Oppdater CSS custom properties
      document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
      document.documentElement.style.setProperty('--navbar-offset', `${navbarOffset}px`);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <button className="back-button" ref={buttonRef} onClick={() => navigate(-1)}>
      <span className="arrow">←</span> Previous
    </button>
  );
}
