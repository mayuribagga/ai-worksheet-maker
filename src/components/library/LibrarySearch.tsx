"use client";

import Link from "next/link";
import { useDeferredValue, useId, useMemo, useState } from "react";
import type { SearchEntry } from "@/data/curriculum";
import { libraryHref } from "@/data/links";
import { grades, librarySubjects, subjectNames, type SubjectId } from "@/data/subjects";
import { subjectStyles } from "@/lib/subjects";

const MAX_RESULTS = 40;

// "Équations" and "equations" should match each other.
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// Search every topic in the library by name, strand or subtopic, with
// optional subject and grade filters.
export function LibrarySearch({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<SubjectId | "all">("all");
  const [grade, setGrade] = useState(0);
  const deferredQuery = useDeferredValue(query);
  const inputId = useId();

  // Search text for each topic, worked out once.
  const haystacks = useMemo(
    () =>
      entries.map((e) => ({
        entry: e,
        name: normalize(e.name),
        rest: normalize(`${e.strand} ${e.subtopics.join(" ")} ${subjectNames[e.subject]}`),
      })),
    [entries],
  );

  const words = normalize(deferredQuery).split(/\s+/).filter(Boolean);
  const filtering = words.length > 0 || subject !== "all" || grade !== 0;

  const results = filtering
    ? haystacks
        .filter(({ entry, name, rest }) => {
          if (subject !== "all" && entry.subject !== subject) return false;
          if (grade && entry.grade !== grade) return false;
          return words.every((w) => name.includes(w) || rest.includes(w));
        })
        // Topics whose name matches come first.
        .sort((a, b) => Number(words.every((w) => b.name.includes(w))) - Number(words.every((w) => a.name.includes(w))))
        .map(({ entry }) => entry)
    : [];

  return (
    <div className="flex flex-col gap-5">
      <div className="card flex flex-col gap-4 p-5 sm:p-6">
        <label htmlFor={inputId} className="font-display text-lg font-bold text-ink">
          Search topics
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try fractions, passé composé, War of 1812 or climate"
          className="input text-base"
        />
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={subject === "all"} onClick={() => setSubject("all")}>
            All subjects
          </FilterChip>
          {librarySubjects.map((s) => (
            <FilterChip key={s} active={subject === s} onClick={() => setSubject(s)}>
              <span aria-hidden className={`h-2 w-2 rounded-full ${subjectStyles[s].dot}`} />
              {subjectStyles[s].short}
            </FilterChip>
          ))}
          <select
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
            aria-label="Grade"
            className="input w-auto cursor-pointer py-1.5 text-sm"
          >
            <option value={0}>All grades</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div aria-live="polite">
        {filtering &&
          (results.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-lilac px-5 py-6 text-center text-muted">
              No topics match that search. Try a shorter word, or choose All subjects and All grades.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted">
                {results.length === 1 ? "1 topic" : `${results.length} topics`}
                {results.length > MAX_RESULTS && `, showing the first ${MAX_RESULTS}`}
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {results.slice(0, MAX_RESULTS).map((e) => (
                  <li key={`${e.grade}-${e.subject}-${e.id}`}>
                    <Link
                      href={libraryHref(e.grade, e.subject, e.id)}
                      className={`card card-link flex h-full flex-col gap-1 border-l-[6px] px-4 py-3 ${subjectStyles[e.subject].border}`}
                    >
                      <span className="text-xs text-muted">
                        Grade {e.grade} {subjectStyles[e.subject].short}, {e.strand}
                      </span>
                      <span className="font-display text-lg leading-snug font-bold text-ink">{e.name}</span>
                      <span className="line-clamp-1 text-sm text-muted">{e.subtopics.join(", ")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border-2 border-line bg-white px-3 py-1 text-sm text-text transition-colors hover:border-lilac aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
    >
      {children}
    </button>
  );
}
