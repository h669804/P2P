import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RouteSelectionDialog from '../../src/components/RouteSelectionDialog';

// Mock CSS
jest.mock('../../src/css/components/RouteSelection.css', () => ({}));
jest.mock('../../src/css/components/ApplyCancelButtons.css', () => ({}));

// Mock ReusableDialog
jest.mock('../../src/components/ReusableDialog', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, children }: any) =>
    isOpen ? (
      <div data-testid="mock-dialog">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

// Mock fetch
global.fetch = jest.fn();

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => (store[key] = value),
    clear: () => (store = {}),
  };
})();
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// ─────────────────────────────────────────────
// File: RouteSelectionDialog.test.tsx
// Tests: RouteSelectionDialog component
// Purpose: Verify route loading, error handling, and selection
// ─────────────────────────────────────────────

describe('RouteSelectionDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  test('viser feilmelding hvis reiseinformasjon mangler', async () => {
    render(<RouteSelectionDialog onRouteSelected={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /view voyages/i }));

    await screen.findByText(/Missing travel information/i);
  });

  test('viser meldingen "No routes found" hvis API returnerer tomt array', async () => {
    sessionStorage.setItem('departurePort', 'Bergen');
    sessionStorage.setItem('destinationPort', 'Oslo');
    sessionStorage.setItem('selectedDate', '2025-05-09');

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<RouteSelectionDialog onRouteSelected={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /view voyages/i }));

    await screen.findByText(/No routes found/i);
  });

  test('lagrer valgt rute og lukker dialog ved apply', async () => {
    sessionStorage.setItem('departurePort', 'Bergen');
    sessionStorage.setItem('destinationPort', 'Oslo');
    sessionStorage.setItem('selectedDate', '2025-05-09');

    const route = {
      id: 1,
      departurePort: 'Bergen',
      arrivalPort: 'Oslo',
      departureTime: '2025-05-09T08:00:00Z',
      arrivalTime: '2025-05-09T14:00:00Z',
      shipName: 'Havila',
      price: 799,
      availableSeats: 50,
      isActive: true,
      routeCode: 'BG-OS',
      description: '',
      stops: [],
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [route],
    });

    render(<RouteSelectionDialog onRouteSelected={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /view voyages/i }));

    await screen.findByText(/Bergen/i);
    fireEvent.click(screen.getByText(/Bergen/i));
    fireEvent.click(screen.getByText(/Apply/i));

    expect(sessionStorage.getItem('selectedRoute')).toContain('Havila');
  });
});
