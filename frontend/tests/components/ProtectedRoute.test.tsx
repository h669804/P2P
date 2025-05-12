import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import '@testing-library/jest-dom';

// Mock authService
jest.mock('../../src/contexts/AuthService', () => ({
  __esModule: true,
  default: {
    isLoggedIn: jest.fn(),
  },
}));

import authService from '../../src/contexts/AuthService';

// ─────────────────────────────────────────────
// Fil: ProtectedRoute.test.tsx
// Tester: ProtectedRoute-komponenten
// Hensikt: Verifiserer korrekt redirect eller rendering basert på innloggingsstatus
// ─────────────────────────────────────────────

describe('ProtectedRoute', () => {
  test('rendrer children når brukeren er autentisert', () => {
    (authService.isLoggedIn as jest.Mock).mockReturnValue(true);

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Beskyttet innhold</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Beskyttet innhold')).toBeInTheDocument();
  });

  test('omdirigerer til /login når brukeren ikke er autentisert', () => {
    (authService.isLoggedIn as jest.Mock).mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/profil']}>
        <ProtectedRoute>
          <div>Skal ikke rendres</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Skal ikke rendres')).not.toBeInTheDocument();
    expect(screen.queryByText('Beskyttet innhold')).not.toBeInTheDocument();
  });
});
