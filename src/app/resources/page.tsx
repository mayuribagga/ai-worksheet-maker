import type { Metadata } from "next";
import Image from "next/image";
import { ExternalIcon } from "@/components/Icons";
import { LessonPath } from "@/components/LessonPath";
import { ResourceCard } from "@/components/ResourceCard";
import { Sparkle } from "@/components/Sparkle";
import { resourceGroups } from "@/data/resources";
import { getCoverImage } from "@/lib/tpt";

export const metadata: Metadata = { title: "Resources" };

const math = resourceGroups.find((group) => group.id === "math")!;
const python = resourceGroups.find((group) => group.id === "python")!;
const [pythonBundle, ...pythonLessons] = python.resources;

export default async function ResourcesPage() {
  const bundleCover = pythonBundle.image ?? (await getCoverImage(pythonBundle.url));

  return (
    <main className="flex flex-1 flex-col">
      <div className="dotted border-b-2 border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-12 sm:px-6">
          <h1 className="page-title">Resources</h1>
          <p className="max-w-xl text-lg text-muted">
            Ready-to-teach lessons and activities I&apos;ve made for my own classroom, available
            on Teachers Pay Teachers.
          </p>
          <nav aria-label="Resource collections" className="flex flex-wrap gap-2">
            {[math, python].map((group) => (
              <a key={group.id} href={`#${group.id}`} className="btn-secondary">
                {group.name}
                <span className="rounded-full bg-paper px-2 text-xs text-muted">{group.resources.length}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <section id="math" aria-labelledby="math-heading" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-14 sm:px-6">
        <h2 id="math-heading" className="section-title">
          {math.name}
        </h2>
        <p className="mt-1 text-muted">{math.intro}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {math.resources.map((resource) => (
            <ResourceCard key={resource.url} resource={resource} />
          ))}
        </div>
      </section>

      <section id="python" aria-labelledby="python-heading" className="ruled scroll-mt-24 border-y-2 border-line">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-6 sm:pl-20 lg:grid-cols-[22rem_1fr]">
          <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <div>
              <h2 id="python-heading" className="section-title">
                {python.name}
              </h2>
              <p className="mt-1 text-muted">{python.intro}</p>
            </div>
            {/* The full course bundle, featured above the individual lessons. */}
            <a
              href={pythonBundle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-link group flex flex-col overflow-hidden"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center bg-paper">
                {bundleCover ? (
                  <Image src={bundleCover} alt="" fill sizes="352px" className="object-contain p-4" />
                ) : (
                  <Sparkle className="h-12 w-12 text-orchid" />
                )}
              </div>
              <div className="flex flex-col gap-1.5 border-t-2 border-line p-5">
                <span className="-ml-2.5 w-fit rounded-full bg-violet px-2.5 py-0.5 text-xs text-white">
                  Full course
                </span>
                <h3 className="font-display text-xl font-bold text-ink">{pythonBundle.title}</h3>
                <p className="text-sm text-muted">{pythonBundle.description}</p>
                <span className="mt-2 flex items-center gap-1.5 text-sm text-ink">
                  <span className="underline decoration-lilac decoration-2 underline-offset-4 group-hover:decoration-violet">
                    View on Teachers Pay Teachers
                  </span>
                  <ExternalIcon className="h-3.5 w-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </div>
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted">Or get the lessons one at a time, in order:</p>
            <LessonPath lessons={pythonLessons} />
          </div>
        </div>
      </section>
    </main>
  );
}
