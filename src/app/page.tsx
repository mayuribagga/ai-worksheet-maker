import Link from "next/link";
import { Suspense } from "react";
import { HeroActions } from "@/components/HeroActions";
import { ChooseIcon, PrinterIcon, SparkleWandIcon, SubjectIcon } from "@/components/Icons";
import { ResourceCard } from "@/components/ResourceCard";
import { SamplePreview } from "@/components/SamplePreview";
import { Sparkle } from "@/components/Sparkle";
import { subjectNames, subjectSummaries } from "@/data/curriculum";
import { featuredResources } from "@/data/resources";
import { samples } from "@/data/samples";
import { subjectStyles } from "@/lib/subjects";

const steps = [
  {
    icon: ChooseIcon,
    title: "Choose a topic",
    text: "Pick a grade, subject and topic straight from the Ontario curriculum.",
  },
  {
    icon: SparkleWandIcon,
    title: "Generate",
    text: "Five multiple-choice questions written for that grade, plus an answer key.",
  },
  {
    icon: PrinterIcon,
    title: "Print",
    text: "Print it or save it as a PDF. The answer key prints on its own page.",
  },
];

const summaries = subjectSummaries();
const totalTopics = summaries.reduce((sum, s) => sum + s.topicCount, 0);
const maxTopics = Math.max(...summaries.map((s) => s.topicCount));

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero: what the site does, next to a real sample of what you get. */}
      <section className="dotted relative overflow-hidden border-b-2 border-line">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:py-20">
          <div className="flex flex-col gap-6">
            <h1 className="font-display text-[clamp(2.25rem,1.5rem+2.4vw,3.25rem)] leading-[1.06] font-extrabold tracking-tight text-ink">
              Ready-to-print worksheets for every Ontario lesson
            </h1>
            <p className="max-w-[34rem] text-lg leading-relaxed text-muted">
              Choose a grade, subject and topic from the Grades 1 to 8 curriculum, and get five
              questions and an answer key in seconds.
            </p>
            <Suspense fallback={<div className="h-14" />}>
              <HeroActions />
            </Suspense>
          </div>
          <SamplePreview samples={samples} />
        </div>
      </section>

      {/* How it works: a real sequence, so the steps are numbered. */}
      <section aria-labelledby="how-heading" className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6">
        <h2 id="how-heading" className="section-title">
          How it works
        </h2>
        <ol className="relative mt-8 grid gap-8 md:grid-cols-3 md:gap-6">
          {/* The dashed line joining the steps on wide screens. */}
          <div aria-hidden className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-lilac md:block" />
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-line bg-white text-ink shadow-[0_3px_0_0_var(--color-line)]">
                <step.icon className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet font-display text-xs font-bold text-white">
                  {i + 1}
                </span>
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-xl font-bold text-ink">{step.title}</h3>
                <p className="max-w-xs text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Subjects as books on a shelf, like the logo. Book height shows how many topics each has. */}
      <section aria-labelledby="subjects-heading" className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="subjects-heading" className="section-title">
              {totalTopics} curriculum topics to choose from
            </h2>
            <p className="text-muted">Taller books have more topics.</p>
          </div>
          <Link href="/generate" className="link text-sm">
            Browse topics
          </Link>
        </div>

        <div className="mt-8 -mx-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
          <ul className="flex min-w-[46rem] items-end gap-3 border-b-[10px] border-royal pb-0">
            {summaries.map((summary) => {
              const style = subjectStyles[summary.subject];
              const height = 9 + (summary.topicCount / maxTopics) * 8; // 9rem to 17rem
              return (
                <li
                  key={summary.subject}
                  style={{ height: `${height}rem` }}
                  className={`flex flex-1 flex-col justify-between overflow-hidden rounded-t-xl border-2 border-b-0 ${style.border} ${style.tint} bg-white`}
                >
                  <div className={`h-2.5 ${style.spine}`} />
                  <div className="flex flex-1 flex-col justify-end gap-1 p-4">
                    <SubjectIcon subject={summary.subject} className="mb-auto h-6 w-6 text-ink" />
                    <h3
                      title={subjectNames[summary.subject]}
                      className="font-display text-lg leading-tight font-bold text-ink"
                    >
                      {style.short}
                    </h3>
                    <p className="text-sm text-muted">
                      Grades {summary.firstGrade} to {summary.lastGrade}
                    </p>
                    <p className="font-display text-2xl font-bold text-ink">
                      {summary.topicCount}
                      <span className="ml-1 font-sans text-sm font-normal text-muted">topics</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Mayuri's own resources, on exercise-book paper. */}
      <section aria-labelledby="resources-heading" className="ruled border-y-2 border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:pl-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 id="resources-heading" className="section-title">
                From Mayuri&apos;s classroom
              </h2>
              <p className="text-muted">Lessons and activities available on Teachers Pay Teachers.</p>
            </div>
            <Link href="/resources" className="btn-secondary">
              See all resources
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredResources.map((resource) => (
              <ResourceCard key={resource.url} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action. */}
      <section className="relative overflow-hidden bg-ink">
        <Sparkle className="absolute top-8 left-[8%] h-8 w-8 text-blush/80" />
        <Sparkle className="absolute right-[10%] bottom-10 h-10 w-10 text-lilac/70" />
        <Sparkle className="absolute top-1/3 right-[28%] h-4 w-4 text-orchid" />
        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-5 py-16 text-center">
          <h2 className="font-display text-[clamp(1.9rem,1.4rem+1.8vw,2.6rem)] leading-tight font-bold text-white">
            Your next worksheet is a minute away
          </h2>
          <p className="max-w-md text-lilac">Up to 10 worksheets a day, each one saved to your account.</p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-display text-lg font-medium text-ink shadow-[0_4px_0_0_var(--color-lilac)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_5px_0_0_var(--color-blush)] active:translate-y-1 active:shadow-none"
          >
            <SparkleWandIcon className="h-5 w-5" />
            Make a worksheet
          </Link>
        </div>
      </section>
    </main>
  );
}
