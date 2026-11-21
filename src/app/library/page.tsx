import type { Metadata } from "next";
import Link from "next/link";
import { LibrarySearch } from "@/components/library/LibrarySearch";
import { SubjectIcon } from "@/components/Icons";
import {
  grades,
  libraryHref,
  librarySearchIndex,
  subjectsForGrade,
  subjectSummaries,
  topicsFor,
  totalTopicCount,
} from "@/data/curriculum";
import { subjectStyles } from "@/lib/subjects";

export const metadata: Metadata = {
  title: "Resource library",
  description: "Ontario curriculum topics for Grades 1 to 8, with worksheets, quizzes, tests and study notes for each one.",
};

const searchEntries = librarySearchIndex();
const topicCount = totalTopicCount("library");
const summaries = subjectSummaries("library");

export default function LibraryPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="dotted border-b-2 border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-12 sm:px-6 lg:py-16">
          <div className="flex max-w-2xl flex-col gap-3">
            <h1 className="page-title">Resource library</h1>
            <p className="text-lg leading-relaxed text-muted">
              {topicCount} topics from the Ontario curriculum, Grades 1 to 8. Pick a grade to see its
              subjects, or search for a topic.
            </p>
          </div>

          {/* The grades, like the tabbed dividers in a binder. */}
          <nav aria-label="Grades">
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {grades.map((grade) => {
                const subjects = subjectsForGrade(grade, "library");
                const topics = subjects.reduce((n, s) => n + topicsFor(grade, s).length, 0);
                return (
                  <li key={grade}>
                    <Link
                      href={libraryHref(grade)}
                      className="group relative flex h-full flex-col gap-3 rounded-2xl rounded-tl-none border-2 border-line bg-white px-5 pt-4 pb-5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-lilac hover:shadow-[0_6px_0_0_var(--color-lilac)] active:translate-y-0 active:shadow-none"
                    >
                      {/* The divider's tab. */}
                      <span
                        aria-hidden
                        className="absolute -top-[2px] left-[-2px] h-3 w-16 -translate-y-full rounded-t-lg border-2 border-b-0 border-line bg-white transition-colors group-hover:border-lilac group-hover:bg-lilac/40"
                      />
                      <span className="flex items-baseline gap-2">
                        <span className="text-sm text-muted">Grade</span>
                        <span className="font-display text-5xl leading-none font-black text-ink transition-colors group-hover:text-royal">
                          {grade}
                        </span>
                      </span>
                      <span className="flex gap-1.5" aria-hidden>
                        {subjects.map((s) => (
                          <span key={s} className={`h-2.5 w-2.5 rounded-full ${subjectStyles[s].dot}`} />
                        ))}
                      </span>
                      <span className="text-sm text-muted">
                        {subjects.length} subjects, {topics} topics
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>

      <section aria-label="Search" className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6">
        <LibrarySearch entries={searchEntries} />
      </section>

      <section aria-labelledby="subjects-heading" className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-6">
        <h2 id="subjects-heading" className="section-title">
          Six subjects
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((s) => {
            const style = subjectStyles[s.subject];
            return (
              <li
                key={s.subject}
                className={`flex items-center gap-4 rounded-2xl border-2 bg-white px-4 py-3 ${style.border}`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink ${style.tint}`}>
                  <SubjectIcon subject={s.subject} className="h-6 w-6" />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-lg leading-tight font-bold text-ink">{style.short}</span>
                  <span className="text-sm text-muted">
                    Grades {s.firstGrade} to {s.lastGrade}, {s.topicCount} topics
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
          Topics follow The Ontario Curriculum: Mathematics (2020); French as a Second Language, Grades 1 to 8
          (2013); and Social Studies, Grades 1 to 6, and History and Geography, Grades 7 and 8 (2018, with
          2023 revisions). Topic names and groupings are written for this site; for the official
          expectations, see{" "}
          <a href="https://www.dcp.edu.gov.on.ca/en/" target="_blank" rel="noopener noreferrer" className="link">
            Ontario&apos;s Curriculum and Resources site
          </a>
          .
        </p>
      </section>
    </main>
  );
}
