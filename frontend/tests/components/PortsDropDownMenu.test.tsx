import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PortsDropdownMenu from '../../src/components/PortsDropdownMenu';
import { Port } from '../../src/interfaces/IPort';

const mockPorts: Port[] = [
  { portID: 1, name: 'Bergen', location: 'Bergen' },
  { portID: 2, name: 'Trondheim', location: 'Trondheim' },
  { portID: 3, name: 'Ålesund', location: 'Ålesund' },
];

describe('PortsDropdownMenu', () => {
  const mockSelectPort = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    sessionStorage.clear();
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockPorts) }),
    ) as unknown as typeof fetch;
  });

  test('renders and loads ports', async () => {
    render(<PortsDropdownMenu onSelectPort={mockSelectPort} parent="departure" />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Bergen')).toBeInTheDocument();
      expect(screen.getByText('Trondheim')).toBeInTheDocument();
      expect(screen.getByText('Ålesund')).toBeInTheDocument();
    });
  });

  test('calls onSelectPort with selected port name', async () => {
    render(<PortsDropdownMenu onSelectPort={mockSelectPort} parent="departure" />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => screen.getByText('Trondheim'));
    fireEvent.click(screen.getByText('Trondheim'));

    expect(mockSelectPort).toHaveBeenCalledWith('Trondheim');
  });

  test('disables departure port on destination parent', async () => {
    sessionStorage.setItem('departurePort', 'Bergen');
    render(<PortsDropdownMenu onSelectPort={mockSelectPort} parent="destination" />);

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => screen.getByText('Bergen'));

    const disabledButton = screen.getByText('Bergen');
    expect(disabledButton).toHaveStyle('pointer-events: none');
    expect(disabledButton).toHaveStyle('opacity: 0.5');
  });

  test('shows error message on fetch failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API failed'));

    render(<PortsDropdownMenu onSelectPort={mockSelectPort} parent="departure" />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/error fetching ports/i)).toBeInTheDocument();
    });
  });
});
