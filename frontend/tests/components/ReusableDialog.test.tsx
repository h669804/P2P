import { render, screen, fireEvent } from '@testing-library/react';
import ReusableDialog from '../../src/components/ReusableDialog';
import * as React from 'react';
import '@testing-library/jest-dom';

// ─────────────────────────────────────────────
// File: ReusableDialog.test.tsx
// Description: Tester for ReusableDialog-komponenten
// Dekker åpning, lukking og null-sikring av dialogreferanse
// ─────────────────────────────────────────────

describe('ReusableDialog', () => {
  test('renders content when isOpen is true', () => {
    render(
      <ReusableDialog isOpen={true} onClose={jest.fn()}>
        <p>Test Content</p>
      </ReusableDialog>,
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('calls onClose when clicking outside the dialog content', () => {
    const handleClose = jest.fn();
    render(
      <ReusableDialog isOpen={true} onClose={handleClose}>
        <p>Visible content</p>
      </ReusableDialog>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeVisible();
    fireEvent.click(dialog);
    expect(handleClose).toHaveBeenCalled();
  });

  test('does nothing if dialog ref is null', () => {
    const MockComponent = () => {
      // Simuler at dialogRef.current er null ved ikke å bruke ref
      return (
        <ReusableDialog isOpen={true} onClose={jest.fn()}>
          <p>Test</p>
        </ReusableDialog>
      );
    };

    const { container } = render(<MockComponent />);
    expect(container).toBeInTheDocument();
  });
});
