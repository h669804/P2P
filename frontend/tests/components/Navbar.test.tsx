import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../src/components/Navbar';
import { MemoryRouter } from 'react-router-dom';

// ─────────────────────────────────────────────
// File: Navbar.test.tsx
// Description: Tester for Navbar-komponenten
// ─────────────────────────────────────────────

// Mock AuthService
jest.mock('../../src/contexts/AuthService', () => ({
  __esModule: true,
  default: {
    isLoggedIn: jest.fn(() => false),
    getCurrentUser: jest.fn(() => null),
  },
  User: {}, // dummy export
}));

describe('Navbar', () => {
  test('renders logo and default links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByAltText(/havila voyages logo/i)).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Reservations')).toBeInTheDocument();
    expect(screen.getByText('Loyalty Program')).toBeInTheDocument();
  });

  test('renders user name if logged in', () => {
    const mockUser = { firstName: 'Erlend' };
    const authService = require('../../src/contexts/AuthService').default;
    authService.isLoggedIn.mockReturnValue(true);
    authService.getCurrentUser.mockReturnValue(mockUser);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByText('Erlend')).toBeInTheDocument();
  });

  beforeAll(() => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
  });

  test('toggles menu when hamburger is clicked', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const hamburger = screen.getByTestId('hamburger');
    expect(document.querySelector('.navbar-menu')?.className).not.toContain('open');
    fireEvent.click(hamburger);
    expect(document.querySelector('.navbar-menu')?.className).toContain('open');
  });
});
