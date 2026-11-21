import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/library/Breadcrumbs";
import { GradeSwitcher } from "@/components/library/GradeSwitcher";
import { SubjectIcon } from "@/components/Icons";
import {
  courseFor,
  grades,
  libraryHref,
  parseGradeSlug,
  subjectBlurbs,
  subjectNames,
  subjectsForGrade,
} from "@/data/curriculum";
import { subjectStyles } from "@/lib/subjects";

export function generateStaticParams() {
  return grades.map((grade) => ({ grade: `grade-${grade}` }));
}

export async function generateMetadata({ params }: PageProps<"/library/[grade]">): Promise<Metadata> {
  const grade = parseGradeSlug((await params).grade);
  return grade ? { title: `Grade ${grade} resources` } : {};
}

export default async function GradePage({ params }: PageProps<"/library/[grade]">) {
  const grade = parseGradeSlug((await params).grade);
  if (!grade) notFound();
  const subjects = subjectsForGrade(grade, "library");

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-10 sm:px-6">
      <div className="flex flex-col gap-5">
        <Breadcrumbs items={[{ label: "Library", href: "/library" }, { label: `Grade ${grade}` }]} />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="page-title">Grade {grade}</h1>
            <p className="text-muted">Choose a subject to see its topics.</p>
          </div>
          <GradeSwitcher current={grade} />
        </div>
      </div>

      <ul className="grid gap-5 md:grid-cols-2">
        {subjects.map((subject) => {
          const course = courseFor(grade, subject)!;
          const style = subjectStyles[subject];
          const topicCount = course.strands.reduce((n, s) => n + s.topics.length, 0);
          return (
            <li key={subject}>
              {/* Each subject is a book: a coloured spine on the left. The whole
                  card opens the subject; the worksheet link sits above it. */}
              <article className="group relative flex h-full overflow-hidden rounded-2xl border-2 border-line bg-white transition-[transform,box-shadow,border-color] duration-200 has-[a:hover]:-translate-y-1 has-[a:hover]:border-lilac has-[a:hover]:shadow-[0_6px_0_0_var(--color-lilac)]">
                <span aria-hidden className={`w-3 shrink-0 ${style.spine}`} />
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start gap-3">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink ${style.tint}`}>
                      <SubjectIcon subject={subject} className="h-6 w-6" />
                    </span>
                    <div className="flex flex-col">
                      <h2 className="font-display text-xl leading-tight font-bold text-ink">
                        <Link
                          href={libraryHref(grade, subject)}
                          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none after:focus-visible:rounded-2xl after:focus-visible:outline-3 after:focus-visible:outline-violet"
                        >
                          {subjectNames[subject]}
                        </Link>
                      </h2>
                      <span className="text-sm text-muted">
                        {topicCount} topics in {course.strands.length}{" "}
                        {course.strands.length === 1 ? "strand" : "strands"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-text">{course.title ?? subjectBlurbs[subject]}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {course.strands.map((s) => (
                      <li key={s.name} className="rounded-full bg-paper px-2.5 py-0.5 text-xs text-muted ring-1 ring-line">
                        {s.name}
                      </li>
                    ))}
                  </ul>
                  {course.note && <p className="text-xs leading-snug text-muted">{course.note}</p>}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                    <span className="text-sm text-ink group-has-[a:hover]:underline">See topics</span>
                    <Link
                      href={`/generate?grade=${grade}&subject=${subject}`}
                      className="relative z-10 rounded-full px-3 py-1 text-sm text-muted ring-1 ring-line transition-colors hover:bg-paper hover:text-ink"
                    >
                      Create worksheet
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
