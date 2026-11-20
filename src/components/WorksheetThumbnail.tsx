import Image from "next/image";
import { brand } from "@/lib/brand";
import type { Worksheet } from "@/lib/worksheet";

const letters = ["A", "B", "C", "D"];

// A small picture of the printed worksheet, for previews in lists.
// It's decoration: the card around it carries the title for screen readers.
export function WorksheetThumbnail({ worksheet }: { worksheet: Worksheet }) {
  return (
    <div
      aria-hidden
      className="relative aspect-[8.5/11] w-full overflow-hidden rounded-lg bg-white p-[7%] text-[7px] leading-snug text-text shadow-md shadow-violet/10 select-none"
    >
      <div className="flex items-center justify-between border-b border-ink pb-1">
        <Image src={brand.logoHorizontalSrc} alt="" width={737} height={200} className="h-3.5 w-auto" />
      </div>
      <p className="mt-2 font-display text-[11px] leading-tight font-black text-ink">
        {worksheet.title}
      </p>
      <p className="mt-0.5 line-clamp-2">{worksheet.instructions}</p>
      <p className="mt-1.5">Name: ______________ Date: ________</p>

      <ol className="mt-2.5 flex flex-col gap-2">
        {worksheet.questions.slice(0, 4).map((question, i) => (
          <li key={i}>
            <p className="line-clamp-2">
              {i + 1}. {question.prompt}
            </p>
            <ul className="mt-0.5 grid grid-cols-2 gap-x-2 pl-1.5">
              {question.choices.map((choice, j) => (
                <li key={j} className="flex items-center gap-1 truncate">
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full border border-violet" />
                  <span className="truncate">
                    {letters[j]}. {choice}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {/* Fade out the bottom so it reads as a preview of a longer page. */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
