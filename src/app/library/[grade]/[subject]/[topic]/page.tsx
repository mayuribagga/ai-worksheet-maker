import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CheckIcon, KindIcon, SparkleWandIcon, SubjectIcon } from "@/components/Icons";
import { Breadcrumbs } from "@/components/library/Breadcrumbs";
import { ResourceCard } from "@/components/ResourceCard";
import {
  courseFor,
  findTopic,
  generateHref,
  grades,
  isLibrarySubject,
  libraryHref,
  neighbours,
  parseGradeSlug,
  subjectNames,
  subjectsForGrade,
  topicsFor,
  type SubjectId,
  type Topic,
} from "@/data/curriculum";
import { isResourceKind, kindsFor, resourceKinds } from "@/data/resource-kinds";
import { resourcesFor } from "@/data/resources";
import { savedForTopic } from "@/lib/library-progress";
import { subjectStyles } from "@/lib/subjects";

export function generateStaticParams() {
  return grades.flatMap((grade) =>
    subjectsForGrade(grade, "library").flatMap((subject) =>
      topicsFor(grade, subject).map((topic) => ({ grade: `grade-${grade}`, subject, topic: topic.id })),
    ),
  );
}

function load(gradeSlug: string, subject: string, topicId: string) {
  const grade = parseGradeSlug(gradeSlug);
  if (!grade || !isLibrarySubject(subject)) return undefined;
  const topic = findTopic(grade, subject, topicId);
  return topic ? { grade, subject, topic } : undefined;
}

export async function generateMetadata({ params }: PageProps<"/library/[grade]/[subject]/[topic]">): Promise<Metadata> {
  const { grade, subject, topic } = await params;
  const found = load(grade, subject, topic);
  return found
    ? {
        title: `${found.topic.name}, Grade ${found.grade} ${subjectNames[found.subject]}`,
        description: `Worksheets, quizzes, tests and study notes for ${found.topic.name}: ${found.topic.subtopics.join(", ")}.`,
      }
    : {};
}

