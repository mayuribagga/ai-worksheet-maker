"use client";

import { useId, useState } from "react";
import { describeTopic } from "@/data/curriculum";
import type { Worksheet, WorksheetMeta } from "@/lib/worksheet";
import { CheckIcon } from "./Icons";
import { TopicTags } from "./TopicTags";

const letters = ["A", "B", "C", "D"];

// A worksheet on screen, styled like a sheet of paper, with an answer key switch.
export function WorksheetView({ worksheet, meta }: { worksheet: Worksheet; meta: WorksheetMeta }) {
  const [showAnswers, setShowAnswers] = useState(false);
  const switchId = useId();
  const description = describeTopic(meta.grade, meta.subject, meta.topicId);

  return (
    <article className="animate-sheet-in overflow-hidden rounded-3xl border-2 border-line bg-white shadow-[0_10px_30px_-12px_rgb(24_0_173/0.25)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line bg-paper/60 px-6 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <TopicTags subject={meta.subject} description={description} size="sm" />
          <span className="text-sm text-muted">{description.topicName}</span>
        </div>

        {/* A real switch: keyboard and screen reader friendly. */}
        <label htmlFor={switchId} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          Answer key
          <button
            id={switchId}
            type="button"
            role="switch"
            aria-checked={showAnswers}
            onClick={() => setShowAnswers(!showAnswers)}
            className="relative h-6 w-11 rounded-full bg-line transition-colors aria-checked:bg-violet"
          >
            <span
              aria-hidden
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${showAnswers ? "translate-x-5" : ""}`}
            />
          </button>
        </label>
      </div>

      <div className="px-6 py-7 sm:px-10">
        <header className="flex flex-col gap-1.5">
          <h2 className="font-display text-[1.75rem] leading-tight font-bold tracking-tight text-ink">
            {worksheet.title}
          </h2>
          <p className="text-muted">{worksheet.instructions}</p>
          <div className="mt-3 grid grid-cols-[auto_1fr_auto_8rem] items-end gap-x-2 text-sm text-muted">
            <span>Name</span>
            <span className="border-b-2 border-dotted border-lilac" />
            <span>Date</span>
            <span className="border-b-2 border-dotted border-lilac" />
          </div>
        </header>

        <ol className="mt-8 flex flex-col gap-6">
          {worksheet.questions.map((question, i) => (
            <li key={i} className="grid grid-cols-[2rem_1fr] gap-x-2">
              <span className="font-display text-lg leading-6 font-bold text-violet">{i + 1}</span>
              <div className="flex flex-col gap-2.5">
                <p className="leading-6 text-text">{question.prompt}</p>
                <ul className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
                  {question.choices.map((choice, j) => {
                    const correct = showAnswers && j === question.answerIndex;
                    return (
                      <li
                        key={j}
                        className={`flex items-center gap-2.5 rounded-xl px-2 py-1 transition-colors ${correct ? "bg-violet/10 text-ink" : ""}`}
                      >
                        <span
                          aria-hidden
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${correct ? "border-violet bg-violet text-white" : "border-lilac"}`}
                        >
                          {correct && <CheckIcon className="h-3 w-3" />}
                        </span>
                        <span>
                          <span className="text-muted">{letters[j]}.</span> {choice}
                          {correct && <span className="sr-only"> (correct answer)</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {showAnswers && (
                  <p className="animate-pop rounded-xl bg-paper px-3 py-2 text-sm text-muted">
                    {question.explanation}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
