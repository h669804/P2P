// tests/components/PassengersDialog.test.tsx
import React from 'eslint-plugin-react-hooks';
import { render, screen, fireEvent } from '@testing-library/react';
import PassengersDialog from '../../src/components/PassengersDialog';
import '@testing-library/jest-dom';

jest.mock('../../src/components/ReusableDialog', () => ({
  __esModule: true,
  default: ({ isOpen, children }: any) => (isOpen ? <div role="dialog">{children}</div> : null),
}));

describe('PassengersDialog', () => {
  const onPassengersSelected = jest.fn();

  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test('renders initial text when no passengers are selected', () => {
    render(<PassengersDialog onPassengersSelected={onPassengersSelected} />);
    expect(screen.getByText('Select passengers')).toBeInTheDocument();
  });

  test('opens dialog on button click', () => {
    render(<PassengersDialog onPassengersSelected={onPassengersSelected} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('selects passengers and applies selection', () => {
    render(<PassengersDialog onPassengersSelected={onPassengersSelected} />);
    fireEvent.click(screen.getByRole('button'));
    const plusButtons = screen.getAllByText('+');
    fireEvent.click(plusButtons[0]);
    fireEvent.click(screen.getByText('Apply'));
    expect(onPassengersSelected).toHaveBeenCalledWith(true);
    expect(screen.getByText('1 Adult')).toBeInTheDocument();
  });

  test('loads passengers from sessionStorage', () => {
    sessionStorage.setItem(
      'selectedPassengers',
      JSON.stringify({ adults: 2, children: 1, infants: 0, pensioners: 0, students: 0 }),
    );
    render(<PassengersDialog onPassengersSelected={onPassengersSelected} />);
    expect(screen.getByText((content) => content.includes('2 Adults'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('1 Child'))).toBeInTheDocument();
    expect(onPassengersSelected).toHaveBeenCalledWith(true);
  });

  test('cancel closes dialog', () => {
    render(<PassengersDialog onPassengersSelected={onPassengersSelected} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
