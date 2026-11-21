import type { TopicDescription } from "@/data/curriculum";
import { totalMarks, type Worksheet } from "@/lib/worksheet";
import type { SheetLabels } from "./labels";

// The top of a worksheet: title and instructions, the name and date lines,
// and a small box with the curriculum connection and total marks.
export function SheetHeading({
  worksheet,
  description,
  labels,
  kindName,
  titleAs: Title = "h2",
}: {
  worksheet: Worksheet;
  description: TopicDescription;
  labels: SheetLabels;
  kindName: string;
  // h1 when the worksheet is the page's main content.
  titleAs?: "h1" | "h2";
}) {
  return (
    <header className="flex flex-col gap-4">
      <div className="grid grid-cols-[auto_1fr_auto_8rem] items-end gap-x-2 text-sm text-muted">
        <span>{labels.name}</span>
        <span className="border-b-2 border-dotted border-lilac" />
        <span>{labels.date}</span>
        <span className="border-b-2 border-dotted border-lilac" />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex max-w-xl min-w-0 flex-1 flex-col gap-1.5">
          <p className="text-sm text-orchid-deep">{kindName}</p>
          <Title className="font-display text-[1.75rem] leading-tight font-bold tracking-tight text-balance text-ink">
            {worksheet.title}
          </Title>
          <p className="text-text">{worksheet.instructions}</p>
        </div>

        <dl className="grid w-full shrink-0 grid-cols-[1fr_auto] overflow-hidden rounded-xl border-2 border-line text-xs sm:w-52">
          <div className="col-span-2 border-b-2 border-line px-3 py-2">
            <dt className="text-muted">{labels.curriculum}</dt>
            <dd className="mt-0.5 leading-snug text-ink">
              {description.gradeLabel}, {description.strand ?? description.subjectName}
            </dd>
          </div>
          <dt className="px-3 py-2 text-muted">{labels.total}</dt>
          <dd className="border-l-2 border-line px-3 py-2 font-display text-sm text-ink">
            &nbsp;&nbsp;&nbsp;&nbsp;/{totalMarks(worksheet)}
          </dd>
        </dl>
      </div>
    </header>
  );
}
