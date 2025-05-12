import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../contexts/AuthService';

// ─────────────────────────────────────────────
// File: ProtectedRoute.tsx
// Component: ProtectedRoute
// Description: Beskytter sider som krever at brukeren er autentisert.
// Context: Brukes for brukerrelaterte sider som profilsiden.
// ─────────────────────────────────────────────

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = authService.isLoggedIn();

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
