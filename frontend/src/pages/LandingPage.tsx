import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import authService from '../contexts/AuthService';
import '../css/pages/LandingPage.css';
import '../css/Base.css';

// ─────────────────────────────────────────────
// File: LandingPage.tsx
// Page: LandingPage
// Description: Startside som vises når brukeren besøker nettsiden.
// Context: Gir tilgang til innlogging, registrering eller direkte inngang til bookingflyten.
// ─────────────────────────────────────────────

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check authentication status
    const loggedIn = authService.isLoggedIn();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const user = authService.getCurrentUser();
      if (user) {
        setUserName(user.firstName);
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="landing-container">
        <div className="content">
          <h2 className="title">Welcome to</h2>
          <h2 className="title">Havila Voyages</h2>
          <p className="subtitle">Port-to-Port</p>

          {isLoggedIn ? (
            // Content for logged-in users - simplified to one button
            <div className="authenticated-content">
              <p className="welcome-message">Welcome back, {userName}!</p>
              <div className="button-section">
                <Link to="/departure" className="login-button">
                  New booking
                </Link>
              </div>
            </div>
          ) : (
            // Content for guests/non-authenticated users
            <div className="button-section">
              <Link to="/login" className="login-button">
                Login
              </Link>
              <Link to="/register" className="register-button">
                Register
              </Link>
              <Link to="/departure" className="guest-link">
                Continue as guest
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
