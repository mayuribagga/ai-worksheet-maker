"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { describeTopic } from "@/data/curriculum";
import type { Sample } from "@/data/samples";
import { subjectStyles } from "@/lib/subjects";
import { SubjectIcon } from "./Icons";

const letters = ["A", "B", "C", "D"];

// The home page's live sample: subject tabs that swap a stack of worksheet pages.
export function SamplePreview({ samples }: { samples: Sample[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const sample = samples[active];
  const description = describeTopic(sample.meta.grade, sample.meta.subject, sample.meta.topicId);

  // Arrow keys move between tabs, as screen reader users expect.
  function onKeyDown(event: KeyboardEvent) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const next = (active + step + samples.length) % samples.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        role="tablist"
        aria-label="Sample worksheets"
        onKeyDown={onKeyDown}
        className="flex gap-1 rounded-full border-2 border-line bg-white p-1"
      >
        {samples.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`sample-tab-${s.id}`}
            aria-selected={i === active}
            aria-controls="sample-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors hover:text-ink aria-selected:bg-ink aria-selected:text-white"
          >
            <SubjectIcon subject={s.meta.subject} className="h-4 w-4" />
            {subjectStyles[s.meta.subject].short}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-[25rem]">
        {/* Two pages underneath the sample, fanned out like a stack on a desk. */}
        <div
          aria-hidden
          style={{ "--tilt": "-6deg", animationDelay: "60ms" } as React.CSSProperties}
          className="animate-settle absolute inset-0 rounded-2xl bg-lilac"
        />
        <div
          aria-hidden
          style={{ "--tilt": "4deg", animationDelay: "140ms" } as React.CSSProperties}
          className="animate-settle absolute inset-0 rounded-2xl bg-blush"
        />

        <div
          role="tabpanel"
          id="sample-panel"
          aria-labelledby={`sample-tab-${sample.id}`}
          style={{ animationDelay: "220ms" } as React.CSSProperties}
          className="animate-settle relative"
        >
          <article
            key={sample.id}
            className="animate-sheet-in relative h-[31rem] overflow-hidden rounded-2xl border-2 border-line bg-white px-7 pt-6 shadow-[0_18px_40px_-18px_rgb(24_0_173/0.35)]"
          >
            {/* A strip of tape holding the page down. */}
            <span
              aria-hidden
              className="absolute -top-1 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-3deg] rounded-sm bg-blush/70"
            />
            <p className="mt-2 flex items-center gap-2 text-xs text-muted">
              <span aria-hidden className={`h-2 w-2 rounded-full ${subjectStyles[sample.meta.subject].dot}`} />
              {description.gradeLabel} {description.subjectName}, {description.topicName}
            </p>
            <h3 className="mt-2 font-display text-[1.4rem] leading-tight font-bold text-ink">
              {sample.worksheet.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{sample.worksheet.instructions}</p>
            <div className="mt-3 grid grid-cols-[auto_1fr_auto_5rem] items-end gap-x-2 text-xs text-muted">
              <span>Name</span>
              <span className="border-b-2 border-dotted border-lilac" />
              <span>Date</span>
              <span className="border-b-2 border-dotted border-lilac" />
            </div>

            <ol className="mt-5 flex flex-col gap-4 text-sm">
              {sample.worksheet.questions.slice(0, 3).map((question, i) => (
                <li key={i} className="grid grid-cols-[1.25rem_1fr] gap-x-1.5">
                  <span className="font-display font-bold text-violet">{i + 1}</span>
                  <div>
                    <p className="text-text">{question.prompt}</p>
                    <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
                      {question.choices.map((choice, j) => {
                        // The first answer is filled in, as if a student has started.
                        const filled = i === 0 && j === question.answerIndex;
                        return (
                          <li key={j} className="flex items-center gap-1.5 text-text">
                            <span
                              aria-hidden
                              className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${filled ? "border-violet bg-violet" : "border-lilac"}`}
                            />
                            <span className="truncate">
                              {letters[j]}. {choice}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent"
            />
            <p className="absolute inset-x-0 bottom-4 text-center text-xs text-muted">
              + 2 more questions and an answer key
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
