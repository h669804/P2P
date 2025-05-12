import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/pages/LoginPage.css';
import Navbar from '../components/Navbar';
import authService from '../contexts/AuthService';

// ─────────────────────────────────────────────
// File: LoginPage.tsx
// Page: LoginPage
// Description: Side med innloggingsskjema og lenke til registrering.
// Context: Brukes for autentisering av eksisterende brukere.
// ─────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);

    try {
      // Use auth service to login
      await authService.login(email, password);

      // Redirect to profile page on success
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="landing-container">
        <div className="form-container">
          <h1>Login</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <button type="submit" className="login-form-button">
              Login
            </button>

            <div className="text-center">
              Don't have an account? <Link to="/register">Register here</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
