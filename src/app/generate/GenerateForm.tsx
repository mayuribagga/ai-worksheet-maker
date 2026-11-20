"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  grades,
  subjectNames,
  subjectsForGrade,
  topicsFor,
  type SubjectId,
} from "@/data/curriculum";
import { generateWorksheet, type GenerateState } from "./actions";
import { WorksheetView } from "@/components/WorksheetView";

const initialState: GenerateState = {};

const selectClass =
  "rounded-md border border-zinc-300 px-3 py-2 text-base font-normal dark:border-zinc-700 dark:bg-zinc-900";

export function GenerateForm() {
  const [state, formAction, pending] = useActionState(generateWorksheet, initialState);
  const [grade, setGrade] = useState(4);
  const [subject, setSubject] = useState<SubjectId>("math");
  const [topicId, setTopicId] = useState("");

  const subjects = subjectsForGrade(grade);
  const topics = topicsFor(grade, subject);

  // Each choice resets the ones after it, because the options depend on it.
  function changeGrade(newGrade: number) {
    setGrade(newGrade);
    const available = subjectsForGrade(newGrade);
    if (!available.includes(subject)) setSubject(available[0]);
    setTopicId("");
  }

  function changeSubject(newSubject: SubjectId) {
    setSubject(newSubject);
    setTopicId("");
  }

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Grade
            <select
              name="grade"
              value={grade}
              onChange={(e) => changeGrade(Number(e.target.value))}
              className={selectClass}
            >
              {grades.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Subject
            <select
              name="subject"
              value={subject}
              onChange={(e) => changeSubject(e.target.value as SubjectId)}
              className={selectClass}
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {subjectNames[s]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Topic
          <select
            name="topic"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            required
            className={selectClass}
          >
            <option value="" disabled>
              Choose a topic
            </option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.strand}: {topic.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={pending || !topicId}
          className="w-fit rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? "Generating…" : "Generate worksheet"}
        </button>
      </form>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </p>
      )}

      {state.savedId && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          Saved to{" "}
          <Link href="/worksheets" className="font-medium underline">
            My worksheets
          </Link>
          .
        </p>
      )}
      {state.saveFailed && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          This worksheet couldn&apos;t be saved, but you can still use it below.
        </p>
      )}

      {state.worksheet && state.label && (
        // A new key for each worksheet resets the "show answer key" toggle.
        <WorksheetView key={state.worksheet.title} worksheet={state.worksheet} label={state.label} />
      )}
    </div>
  );
}
