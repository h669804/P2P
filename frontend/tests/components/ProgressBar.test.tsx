import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProgressBar from '../../src/components/ProgressBar';

// ─────────────────────────────────────────────
// File: ProgressBar.test.tsx
// Tests: ProgressBar component
// Purpose: Ensure step navigation and rendering behave correctly under conditions
// ─────────────────────────────────────────────

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('ProgressBar', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
  });

  test('renders all steps in full mode', () => {
    render(
      <MemoryRouter>
        <ProgressBar activeStep={3} />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(11); // allSteps
  });

  test('renders condensed mobile steps on small screens', () => {
    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));
    });

    render(
      <MemoryRouter>
        <ProgressBar activeStep={3} />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(5); // mobileSteps
  });

  test('navigates only to previous or current steps', () => {
    const mockNavigate = jest.fn();

    jest.mocked(require('react-router-dom')).useNavigate = () => mockNavigate;

    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));
    });

    render(
      <MemoryRouter>
        <ProgressBar activeStep={2} />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // Should navigate
    fireEvent.click(buttons[4]); // Should NOT navigate

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/departure');
  });
});
