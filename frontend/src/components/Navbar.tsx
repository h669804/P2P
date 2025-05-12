import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authService, { User } from "../contexts/AuthService";
import "../css/components/Navbar.css";

// ─────────────────────────────────────────────
// File: Navbar.tsx
// Component: Navbar
// Description: Navigasjonsbar med lenker til blant annet profilsiden.
// Context: Brukes på alle sider i prosjektet.
// ─────────────────────────────────────────────

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authService.isLoggedIn();

      if (loggedIn) {
        const user = authService.getCurrentUser();
        if (user) {
          setUser(user);
        }
      }
    };

    checkAuth();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/assets/logo.svg" alt="Havila Voyages Logo" />
        </Link>
      </div>

      {/* Hamburger Icon */}
      <button
        className={`navbar-hamburger ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
        data-testid="hamburger"
      >
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </button>

      {/* Dropdown Menu */}
      <div className={`navbar-menu ${isOpen ? "open" : ""}`}>
        {/* Update the Profile link to go directly to the profile page */}
        <Link to="/profile" className="navbar-link">
          {user == null ? "Profile" : user.firstName}
        </Link>
        <Link to="/reservations" className="navbar-link">
          Reservations
        </Link>
        <Link to="/loyalty" className="navbar-link">
          Loyalty Program
        </Link>
      </div>
    </nav>
  );
}
