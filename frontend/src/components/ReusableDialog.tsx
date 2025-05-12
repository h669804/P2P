import { useRef, useEffect } from 'react';

// ─────────────────────────────────────────────
// File: ReusableDialog.tsx
// Component: ReusableDialog
// Description: Grunnkomponent for dialogvinduer, med felles struktur og oppførsel.
// Context: Brukes som base for alle dialogvinduer i bookingflyten.
// ─────────────────────────────────────────────

interface ReusableDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export default function ReusableDialog({
  isOpen,
  onClose,
  children,
  className,
}: ReusableDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleDialogClose = () => {
      onClose();
    };

    dialog.addEventListener('close', handleDialogClose);
    return () => dialog.removeEventListener('close', handleDialogClose);
  }, [onClose]);

  const handleClickOutside = (e: MouseEvent) => {
    if (dialogRef.current && e.target === dialogRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.addEventListener('click', handleClickOutside);
    return () => dialog.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={className || ''}
      aria-modal="true" // behold denne for bedre støtte i screenreadere
    >
      {children}
    </dialog>
  );
}
