"use client";

import { useState } from "react";
import type { Worksheet } from "@/lib/worksheet";

const letters = ["A", "B", "C", "D"];

export function WorksheetView({ worksheet, label }: { worksheet: Worksheet; label: string }) {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <article className="card flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-violet">{label}</p>
        <h2 className="font-display text-2xl font-black tracking-tight text-ink">{worksheet.title}</h2>
        <p className="text-muted">{worksheet.instructions}</p>
        <p className="pt-2 text-sm text-muted">
          Name: ______________________ Date: ____________
        </p>
      </header>

      <ol className="flex flex-col gap-5">
        {worksheet.questions.map((question, i) => (
          <li key={i} className="flex flex-col gap-2">
            <p className="">
              {i + 1}. {question.prompt}
            </p>
            <ul className="grid gap-1 pl-5 sm:grid-cols-2">
              {question.choices.map((choice, j) => {
                const correct = showAnswers && j === question.answerIndex;
                return (
                  <li
                    key={j}
                    className={correct ? "font-semibold text-green-700" : ""}
                  >
                    {letters[j]}) {choice}
                    {correct && " ✓"}
                  </li>
                );
              })}
            </ul>
            {showAnswers && (
              <p className="pl-5 text-sm text-muted">{question.explanation}</p>
            )}
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => setShowAnswers(!showAnswers)}
        className="btn-secondary w-fit"
      >
        {showAnswers ? "Hide answer key" : "Show answer key"}
      </button>
    </article>
  );
}
