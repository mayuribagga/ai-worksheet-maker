import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/library/Breadcrumbs";
import { GradeSwitcher } from "@/components/library/GradeSwitcher";
import { TopicBrowser } from "@/components/library/TopicBrowser";
import { SubjectIcon } from "@/components/Icons";
import { ResourceCard } from "@/components/ResourceCard";
import {
  courseFor,
  grades,
  isLibrarySubject,
  libraryHref,
  parseGradeSlug,
  subjectNames,
  subjectsForGrade,
  type Course,
} from "@/data/curriculum";
import { resourcesFor } from "@/data/resources";
import { savedTopicCounts } from "@/lib/library-progress";
import { subjectStyles } from "@/lib/subjects";

export function generateStaticParams() {
  return grades.flatMap((grade) =>
    subjectsForGrade(grade, "library").map((subject) => ({ grade: `grade-${grade}`, subject })),
  );
}

function load(gradeSlug: string, subject: string) {
  const grade = parseGradeSlug(gradeSlug);
  const course = grade && isLibrarySubject(subject) ? courseFor(grade, subject) : undefined;
  return course;
}

export async function generateMetadata({ params }: PageProps<"/library/[grade]/[subject]">): Promise<Metadata> {
  const { grade, subject } = await params;
  const course = load(grade, subject);
  return course ? { title: `Grade ${course.grade} ${subjectNames[course.subject]}` } : {};
}

export default async function SubjectPage({ params }: PageProps<"/library/[grade]/[subject]">) {
  const { grade: gradeSlug, subject: subjectSlug } = await params;
  const course = load(gradeSlug, subjectSlug);
  if (!course) notFound();
  const { grade, subject } = course;
  const style = subjectStyles[subject];
  const topicCount = course.strands.reduce((n, s) => n + s.topics.length, 0);
  const products = resourcesFor(grade, subject);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-10 sm:px-6">
      <div className="flex flex-col gap-5">
        <Breadcrumbs
          items={[
            { label: "Library", href: "/library" },
            { label: `Grade ${grade}`, href: libraryHref(grade) },
            { label: subjectNames[subject] },
          ]}
        />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className={`mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-ink ${style.tint}`}>
              <SubjectIcon subject={subject} className="h-7 w-7" />
            </span>
            <div className="flex flex-col gap-1.5">
              <h1 className="page-title">
                Grade {grade} {subjectNames[subject]}
              </h1>
              <p className="text-muted">
                {topicCount} topics{course.title ? `: ${course.title}` : ""}
              </p>
            </div>
          </div>
          <GradeSwitcher current={grade} subject={subject} />
        </div>
        {course.note && <p className="alert alert-warning max-w-3xl">{course.note}</p>}
      </div>

      {/* The topics show right away; the user's "made" counts are added once known. */}
      <Suspense fallback={<TopicBrowser grade={grade} subject={subject} strands={course.strands} />}>
        <TopicsWithProgress course={course} />
      </Suspense>

      {products.length > 0 && (
        <section aria-labelledby="products-heading" className="flex flex-col gap-5 border-t-2 border-line pt-10">
          <div className="flex flex-col gap-1">
            <h2 id="products-heading" className="section-title">
              From Mayuri&apos;s classroom
            </h2>
            <p className="text-muted">Ready-made lessons for Grade {grade} on Teachers Pay Teachers.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((resource) => (
              <ResourceCard key={resource.url} resource={resource} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

async function TopicsWithProgress({ course }: { course: Course }) {
  const counts = await savedTopicCounts(course.grade, course.subject);
  return (
    <TopicBrowser grade={course.grade} subject={course.subject} strands={course.strands} counts={counts ?? {}} />
  );
}
