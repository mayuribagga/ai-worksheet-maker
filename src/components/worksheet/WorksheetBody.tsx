import { Fragment } from "react";
import {
  matchingOrder,
  sectionMarks,
  splitBlanks,
  type NoteBlock,
  type Question,
  type Stimulus,
  type Worksheet,
} from "@/lib/worksheet";
import { CheckIcon } from "../Icons";
import { labelsFor, type SheetLabels } from "./labels";

// The contents of a worksheet: study notes, then each section with its
// passage, table or rule box and its questions. Used on screen and on the
// printed page. With showAnswers, answers are filled in where students write.

type Props = {
  worksheet: Worksheet;
  lang: "en" | "fr";
  showAnswers?: boolean;
  // The answer key leaves out reading passages, which are on the worksheet.
  hidePassages?: boolean;
  // Section titles are h3 under an h2 worksheet title, or h2 under an h1.
  headingLevel?: 2 | 3;
};

export function WorksheetBody({ worksheet, lang, showAnswers = false, hidePassages = false, headingLevel = 3 }: Props) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const labels = labelsFor(lang);
  // Questions are numbered across sections: where each section starts.
  const starts = worksheet.sections.map((_, s) =>
    worksheet.sections.slice(0, s).reduce((n, sec) => n + sec.questions.length, 1),
  );

  return (
    <div className="flex flex-col gap-9">
      {worksheet.notes && worksheet.notes.length > 0 && (
        <div className="flex flex-col gap-4">
          {worksheet.notes.map((note, i) => (
            <Note key={i} note={note} labels={labels} Heading={Heading} />
          ))}
        </div>
      )}

      {worksheet.sections.map((section, s) => {
        const header = (
          <header className="flex flex-col gap-1 border-b-2 border-ink/80 pb-1.5">
            <div className="flex items-baseline justify-between gap-4">
              <Heading className="font-display text-lg leading-snug font-bold text-ink">{section.title}</Heading>
              <span className="shrink-0 text-sm text-muted">
                {sectionMarks(section)} {labels.marks}
              </span>
            </div>
            <p className="text-[0.95rem] text-text">{section.instructions}</p>
          </header>
        );
        const passage = section.stimulus?.kind === "passage";
        const stimulus =
          section.stimulus &&
          (hidePassages && passage ? (
            <p className="text-sm text-muted">
              {(section.stimulus as { title: string }).title} ({labels.seeWorksheet})
            </p>
          ) : (
            <StimulusBlock stimulus={section.stimulus} />
          ));
        const rows = section.questions.map((question, q) => (
          <QuestionRow
            key={q}
            number={starts[s] + q}
            question={question}
            labels={labels}
            showAnswers={showAnswers}
          />
        ));
        return (
          <section key={s} className="flex flex-col gap-4">
            {passage ? (
              // A passage can run onto the next page, so it starts right away.
              <>
                {header}
                {stimulus}
                <ol className="flex flex-col gap-5">{rows}</ol>
              </>
            ) : (
              // On paper, a section's title, its table or rule box and its first
              // question stay together, so a title never ends a page on its own.
              <>
                <div className="flex break-inside-avoid flex-col gap-4">
                  {header}
                  {stimulus}
                  <ol className="flex flex-col gap-5">{rows.slice(0, 1)}</ol>
                </div>
                {rows.length > 1 && <ol className="flex flex-col gap-5">{rows.slice(1)}</ol>}
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}

// One numbered question with its marks, kept whole on one printed page.
function QuestionRow({
  number,
  question,
  labels,
  showAnswers,
}: {
  number: number;
  question: Question;
  labels: SheetLabels;
  showAnswers: boolean;
}) {
  return (
    <li value={number} className="grid break-inside-avoid grid-cols-[1.75rem_minmax(0,1fr)_auto] gap-x-2">
      <span className="font-display leading-6 font-bold text-royal">{number}.</span>
      <QuestionBlock question={question} labels={labels} showAnswers={showAnswers} />
      <span className="text-right text-sm leading-6 whitespace-nowrap text-muted">/{question.marks}</span>
    </li>
  );
}

function Note({ note, labels, Heading }: { note: NoteBlock; labels: SheetLabels; Heading: "h2" | "h3" }) {
  return (
    <div className="break-inside-avoid rounded-2xl border-2 border-lilac/70 bg-paper/70 px-5 py-4">
      <Heading className="font-display text-lg font-bold text-ink">{note.heading}</Heading>
      <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 marker:text-orchid">
        {note.points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
      {note.keyTerms && note.keyTerms.length > 0 && (
        <dl className="mt-3 grid gap-x-4 gap-y-1.5 sm:grid-cols-[auto_1fr]">
          {note.keyTerms.map((k, i) => (
            <Fragment key={i}>
              <dt className="font-display font-bold text-ink">{k.term}</dt>
              <dd className="text-text">{k.definition}</dd>
            </Fragment>
          ))}
        </dl>
      )}
      {note.example && (
        <div className="mt-3 rounded-xl bg-white px-4 py-3">
          <p className="text-sm font-display font-bold text-ink">{labels.example}</p>
          <p className="mt-1 whitespace-pre-line">{note.example}</p>
        </div>
      )}
    </div>
  );
}

function StimulusBlock({ stimulus }: { stimulus: Stimulus }) {
  switch (stimulus.kind) {
    case "passage":
      return (
        <div className="rounded-2xl border-2 border-line px-5 py-4">
          <p className="text-center font-display text-lg font-bold text-ink">{stimulus.title}</p>
          <div className="mt-3 flex flex-col gap-2.5">
            {stimulus.paragraphs.map((p, i) => (
              // Numbered paragraphs, so questions can point to them.
              <p key={i} className="grid grid-cols-[1.25rem_1fr] gap-2 leading-relaxed">
                <span aria-hidden className="pt-0.5 text-xs text-muted">
                  {i + 1}
                </span>
                <span>{p}</span>
              </p>
            ))}
          </div>
        </div>
      );
    case "table":
      return (
        <figure className="break-inside-avoid">
          <figcaption className="mb-1.5 text-sm font-display font-bold text-ink">{stimulus.title}</figcaption>
          {/* Wide tables scroll sideways on small screens; focusable so keyboards can scroll too. */}
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={stimulus.title}>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {stimulus.columns.map((c, i) => (
                    <th key={i} scope="col" className="border-2 border-line bg-lilac/25 px-3 py-1.5 text-left text-ink">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stimulus.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c} className="border-2 border-line px-3 py-1.5">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );
    case "rule":
      return (
        <div className="break-inside-avoid rounded-2xl border-2 border-ink/70 px-5 py-3.5">
          <p className="font-display text-base font-bold text-ink">{stimulus.title}</p>
          <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-5 marker:text-violet">
            {stimulus.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      );
    case "word-bank":
      return (
        <ul className="flex flex-wrap justify-center gap-2 rounded-2xl border-2 border-dashed border-lilac px-4 py-3">
          {stimulus.words.map((word, i) => (
            <li key={i} className="rounded-full bg-paper px-3 py-0.5 ring-1 ring-line">
              {word}
            </li>
          ))}
        </ul>
      );
  }
}

const letters = ["A", "B", "C", "D"];

function QuestionBlock({
  question,
  labels,
  showAnswers,
}: {
  question: Question;
  labels: SheetLabels;
  showAnswers: boolean;
}) {
  switch (question.type) {
    case "multiple-choice":
      return (
        <div className="flex flex-col gap-2">
          <p className="leading-6">
            <WithBlanks text={question.prompt} />
          </p>
          <ul className="grid gap-x-4 gap-y-1 sm:grid-cols-2 print:grid-cols-2">
            {question.choices.map((choice, j) => {
              const correct = showAnswers && j === question.answerIndex;
              return (
                <li key={j} className={`flex items-start gap-2.5 rounded-xl px-2 py-0.5 ${correct ? "bg-violet/10 text-ink" : ""}`}>
                  <Bubble filled={correct} />
                  <span>
                    <span className="text-muted">{letters[j]}.</span> {choice}
                    {correct && <span className="sr-only"> (correct answer)</span>}
                  </span>
                </li>
              );
            })}
          </ul>
          {showAnswers && <Answer>{question.explanation}</Answer>}
        </div>
      );

    case "true-false":
      return (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
            <p className="max-w-prose leading-6">
              <WithBlanks text={question.statement} />
            </p>
            <span className="flex shrink-0 gap-2 text-sm">
              {[true, false].map((value) => {
                const circled = showAnswers && value === question.answer;
                return (
                  <span
                    key={String(value)}
                    className={`rounded-full border-2 px-2.5 py-0.5 ${circled ? "border-royal bg-royal text-white" : "border-line"}`}
                  >
                    {value ? labels.true : labels.false}
                  </span>
                );
              })}
            </span>
          </div>
          {showAnswers && <Answer>{question.explanation}</Answer>}
        </div>
      );

    case "fill-in-the-blank": {
      const parts = splitBlanks(question.prompt);
      return (
        <p className="leading-8">
          {parts.map((part, i) => (
            <Fragment key={i}>
              {part}
              {i < parts.length - 1 && (
                <span className="inline-block min-w-[7rem] border-b-2 border-text/60 px-1 text-center">
                  {showAnswers && <span className="font-display font-bold text-royal">{question.answers[i]}</span>}
                </span>
              )}
            </Fragment>
          ))}
        </p>
      );
    }

    case "matching": {
      const { right, letterFor } = matchingOrder(question.pairs);
      return (
        <div className="flex flex-col gap-2">
          <p className="leading-6">{question.prompt}</p>
          <div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 print:grid-cols-2">
            <ol className="flex flex-col gap-1.5">
              {question.pairs.map((pair, i) => (
                <li key={i} className="flex items-baseline gap-2">
                  <span className="inline-block w-8 shrink-0 border-b-2 border-text/60 text-center font-display font-bold text-royal">
                    {showAnswers ? letterFor(pair.match) : ""}
                  </span>
                  <span>{pair.term}</span>
                </li>
              ))}
            </ol>
            <ul className="flex flex-col gap-1.5">
              {right.map((match, i) => (
                <li key={i}>
                  <span className="font-display font-bold text-ink">{String.fromCharCode(65 + i)}.</span> {match}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    case "short-answer":
    case "long-answer":
      return (
        <div className="flex flex-col gap-1">
          <p className="leading-6">{question.prompt}</p>
          {showAnswers ? <Answer>{question.answer}</Answer> : <Lines count={question.lines} />}
        </div>
      );

    case "show-your-work":
      return (
        <div className="flex flex-col gap-2">
          <p className="leading-6">{question.prompt}</p>
          {showAnswers ? (
            <Answer>
              <ol className="flex list-decimal flex-col gap-0.5 pl-5">
                {question.solution.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              <p className="mt-1 font-display font-bold text-ink">
                {labels.answer}: {question.answer}
              </p>
            </Answer>
          ) : (
            <>
              <div aria-hidden className="grid-paper h-28 rounded-lg border-2 border-line" />
              <p className="flex items-end gap-2 text-sm">
                {labels.answer}:
                <span className="inline-block w-48 max-w-full border-b-2 border-text/60" />
              </p>
            </>
          )}
        </div>
      );
  }
}

function Bubble({ filled }: { filled: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${filled ? "border-royal bg-royal text-white" : "border-lilac"}`}
    >
      {filled && <CheckIcon className="h-2.5 w-2.5" />}
    </span>
  );
}

function Lines({ count }: { count: number }) {
  return (
    <div aria-hidden className="flex flex-col">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="h-8 border-b border-text/35" />
      ))}
    </div>
  );
}

function Answer({ children }: { children: React.ReactNode }) {
  return <div className="animate-pop rounded-xl bg-paper px-3 py-2 text-sm text-text ring-1 ring-line">{children}</div>;
}

// Shows blanks (___) in a question as a line to write on.
function WithBlanks({ text }: { text: string }) {
  const parts = splitBlanks(text);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <span className="inline-block w-16 border-b-2 border-text/60 align-baseline" />}
    </Fragment>
  ));
}
