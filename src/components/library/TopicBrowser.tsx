"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Strand } from "@/data/curriculum";
import { generateHref, libraryHref } from "@/data/links";
import { CheckIcon } from "../Icons";

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// A grade and subject's topics, grouped by strand. Topics can be filtered by
// strand or by typing, and opened to see their subtopics.
// `counts` is how many resources the signed-in user has made for each topic.
export function TopicBrowser({
  grade,
  subject,
  strands,
  counts = {},
}: {
  grade: number;
  subject: string;
  strands: Strand[];
  counts?: Record<string, number>;
}) {
  const [query, setQuery] = useState("");
  const [strandFilter, setStrandFilter] = useState<string | null>(null);
  const inputId = useId();
  const words = normalize(query).split(/\s+/).filter(Boolean);

  const visible = strands
    .filter((s) => !strandFilter || s.name === strandFilter)
    .map((s) => ({
      ...s,
      topics: s.topics.filter((t) => {
        const text = normalize(`${t.name} ${t.subtopics.join(" ")}`);
        return words.every((w) => text.includes(w));
      }),
    }))
    .filter((s) => s.topics.length > 0);
  const shown = visible.reduce((n, s) => n + s.topics.length, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 rounded-2xl border-2 border-line bg-white p-4 sm:flex-row sm:items-center">
        <label htmlFor={inputId} className="sr-only">
          Filter topics
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter topics"
          className="input sm:max-w-xs"
        />
        {strands.length > 1 && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Strands">
            <StrandChip active={!strandFilter} onClick={() => setStrandFilter(null)}>
              All strands
            </StrandChip>
            {strands.map((s) => (
              <StrandChip key={s.name} active={strandFilter === s.name} onClick={() => setStrandFilter(s.name)}>
                {s.name}
              </StrandChip>
            ))}
          </div>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {shown === 1 ? "1 topic shown" : `${shown} topics shown`}
      </p>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-lilac px-5 py-10 text-center">
          <p className="text-muted">No topics match &ldquo;{query}&rdquo;.</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setQuery("");
              setStrandFilter(null);
            }}
          >
            Show all topics
          </button>
        </div>
      ) : (
        visible.map((s) => (
          <section key={s.name} aria-labelledby={`strand-${s.name}`} className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-3 border-b-2 border-line pb-2">
              <h2 id={`strand-${s.name}`} className="font-display text-xl font-bold text-ink">
                {s.name}
              </h2>
              <span className="shrink-0 text-sm text-muted">
                {s.topics.length === 1 ? "1 topic" : `${s.topics.length} topics`}
              </span>
            </div>
            <ul className="grid gap-4 md:grid-cols-2">
              {s.topics.map((t) => (
                <li key={t.id}>
                  <TopicCard
                    grade={grade}
                    subject={subject}
                    id={t.id}
                    name={t.name}
                    subtopics={t.subtopics}
                    made={counts[t.id] ?? 0}
                    open={words.length > 0}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function TopicCard({
  grade,
  subject,
  id,
  name,
  subtopics,
  made,
  open,
}: {
  grade: number;
  subject: string;
  id: string;
  name: string;
  subtopics: string[];
  made: number;
  open: boolean;
}) {
  return (
    <article className="group/card flex h-full flex-col rounded-2xl border-2 border-line bg-white transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-lilac hover:shadow-[0_5px_0_0_var(--color-lilac)]">
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <h3 className="font-display text-lg leading-snug font-bold text-ink">
          <Link href={libraryHref(grade, subject, id)} className="hover:underline">
            {name}
          </Link>
        </h3>
        {made > 0 && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-violet/10 px-2 py-0.5 text-xs text-ink">
            <CheckIcon className="h-3 w-3 text-violet" />
            {made} made
          </span>
        )}
      </div>

      {/* Opens on its own while filtering, so matching subtopics are visible. */}
      <details open={open || undefined} className="group/details flex-1 px-5 pt-1 pb-2">
        <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-full py-1 text-sm text-muted transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 group-open/details:rotate-90"
          >
            ›
          </span>
          {subtopics.length} subtopics
        </summary>
        <ul className="mt-1 mb-2 flex flex-col gap-1 border-l-2 border-lilac pl-3 text-sm text-text">
          {subtopics.map((sub) => (
            <li key={sub}>{sub}</li>
          ))}
        </ul>
      </details>

      <div className="flex flex-wrap items-center gap-2 border-t-2 border-line px-5 py-3">
        <Link href={libraryHref(grade, subject, id)} className="link text-sm">
          See resources
        </Link>
        <Link
          href={generateHref({ grade, subject, topicId: id })}
          className="ml-auto rounded-full px-2.5 py-1 text-sm text-muted transition-colors hover:bg-paper hover:text-ink"
        >
          Make a worksheet
        </Link>
      </div>
    </article>
  );
}

function StrandChip({
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
      className="rounded-full border-2 border-line bg-white px-3 py-1 text-sm text-text transition-colors hover:border-lilac aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
    >
      {children}
    </button>
  );
}
