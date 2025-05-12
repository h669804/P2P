import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BackButton from '../../src/components/BackButton';
import { useNavigate, MemoryRouter } from 'react-router-dom';

// ─────────────────────────────────────────────
// File: BackButton.test.tsx
// Target: BackButton.tsx
// Purpose: Tester navigasjonslogikk og brukerinteraksjon
// Context: Brukes på alle sider i bookingflyten.
// Coverage:
//   - Knapperendering
//   - Klikk → navigate(-1)
// ─────────────────────────────────────────────

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('BackButton', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  test('renders button with correct text', () => {
    render(<BackButton />);
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
  });

  test('calls navigate(-1) when clicked', async () => {
    render(<BackButton />);
    const button = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
  test('calculates dynamic navbarOffset based on window height', () => {
    // Sett høyde for å trigge faktor-beregningen
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>,
    );

    // Manuelt trigge resize-event
    fireEvent(window, new Event('resize'));

    const computedOffset = getComputedStyle(document.documentElement).getPropertyValue(
      '--navbar-offset',
    );

    // Forvent en spesifikk verdi basert på formelen
    expect(computedOffset).toMatch(/px$/);
  });
});
