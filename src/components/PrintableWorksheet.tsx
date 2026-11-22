import Image from "next/image";
import type { ReactNode } from "react";
import { brand } from "@/lib/brand";
import { describeTopic, type TopicDescription } from "@/data/curriculum";
import type { Worksheet, WorksheetMeta } from "@/lib/worksheet";
import { Sparkle } from "./Sparkle";
import { gradeBand } from "@/lib/grade-bands";
import { kindLabel, labelsFor, sheetLanguage } from "./worksheet/labels";
import { SheetHeading } from "./worksheet/SheetHeading";
import { WorksheetBody } from "./worksheet/WorksheetBody";

// A worksheet laid out for printing on Letter paper: the worksheet, then the
// same sheet with every answer filled in, starting on a new page.
export function PrintableWorksheet({
  worksheet,
  meta,
  titleAs,
}: {
  worksheet: Worksheet;
  meta: WorksheetMeta;
  titleAs?: "h1" | "h2";
}) {
  const description = describeTopic(meta.grade, meta.subject, meta.topicId);
  const lang = sheetLanguage(meta.subject);
  const band = gradeBand(meta.grade);
  const labels = labelsFor(lang);
  const kindName = kindLabel(meta.kind, lang);
  return (
    <div lang={lang} className="flex flex-col items-center gap-8 print:block">
      <Sheet description={description} pageLabel={kindName}>
        <SheetHeading worksheet={worksheet} description={description} labels={labels} kindName={kindName} titleAs={titleAs} />
        <div className="mt-8">
          <WorksheetBody worksheet={worksheet} lang={lang} headingLevel={titleAs === "h1" ? 2 : 3} band={band} />
        </div>
      </Sheet>

      <Sheet description={description} pageLabel={labels.answerKey} newPage>
        <p className="text-sm text-orchid-deep">{labels.answerKey}</p>
        <h2 className="font-display text-3xl font-black tracking-tight text-ink">{worksheet.title}</h2>
        <div className="mt-8">
          <WorksheetBody worksheet={worksheet} lang={lang} showAnswers hidePassages band={band} />
        </div>
      </Sheet>
    </div>
  );
}

// One printed page with the branded header and footer.
function Sheet({
  description,
  pageLabel,
  newPage = false,
  children,
}: {
  description: TopicDescription;
  pageLabel: string;
  newPage?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`flex min-h-[11in] w-full max-w-[8.5in] flex-col bg-white p-5 text-text sm:p-[0.6in] shadow-lg shadow-violet/10 print:min-h-0 print:max-w-none print:p-0 print:shadow-none ${newPage ?"break-before-page" : ""}`}
    >
      <header className="flex items-center justify-between gap-4 border-b-2 border-ink pb-3">
        <div>
          <Image
            src={brand.logoHorizontalSrc}
            alt={brand.name}
            width={764}
            height={200}
            className="h-12 w-auto"
          />
          <p className="mt-1 text-xs text-muted">{brand.tagline}</p>
        </div>
        <div className="text-right text-xs leading-snug text-muted">
          <p>
            {description.gradeLabel} {description.subjectName}
          </p>
          <p className="text-ink">{description.topicName}</p>
        </div>
      </header>

      <div className="flex-1 py-8 print:pb-0">{children}</div>

      {/* On paper, page numbers come from the print stylesheet instead. */}
      <footer className="flex justify-between border-t-2 border-line pt-2 text-xs text-muted print:hidden">
        <span className="flex items-center gap-1.5">
          <Sparkle className="h-3 w-3 text-blush" />
          {brand.footer}
        </span>
        <span>{pageLabel}</span>
      </footer>
    </section>
  );
}
