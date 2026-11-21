"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { CheckIcon, SparkleWandIcon, SubjectIcon } from "@/components/Icons";
import { PrintableWorksheet } from "@/components/PrintableWorksheet";
import { Sparkle } from "@/components/Sparkle";
import { WorksheetActions } from "@/components/WorksheetActions";
import { WorksheetView } from "@/components/WorksheetView";
import {
  courseFor,
  findTopic,
  grades,
  subjectsForGrade,
  topicsFor,
  type SubjectId,
  type Topic,
} from "@/data/curriculum";
import { generateHref } from "@/data/links";
import { kindsFor, resourceKinds, type ResourceKind } from "@/data/resource-kinds";
import { subjectStyles } from "@/lib/subjects";
import { generateWorksheet, type GenerateState } from "./actions";
import { defaultChoices, type FormChoices } from "./choices";

const initialState: GenerateState = {};
const DAILY_LIMIT = 10; // Matches the limit in supabase/migrations/0003.

export function GenerateForm({ initial = defaultChoices }: { initial?: FormChoices }) {
  const [state, formAction, pending] = useActionState(generateWorksheet, initialState);
  const [grade, setGrade] = useState(initial.grade);
  const [subject, setSubject] = useState<SubjectId>(initial.subject);
  const [topicId, setTopicId] = useState(initial.topicId);
  const [kind, setKind] = useState<ResourceKind>(initial.kind);
  const [focus, setFocus] = useState(initial.focus);

  const subjects = subjectsForGrade(grade);
  const topics = topicsFor(grade, subject);
  const topic = findTopic(grade, subject, topicId);
  const kinds = kindsFor(subject);
  const note = courseFor(grade, subject)?.note;
  const kindName = resourceKinds[kind].name.toLowerCase();

  // Each choice resets the ones after it, because the options depend on it.
  function changeGrade(newGrade: number) {
    setGrade(newGrade);
    const available = subjectsForGrade(newGrade);
    if (!available.includes(subject)) changeSubject(available[0]);
    setTopicId("");
    setFocus("");
  }

  function changeSubject(newSubject: SubjectId) {
    setSubject(newSubject);
    setTopicId("");
    setFocus("");
    if (!kindsFor(newSubject).includes(kind)) setKind("worksheet");
  }

  // Keep the choices in the address bar, so refreshing the page or sharing
  // the link keeps them. A blank form keeps a plain address.
  useEffect(() => {
    if (!topicId && !window.location.search) return;
    const url = topicId
      ? generateHref({ grade, subject, topicId, kind, focus: focus || undefined })
      : `/generate?${new URLSearchParams({ grade: String(grade), subject })}`;
    if (url !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", url);
    }
  }, [grade, subject, topicId, kind, focus]);

  return (
    <>
      <div className="grid items-start gap-8 lg:grid-cols-[23rem_1fr] print:hidden">
        <form action={formAction} className="card flex flex-col gap-6 p-5 sm:p-6 lg:sticky lg:top-24">
          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-2.5 font-display text-lg font-bold text-ink">Grade</legend>
            <div className="grid grid-cols-4 gap-2">
              {grades.map((g) => (
                <label key={g} className="choice py-2.5 font-display text-base">
                  <input
                    type="radio"
                    name="grade"
                    value={g}
                    checked={grade === g}
                    onChange={() => changeGrade(g)}
                    className="sr-only"
                  />
                  {g}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-2.5 font-display text-lg font-bold text-ink">Subject</legend>
            <div className="grid grid-cols-2 gap-2">
              {subjects.map((s) => (
                <label key={s} className="choice justify-start px-3 text-left">
                  <input
                    type="radio"
                    name="subject"
                    value={s}
                    checked={subject === s}
                    onChange={() => changeSubject(s)}
                    className="sr-only"
                  />
                  <SubjectIcon subject={s} className="h-5 w-5 shrink-0" />
                  <span className="leading-tight">{subjectStyles[s].short}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col gap-2.5">
            <span className="flex items-baseline justify-between">
              <span className="font-display text-lg font-bold text-ink">Topic</span>
              <span className="text-xs text-muted">{topics.length} topics</span>
            </span>
            <select
              name="topic"
              value={topicId}
              onChange={(e) => {
                setTopicId(e.target.value);
                setFocus("");
              }}
              required
              className="input cursor-pointer"
            >
              <option value="" disabled>
                Choose a topic
              </option>
              {groupByStrand(topics).map(([strand, strandTopics]) => (
                <optgroup key={strand} label={strand}>
                  {strandTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {note && <span className="text-xs leading-snug text-muted">{note}</span>}
          </label>

          {topic && topic.subtopics.length > 0 && (
            <label className="flex flex-col gap-2.5">
              <span className="font-display text-lg font-bold text-ink">
                Focus <span className="font-sans text-sm font-normal text-muted">(optional)</span>
              </span>
              <select name="focus" value={focus} onChange={(e) => setFocus(e.target.value)} className="input cursor-pointer">
                <option value="">The whole topic</option>
                {topic.subtopics.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </label>
          )}

          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-2.5 font-display text-lg font-bold text-ink">What to make</legend>
            <div className="grid grid-cols-2 gap-2">
              {kinds.map((k) => (
                <label key={k} className="choice justify-start px-3 text-left leading-tight">
                  <input
                    type="radio"
                    name="kind"
                    value={k}
                    checked={kind === k}
                    onChange={() => setKind(k)}
                    className="sr-only"
                  />
                  {resourceKinds[k].name}
                </label>
              ))}
            </div>
            <p className="text-xs leading-snug text-muted">
              {resourceKinds[kind].description} Answer key included.
            </p>
          </fieldset>

          <div className="flex flex-col gap-3 border-t-2 border-line pt-5">
            <button type="submit" disabled={pending || !topicId} className="btn-primary w-full py-3 text-base">
              <SparkleWandIcon className="h-5 w-5" />
              {pending ? `Writing your ${kindName}…` : `Make ${kindName}`}
            </button>
            {!topicId && !pending && (
              <p className="text-center text-xs text-muted">Choose a topic to continue.</p>
            )}
            {state.remainingToday !== undefined && <DailyMeter remaining={state.remainingToday} />}
          </div>
        </form>

        <section aria-live="polite" aria-busy={pending} className="flex min-w-0 flex-col gap-4">
          {pending ? (
            <GeneratingSheet />
          ) : state.worksheet && state.meta ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                {state.savedId ? (
                  <p className="flex items-center gap-2 text-sm text-ink">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet text-white">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    Saved to{" "}
                    <Link href="/worksheets" className="link">
                      My worksheets
                    </Link>
                  </p>
                ) : (
                  <p className="alert alert-warning">
                    This worksheet couldn&apos;t be saved, but you can still use it below.
                  </p>
                )}
                <WorksheetActions worksheetId={state.savedId} />
              </div>
              {/* A new key for each worksheet resets the answer key switch. */}
              <WorksheetView key={state.savedId ?? state.worksheet.title} worksheet={state.worksheet} meta={state.meta} />
            </>
          ) : (
            <>
              {state.error && <p className="alert alert-error">{state.error}</p>}
              <EmptyPreview />
            </>
          )}
        </section>
      </div>

      {/* The printable version, shown only when printing. */}
      {state.worksheet && state.meta && !pending && (
        <div className="hidden print:block">
          <PrintableWorksheet worksheet={state.worksheet} meta={state.meta} />
        </div>
      )}
    </>
  );
}

function groupByStrand(topics: Topic[]): [string, Topic[]][] {
  const groups = new Map<string, Topic[]>();
  for (const topic of topics) {
    groups.set(topic.strand, [...(groups.get(topic.strand) ?? []), topic]);
  }
  return [...groups];
}

// Ten dots, one per worksheet allowed today.
function DailyMeter({ remaining }: { remaining: number }) {
  const left = Math.max(0, remaining);
  return (
    <div className="flex items-center justify-between gap-3 text-xs text-muted">
      <span>{left === 1 ? "1 worksheet left today" : `${left} worksheets left today`}</span>
      <span aria-hidden className="flex gap-1">
        {Array.from({ length: DAILY_LIMIT }, (_, i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < left ? "bg-violet" : "bg-line"}`} />
        ))}
      </span>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="dotted flex min-h-[26rem] flex-col items-center justify-center gap-5 rounded-3xl border-2 border-dashed border-lilac bg-paper p-8 text-center">
      <div aria-hidden className="relative h-32 w-28">
        <div className="absolute inset-0 rotate-[-7deg] rounded-xl bg-lilac/60" />
        <div className="absolute inset-0 rotate-[4deg] rounded-xl bg-blush/50" />
        <div className="absolute inset-0 flex flex-col gap-2 rounded-xl border-2 border-line bg-white p-3">
          <div className="h-2.5 w-3/4 rounded-full bg-violet/40" />
          <div className="h-1.5 w-full rounded-full bg-line" />
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-lilac" />
            <span className="h-1.5 w-2/3 rounded-full bg-line" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-lilac" />
            <span className="h-1.5 w-1/2 rounded-full bg-line" />
          </div>
        </div>
        <Sparkle className="absolute -top-3 -right-4 h-7 w-7 text-orchid" />
      </div>
      <div className="flex max-w-xs flex-col gap-1">
        <p className="font-display text-xl font-bold text-balance text-ink">Your worksheet will appear here</p>
        <p className="text-sm text-muted">
          Pick a grade, subject and topic, then choose a worksheet, quiz, test, study notes or
          reading. Each one has mixed question types and an answer key.
        </p>
      </div>
    </div>
  );
}

// A placeholder sheet shown while Claude writes the worksheet.
function GeneratingSheet() {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 text-sm text-ink">
        <Sparkle className="h-4 w-4 animate-spin text-orchid [animation-duration:2.5s]" />
        Writing it now. This usually takes 20 to 40 seconds.
      </p>
      <div className="card flex flex-col gap-4 p-8 sm:px-10">
        <div className="skeleton h-7 w-2/3" />
        <div className="skeleton h-4 w-1/2" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="mt-4 flex flex-col gap-3">
            <div className="skeleton h-4 w-5/6" />
            <div className="grid grid-cols-2 gap-3 pl-6">
              <div className="skeleton h-3.5 w-3/4" />
              <div className="skeleton h-3.5 w-2/3" />
              <div className="skeleton h-3.5 w-1/2" />
              <div className="skeleton h-3.5 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
