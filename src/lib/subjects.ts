import type { SubjectId } from "@/data/subjects";

// Each subject has its own colour, used consistently across the site so
// teachers can recognize a subject at a glance. (Class names are written out
// in full so Tailwind can find them.)
export const subjectStyles: Record<
  SubjectId,
  { short: string; dot: string; tint: string; border: string; spine: string }
> = {
  math: {
    short: "Math",
    dot: "bg-violet",
    tint: "bg-violet/10",
    border: "border-violet/40",
    spine: "bg-violet",
  },
  french: {
    short: "Core French",
    dot: "bg-orchid",
    tint: "bg-orchid/12",
    border: "border-orchid/50",
    spine: "bg-orchid",
  },
  "french-immersion": {
    short: "French Immersion",
    dot: "bg-ink",
    tint: "bg-ink/8",
    border: "border-ink/30",
    spine: "bg-ink",
  },
  science: {
    short: "Science",
    dot: "bg-royal",
    tint: "bg-royal/10",
    border: "border-royal/40",
    spine: "bg-royal",
  },
  "social-studies": {
    short: "Social Studies",
    dot: "bg-blush ring-1 ring-orchid/60",
    tint: "bg-blush/25",
    border: "border-blush",
    spine: "bg-blush",
  },
  history: {
    short: "History",
    dot: "bg-lilac ring-1 ring-orchid/60",
    tint: "bg-lilac/30",
    border: "border-lilac",
    spine: "bg-lilac",
  },
  geography: {
    short: "Geography",
    dot: "bg-sea",
    tint: "bg-sea/12",
    border: "border-sea/40",
    spine: "bg-sea",
  },
  // Worksheets saved before History and Geography were split.
  "history-geography": {
    short: "History and Geography",
    dot: "bg-lilac ring-1 ring-orchid/60",
    tint: "bg-lilac/30",
    border: "border-lilac",
    spine: "bg-lilac",
  },
};
