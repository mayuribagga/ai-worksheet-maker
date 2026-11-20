"use client";

import { useState } from "react";
import type { Worksheet } from "@/lib/worksheet";

const letters = ["A", "B", "C", "D"];

export function WorksheetView({ worksheet, label }: { worksheet: Worksheet; label: string }) {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <article className="flex flex-col gap-6 rounded-md border border-zinc-200 p-6 dark:border-zinc-800">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
        <h2 className="text-2xl font-semibold tracking-tight">{worksheet.title}</h2>
        <p className="text-zinc-600 dark:text-zinc-400">{worksheet.instructions}</p>
        <p className="pt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Name: ______________________ Date: ____________
        </p>
      </header>

      <ol className="flex flex-col gap-5">
        {worksheet.questions.map((question, i) => (
          <li key={i} className="flex flex-col gap-2">
            <p className="font-medium">
              {i + 1}. {question.prompt}
            </p>
            <ul className="grid gap-1 pl-5 sm:grid-cols-2">
              {question.choices.map((choice, j) => {
                const correct = showAnswers && j === question.answerIndex;
                return (
                  <li
                    key={j}
                    className={correct ? "font-semibold text-green-700 dark:text-green-400" : ""}
                  >
                    {letters[j]}) {choice}
                    {correct && " ✓"}
                  </li>
                );
              })}
            </ul>
            {showAnswers && (
              <p className="pl-5 text-sm text-zinc-600 dark:text-zinc-400">{question.explanation}</p>
            )}
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => setShowAnswers(!showAnswers)}
        className="w-fit rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        {showAnswers ? "Hide answer key" : "Show answer key"}
      </button>
    </article>
  );
}
