export interface CounterProps {
  label: string; // Label should be a string
  initialCount: number;
  onCountChange: (label: string, updatedCount: number) => void; // Function that takes the label and updated count
}
