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

const selectClass = "input";

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
      <form action={formAction} className="card flex flex-col gap-4 p-6">
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <label className="flex flex-col gap-1 text-sm text-ink">
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

          <label className="flex flex-col gap-1 text-sm text-ink">
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

        <label className="flex flex-col gap-1 text-sm text-ink">
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
          className="btn-primary w-fit"
        >
          {pending ? "Generating…" : "Generate worksheet"}
        </button>
        {state.remainingToday !== undefined && (
          <p className="text-sm text-muted">
            {state.remainingToday === 1
              ? "1 worksheet left today."
              : `${state.remainingToday} worksheets left today.`}
          </p>
        )}
      </form>

      {state.error && (
        <p className="alert alert-error">
          {state.error}
        </p>
      )}

      {state.savedId && (
        <p className="alert alert-success">
          Saved to{" "}
          <Link href="/worksheets" className="link">
            My worksheets
          </Link>
          .
        </p>
      )}
      {state.saveFailed && (
        <p className="alert alert-warning">
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
