"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label: string;
  pendingLabel: string;
  disabled?: boolean;
};

// A submit button that shows a different label while the form is sending.
export function SubmitButton({ label, pendingLabel, disabled = false }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="btn-primary"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