export default async function TopicPage({ params }: PageProps<"/library/[grade]/[subject]/[topic]">) {
  const { grade: gradeSlug, subject: subjectSlug, topic: topicSlug } = await params;
  const found = load(gradeSlug, subjectSlug, topicSlug);
  if (!found) notFound();
  const { grade, subject, topic } = found;
  const course = courseFor(grade, subject)!;
  const style = subjectStyles[subject];
  const { previous, next } = neighbours(grade, subject, topic.id);
  const products = resourcesFor(grade, subject, topic.id);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-5 py-10 sm:px-6">
      <div className="flex flex-col gap-5">
        <Breadcrumbs
          items={[
            { label: "Library", href: "/library" },
            { label: `Grade ${grade}`, href: libraryHref(grade) },
            { label: subjectNames[subject], href: libraryHref(grade, subject) },
            { label: topic.name },
          ]}
        />
        <div className="flex items-start gap-4">
          <span className={`mt-1 hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-ink sm:flex ${style.tint}`}>
            <SubjectIcon subject={subject} className="h-7 w-7" />
          </span>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-muted">
              Grade {grade} {subjectNames[subject]}, {topic.strand}
            </p>
            <h1 className="page-title">{topic.name}</h1>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[20rem_1fr]">
        {/* What the topic covers. Each subtopic can be the focus of a worksheet. */}
        <aside className="card flex flex-col gap-4 p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold text-ink">What this topic covers</h2>
          <ul className="flex flex-col gap-1">
            {topic.subtopics.map((sub) => (
              <li key={sub}>
                <Link
                  href={generateHref({ grade, subject, topicId: topic.id, focus: sub })}
                  className="group flex items-start justify-between gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-paper"
                >
                  <span className="text-text">{sub}</span>
                  <span className="shrink-0 pt-0.5 text-xs text-muted transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
                    Practise this
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {course.note && <p className="text-xs leading-snug text-muted">{course.note}</p>}
        </aside>

        <div className="flex flex-col gap-12">
          <ResourceKinds grade={grade} subject={subject} topic={topic} />

          <Suspense fallback={<div className="skeleton h-24 w-full rounded-2xl" />}>
            <SavedResources grade={grade} subject={subject} topic={topic} />
          </Suspense>

          {products.length > 0 && (
            <section aria-labelledby="products-heading" className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h2 id="products-heading" className="section-title">
                  From Mayuri&apos;s classroom
                </h2>
                <p className="text-muted">Ready-made lessons for this topic on Teachers Pay Teachers.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {products.map((resource) => (
                  <ResourceCard key={resource.url} resource={resource} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <nav aria-label="More topics" className="grid gap-3 border-t-2 border-line pt-6 sm:grid-cols-2">
        {previous ? (
          <TopicLink label="Previous topic" grade={grade} subject={subject} topic={previous} />
        ) : (
          <span />
        )}
        {next && <TopicLink label="Next topic" grade={grade} subject={subject} topic={next} alignEnd />}
      </nav>
    </main>
  );
}

// One card per kind of resource, each opening the worksheet maker with
// this topic and kind already chosen.
function ResourceKinds({ grade, subject, topic }: { grade: number; subject: SubjectId; topic: Topic }) {
  return (
    <section aria-labelledby="make-heading" className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 id="make-heading" className="section-title">
          Learning resources
        </h2>
        <p className="max-w-2xl text-muted">
          Each one is written for this topic and grade when you ask for it, with an answer key, and saved
          to your account so you can print it any time.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kindsFor(subject).map((kind) => (
          <li key={kind}>
            <Link
              href={generateHref({ grade, subject, topicId: topic.id, kind })}
              className="card card-link group flex h-full flex-col gap-3 p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lilac/35 text-ink transition-colors group-hover:bg-ink group-hover:text-white">
                <KindIcon kind={kind} className="h-6 w-6" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-display text-lg leading-tight font-bold text-ink">{resourceKinds[kind].name}</span>
                <span className="text-sm leading-snug text-muted">{resourceKinds[kind].description}</span>
              </span>
              <span className="mt-auto flex items-center justify-between gap-2 pt-1 text-sm">
                <span className="flex items-center gap-1 text-muted">
                  <CheckIcon className="h-3.5 w-3.5 text-violet" />
                  Answer key
                </span>
                <span className="flex items-center gap-1.5 font-display font-medium text-ink">
                  <SparkleWandIcon className="h-4 w-4" />
                  Make it
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

const dateFormat = new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeZone: "America/Toronto" });

// The signed-in user's resources for this topic, or an invitation to sign up.
async function SavedResources({ grade, subject, topic }: { grade: number; subject: SubjectId; topic: Topic }) {
  const saved = await savedForTopic(grade, subject, topic.id);

  if (saved === null) {
    return (
      <section className="flex flex-col items-start gap-3 rounded-2xl border-2 border-dashed border-lilac bg-paper px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-text">Create a free account to make these resources and keep them in one place.</p>
        <Link href="/signup" className="btn-primary shrink-0">
          Create a free account
        </Link>
      </section>
    );
  }

  return (
    <section aria-labelledby="saved-heading" className="flex flex-col gap-4">
      <h2 id="saved-heading" className="section-title">
        Your resources for this topic
      </h2>
      {saved.length === 0 ? (
        <p className="text-muted">You haven&apos;t made anything for this topic yet. Pick a resource above to start.</p>
      ) : (
        <ul className="flex flex-col divide-y-2 divide-line rounded-2xl border-2 border-line bg-white">
          {saved.map((item) => (
            <li key={item.id}>
              <Link
                href={`/worksheets/${item.id}`}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3 transition-colors hover:bg-paper"
              >
                <span className="font-display font-bold text-ink">{item.title}</span>
                <span className="text-sm text-muted">
                  {isResourceKind(item.kind) ? resourceKinds[item.kind].name : "Worksheet"},{" "}
                  {dateFormat.format(new Date(item.createdAt))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function TopicLink({
  label,
  grade,
  subject,
  topic,
  alignEnd = false,
}: {
  label: string;
  grade: number;
  subject: SubjectId;
  topic: Topic;
  alignEnd?: boolean;
}) {
  return (
    <Link
      href={libraryHref(grade, subject, topic.id)}
      className={`card card-link flex flex-col gap-0.5 px-5 py-3 ${alignEnd ? "sm:items-end sm:text-right" : ""}`}
    >
      <span className="text-xs text-muted">{label}</span>
      <span className="font-display font-bold text-ink">{topic.name}</span>
    </Link>
  );
}
