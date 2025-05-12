import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import authService, { User } from '../contexts/AuthService';
import '../css/pages/ProfilePage.css';

// ─────────────────────────────────────────────
// File: ProfilePage.tsx
// Page: ProfilePage
// Description: Side som viser en oversikt over brukerens profilinformasjon.
// Context: Krever at en eksisterende bruker er logget inn.
// ─────────────────────────────────────────────

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from local storage
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // If no user is found, redirect to login
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container">
        <Navbar />
        <div className="loading-wrapper">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="profile-content">
        <div className="profile-card">
          <h2 className="section-title">Personal Information</h2>

          <div className="field-group">
            <div className="field-label">Email</div>
            <div className="field-value">{user?.email || 'test@email.com'}</div>
          </div>

          <div className="field-group">
            <div className="field-label">Account Created</div>
            <div className="field-value">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '5.3.2025'}
            </div>
          </div>

          <button className="action-button edit-button">Edit Information</button>
        </div>

        <div className="profile-card">
          <h2 className="section-title">Password</h2>

          <p className="password-text">
            For security reasons, we recommend changing your password regularly.
          </p>

          <button className="action-button change-button">Change Password</button>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>
    </div>
  );
}
