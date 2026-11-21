import Image from "next/image";
import { brand } from "@/lib/brand";
import type { Question, Worksheet } from "@/lib/worksheet";

// A small picture of the printed worksheet, for previews in lists.
// It's decoration: the card around it carries the title for screen readers.
export function WorksheetThumbnail({ worksheet }: { worksheet: Worksheet }) {
  const first = worksheet.sections[0];
  return (
    <div
      aria-hidden
      className="relative aspect-[8.5/11] w-full overflow-hidden rounded-lg bg-white p-[7%] text-[7px] leading-snug text-text shadow-md shadow-violet/10 select-none"
    >
      <div className="flex items-center justify-between border-b border-ink pb-1">
        <Image src={brand.logoHorizontalSrc} alt="" width={764} height={200} className="h-3.5 w-auto" />
      </div>
      <p className="mt-2 font-display text-[11px] leading-tight font-black text-ink">{worksheet.title}</p>
      <p className="mt-0.5 line-clamp-2">{worksheet.instructions}</p>

      {worksheet.notes?.[0] && (
        <div className="mt-1.5 rounded border border-lilac px-1 py-0.5">
          <p className="font-bold text-ink">{worksheet.notes[0].heading}</p>
          <p className="line-clamp-2">{worksheet.notes[0].points[0]}</p>
        </div>
      )}

      <p className="mt-2 border-b border-ink/70 font-bold text-ink">{first.title}</p>
      {first.stimulus?.kind === "passage" && (
        <p className="mt-1 line-clamp-4 rounded border border-line px-1 py-0.5">{first.stimulus.paragraphs[0]}</p>
      )}
      <ol className="mt-1.5 flex flex-col gap-1.5">
        {first.questions.slice(0, 4).map((question, i) => (
          <li key={i}>
            <p className="line-clamp-2">
              {i + 1}. {promptOf(question)}
            </p>
            <span className="mt-0.5 block h-px w-full bg-line" />
          </li>
        ))}
      </ol>

      {/* Fade out the bottom so it reads as a preview of a longer page. */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

function promptOf(question: Question): string {
  return question.type === "true-false" ? question.statement : question.prompt;
}
