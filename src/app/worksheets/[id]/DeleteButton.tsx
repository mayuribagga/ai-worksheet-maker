"use client";

import { useFormStatus } from "react-dom";

// Asks before deleting, since a deleted worksheet can't be recovered.
export function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm("Delete this worksheet? This can't be undone.")) {
          event.preventDefault();
        }
      }}
      className="w-fit rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
    >
      {pending ? "Deleting…" : "Delete worksheet"}
    </button>
  );
}
