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
      className="inline-flex items-center rounded-full px-3 py-1.5 font-display text-sm font-medium text-red-700 underline decoration-red-200 decoration-2 underline-offset-4 transition-colors hover:bg-red-50 hover:decoration-red-400 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete worksheet"}
    </button>
  );
}
