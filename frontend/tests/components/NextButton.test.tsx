import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NextButton from '../../src/components/NextButton';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

// ─────────────────────────────────────────────
// File: NextButton.test.tsx
// Target: NextButton.tsx
// Component: NextButton
// Description: Tester at knappen reagerer korrekt på interaksjon
// Context: Brukes på alle sider i bookingflyten.
// Coverage:
//   - Riktig tekst vises
//   - Knapp er deaktivert når isEnabled = false
//   - Knapp er aktiv og navigerer til korrekt rute når isEnabled = true
// ─────────────────────────────────────────────

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('NextButton', () => {
  const mockedNavigate = useNavigate as jest.Mock;

  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  test('should be disabled when isEnabled is false', () => {
    render(
      <MemoryRouter>
        <NextButton route="/next" isEnabled={false} />
      </MemoryRouter>,
    );
    const button = screen.getByRole('button', { name: /next/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled');
  });

  test('should be enabled and call navigate when clicked', async () => {
    const navigateMock = jest.fn();
    mockedNavigate.mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <NextButton route="/next" isEnabled={true} />
      </MemoryRouter>,
    );
    const button = screen.getByRole('button', { name: /next/i });
    expect(button).toBeEnabled();
    expect(button).toHaveClass('active');

    await userEvent.click(button);
    expect(navigateMock).toHaveBeenCalledWith('/next');
  });
});
