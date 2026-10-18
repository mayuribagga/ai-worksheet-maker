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
      className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
