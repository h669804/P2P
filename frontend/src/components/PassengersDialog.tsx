import { useState, useEffect } from 'react';
import ReusableDialog from './ReusableDialog';
import '../css/components/PassengersDialog.css';
import '../css/components/ApplyCancelButtons.css';
import { PassengerCounts } from '../interfaces/PassengerCounts';
import Counter from './Counter';

// ─────────────────────────────────────────────
// File: PassengersDialog.tsx
// Component: PassengersDialog
// Description: Dialogvindu som viser oversikt over passasjertyper og antall.
// Context: Brukes i Passengers.tsx.
// ─────────────────────────────────────────────

interface PassengersDialogProps {
  readonly onPassengersSelected: (selected: boolean) => void;
}

const LABEL_MAP: { [key: string]: string } = {
  adults: 'Adults',
  children: 'Children',
  infants: 'Infants',
  pensioners: 'Pensioners',
  students: 'Students',
};

function formatString(passengers: PassengerCounts): string[] {
  return Object.keys(passengers)
    .filter((key) => passengers[key as keyof PassengerCounts] > 0)
    .map((key) => {
      const count = passengers[key as keyof PassengerCounts];
      let label = LABEL_MAP[key];
      if (count === 1 && label.endsWith('s')) {
        label = label.slice(0, -1);
      } else if (count === 1 && label.endsWith('ren')) {
        label = label.slice(0, -3);
      }
      return `${count} ${label}`;
    });
}

export default function PassengersDialog({ onPassengersSelected }: PassengersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>([]);
  const [passengerCounts, setPassengerCounts] = useState<PassengerCounts>({
    adults: 0,
    children: 0,
    infants: 0,
    pensioners: 0,
    students: 0,
  });

  useEffect(() => {
    const storedPassengers = sessionStorage.getItem('selectedPassengers');
    if (storedPassengers) {
      const parsedPassengers: PassengerCounts = JSON.parse(storedPassengers);
      setPassengerCounts(parsedPassengers);
      setSelectedPassengers(formatString(parsedPassengers));
      onPassengersSelected(Object.values(parsedPassengers).some((count) => count > 0));
    }
  }, []);

  const handleCountChange = (label: string, updatedCount: number) => {
    const normalizedLabel = label.toLowerCase().split(' ')[0] as keyof PassengerCounts;
    setPassengerCounts((prevCounts) => ({
      ...prevCounts,
      [normalizedLabel]: updatedCount,
    }));
  };

  const handleApply = () => {
    const updatedCategories = formatString(passengerCounts);
    setSelectedPassengers(updatedCategories);
    onPassengersSelected(updatedCategories.length > 0);
    sessionStorage.setItem('selectedPassengers', JSON.stringify(passengerCounts));
    setIsOpen(false);
  };

  return (
    <div className="custom-passenger-dialog">
      <button
        className="custom-passenger-dialog-toggle"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        {selectedPassengers.length > 0 ? (
          <div className="passenger-summary">
            {selectedPassengers.map((category, index) => (
              <p key={category} className="passenger-category">
                {category}
                {index < selectedPassengers.length - 1 && ', '}
              </p>
            ))}
          </div>
        ) : (
          <p>Select passengers</p>
        )}
      </button>
      <ReusableDialog
        className="custom-passenger-dialog-open"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="custom-passenger-dialog-content">
          <Counter
            label="Adults"
            initialCount={passengerCounts.adults}
            onCountChange={handleCountChange}
          />
          <Counter
            label="Children"
            initialCount={passengerCounts.children}
            onCountChange={handleCountChange}
          />
          <Counter
            label="Infants"
            initialCount={passengerCounts.infants}
            onCountChange={handleCountChange}
          />
          <Counter
            label="Pensioners"
            initialCount={passengerCounts.pensioners}
            onCountChange={handleCountChange}
          />
          <Counter
            label="Students"
            initialCount={passengerCounts.students}
            onCountChange={handleCountChange}
          />
          <div className="apply-cancel">
            <button className="cancel" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button className="apply" onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      </ReusableDialog>
    </div>
  );
}
