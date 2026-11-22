"use client";

import { useId, useState } from "react";
import { describeTopic } from "@/data/curriculum";
import type { Worksheet, WorksheetMeta } from "@/lib/worksheet";
import { gradeBand } from "@/lib/grade-bands";
import { TopicTags } from "./TopicTags";
import { kindLabel, labelsFor, sheetLanguage } from "./worksheet/labels";
import { SheetHeading } from "./worksheet/SheetHeading";
import { WorksheetBody } from "./worksheet/WorksheetBody";

// A worksheet on screen, styled like a sheet of paper, with an answer key switch.
export function WorksheetView({
  worksheet,
  meta,
  titleAs,
}: {
  worksheet: Worksheet;
  meta: WorksheetMeta;
  titleAs?: "h1" | "h2";
}) {
  const [showAnswers, setShowAnswers] = useState(false);
  const switchId = useId();
  const description = describeTopic(meta.grade, meta.subject, meta.topicId);
  const lang = sheetLanguage(meta.subject);

  return (
    <article lang={lang} className="animate-sheet-in overflow-hidden rounded-3xl border-2 border-line bg-white shadow-[0_10px_30px_-12px_rgb(0_74_173/0.25)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line bg-paper/60 px-6 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <TopicTags subject={meta.subject} description={description} size="sm" />
          <span className="text-sm text-muted">{description.topicName}</span>
        </div>

        {/* A real switch: keyboard and screen reader friendly. */}
        <label htmlFor={switchId} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          Answer key
          <button
            id={switchId}
            type="button"
            role="switch"
            aria-checked={showAnswers}
            onClick={() => setShowAnswers(!showAnswers)}
            className="relative h-6 w-11 rounded-full border-2 border-field bg-line transition-colors aria-checked:border-royal aria-checked:bg-royal"
          >
            <span
              aria-hidden
              className={`absolute top-px left-px h-4 w-4 rounded-full bg-white shadow ring-1 ring-field transition-transform ${showAnswers ? "translate-x-5" : ""}`}
            />
          </button>
        </label>
      </div>

      <div className="flex flex-col gap-8 px-5 py-7 sm:px-10">
        <SheetHeading
          worksheet={worksheet}
          description={description}
          labels={labelsFor(lang)}
          kindName={kindLabel(meta.kind, lang)}
          titleAs={titleAs}
        />
        <WorksheetBody
          worksheet={worksheet}
          lang={lang}
          showAnswers={showAnswers}
          headingLevel={titleAs === "h1" ? 2 : 3}
          band={gradeBand(meta.grade)}
        />
      </div>
    </article>
  );
}
