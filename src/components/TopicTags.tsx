import type { SubjectId, TopicDescription } from "@/data/curriculum";
import { subjectStyles } from "@/lib/subjects";

// Grade and subject as small tags, colour-coded by subject.
export function TopicTags({
  subject,
  description,
  size = "md",
}: {
  subject: SubjectId;
  description: TopicDescription;
  size?: "sm" | "md";
}) {
  const style = subjectStyles[subject];
  const tag = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className={`inline-flex items-center gap-1.5 rounded-full ${style.tint} ${tag} text-ink`}>
        <span aria-hidden className={`h-2 w-2 rounded-full ${style.dot}`} />
        {style.short}
      </span>
      <span className={`rounded-full bg-paper ${tag} text-muted ring-1 ring-line`}>
        {description.gradeLabel}
      </span>
    </div>
  );
}
