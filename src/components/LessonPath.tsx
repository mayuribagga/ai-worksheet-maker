import Image from "next/image";
import type { Resource } from "@/data/resources";
import { getCoverImage } from "@/lib/tpt";
import { ExternalIcon } from "./Icons";
import { Sparkle } from "./Sparkle";

// A course's lessons in order, joined by a dashed line.
export function LessonPath({ lessons }: { lessons: Resource[] }) {
  return (
    <ol className="relative flex flex-col gap-3">
      <div aria-hidden className="absolute top-6 bottom-6 left-[1.4rem] border-l-2 border-dashed border-lilac" />
      {lessons.map((lesson, i) => (
        <LessonRow key={lesson.url} lesson={lesson} number={i + 1} />
      ))}
    </ol>
  );
}

async function LessonRow({ lesson, number }: { lesson: Resource; number: number }) {
  const image = lesson.image ?? (await getCoverImage(lesson.url));
  // "Lesson 3: Operators" shows as the number in the circle and "Operators".
  const title = lesson.title.replace(/^Lesson \d+:\s*/, "");

  return (
    <li className="relative">
      <a
        href={lesson.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-2xl py-1.5 pr-3 transition-colors hover:bg-white"
      >
        <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-line bg-white font-display text-lg font-bold text-ink transition-colors group-hover:border-violet group-hover:bg-violet group-hover:text-white">
          {number}
        </span>
        <span className="relative hidden h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 border-line bg-paper sm:block">
          {image ? (
            <Image src={image} alt="" fill sizes="64px" className="object-cover" />
          ) : (
            <Sparkle className="absolute inset-0 m-auto h-5 w-5 text-orchid" />
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs text-muted">Lesson {number}</span>
          <span className="truncate font-display text-lg font-bold text-ink">{title}</span>
        </span>
        <ExternalIcon className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-ink" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </li>
  );
}
