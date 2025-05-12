import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CabinSelectionDialog from '../../src/components/CabinSelectionDialog';
import React from 'react';

// Mock cabin data
const mockCabins = [
  {
    id: 1,
    name: 'Arctic Superior',
    imagePath: '/arctic.jpg',
    description: 'Spacious and modern',
    options: [
      { type: 'Flex', price: 2000 },
      { type: 'Saver', price: 1500 },
    ],
  },
];

// Mock sessionStorage
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => mockCabins,
  });
  sessionStorage.clear();
});

test('opens dialog and selects cabin', async () => {
  const onCabinSelected = jest.fn();

  render(<CabinSelectionDialog onCabinSelected={onCabinSelected} />);

  // Åpne dialog
  fireEvent.click(screen.getByRole('button', { name: /select your cabin/i }));

  // Vent på at kabinene skal vises
  const flexOption = await screen.findByText(/Flex/);
  expect(flexOption).toBeInTheDocument();

  // Velg kabin
  fireEvent.click(flexOption);

  // Trykk apply
  fireEvent.click(screen.getByRole('button', { name: /apply/i }));

  await waitFor(() => {
    expect(onCabinSelected).toHaveBeenCalledWith(true);
    expect(sessionStorage.getItem('selectedCabin')).toContain('Arctic Superior');
  });
});

test('toggles description panel', async () => {
  const onCabinSelected = jest.fn();

  render(<CabinSelectionDialog onCabinSelected={onCabinSelected} />);

  // Åpne dialog
  fireEvent.click(screen.getByRole('button', { name: /select your cabin/i }));

  const titleButton = await screen.findByRole('button', { name: /arctic superior/i });
  fireEvent.click(titleButton);

  expect(await screen.findByText(/spacious and modern/i)).toBeInTheDocument();
});
