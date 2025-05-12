import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '../../src/components/Counter';
import '@testing-library/jest-dom';

// ─────────────────────────────────────────────
// File: Counter.test.tsx
// Description: Tester for Counter-komponenten
// ─────────────────────────────────────────────

describe('Counter', () => {
  test('renders with label and initial count', () => {
    render(<Counter label="Adults" initialCount={2} onCountChange={jest.fn()} />);

    expect(screen.getByText('Adults')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('increments count and calls onCountChange', () => {
    const handleChange = jest.fn();
    render(<Counter label="Children" initialCount={0} onCountChange={handleChange} />);

    const incrementButton = screen.getByText('+');
    fireEvent.click(incrementButton);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(handleChange).toHaveBeenCalledWith('Children', 1);
  });

  test('decrements count but not below zero', () => {
    const handleChange = jest.fn();
    render(<Counter label="Seniors" initialCount={1} onCountChange={handleChange} />);

    const decrementButton = screen.getByText('−');
    fireEvent.click(decrementButton);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(handleChange).toHaveBeenCalledWith('Seniors', 0);

    fireEvent.click(decrementButton);
    expect(screen.getByText('0')).toBeInTheDocument(); // fortsatt 0
    expect(handleChange).toHaveBeenCalledWith('Seniors', 0); // fortsatt kalt, men samme verdi
  });

  test('updates count if initialCount changes', () => {
    const { rerender } = render(
      <Counter label="Teens" initialCount={1} onCountChange={jest.fn()} />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();

    rerender(<Counter label="Teens" initialCount={5} onCountChange={jest.fn()} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
