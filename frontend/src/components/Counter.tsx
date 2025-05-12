import { useState, useEffect } from 'react';
import { CounterProps } from '../interfaces/CounterProps';
import '../css/components/Counter.css';

// ─────────────────────────────────────────────
// File: Counter.tsx
// Component: Counter
// Description: Komponent for å vise og endre en tellende verdi.
// Context: Brukes i PassengersDialog.tsx for valg av antall passasjerer.
// ─────────────────────────────────────────────

const Counter = ({ label, initialCount, onCountChange }: CounterProps) => {
  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const [count, setCount] = useState(initialCount);

  const handleIncrement = () => {
    const updatedCount = count + 1;
    setCount(updatedCount);
    onCountChange(label, updatedCount);
  };

  const handleDecrement = () => {
    const updatedCount = Math.max(0, count - 1);
    setCount(updatedCount);
    onCountChange(label, updatedCount);
  };

  return (
    <div className="counter">
      <span className="counter__label">{label}</span>
      <div className="counter__controls">
        <button className="counter__btn" onClick={handleDecrement}>
          −
        </button>
        <span className="count">{count}</span>
        <button className="counter__btn" onClick={handleIncrement}>
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;
