"use client";

import { useActionState } from "react";
import { generateWorksheet, type GenerateState } from "./actions";

const initialState: GenerateState = {};

export function GenerateForm() {
  const [state, formAction, pending] = useActionState(generateWorksheet, initialState);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? "Generating…" : "Generate worksheet"}
        </button>
      </form>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </p>
      )}

      {state.worksheet && (
        <pre className="whitespace-pre-wrap rounded-md border border-zinc-200 p-6 font-sans text-sm leading-relaxed dark:border-zinc-800">
          {state.worksheet}
        </pre>
      )}
    </div>
  );
}
