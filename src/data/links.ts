import { grades } from "./subjects";

// Links into the library.
export function libraryHref(grade?: number, subject?: string, topicId?: string): string {
  const parts = ["/library"];
  if (grade) parts.push(`grade-${grade}`);
  if (grade && subject) parts.push(subject);
  if (grade && subject && topicId) parts.push(topicId);
  return parts.join("/");
}

// "grade-4" → 4, or undefined if it isn't a grade we have.
export function parseGradeSlug(slug: string): number | undefined {
  const match = /^grade-(\d)$/.exec(slug);
  const grade = match ? Number(match[1]) : NaN;
  return grades.includes(grade) ? grade : undefined;
}


// A link to the worksheet maker with choices filled in.
export function generateHref(options: {
  grade: number;
  subject: string;
  topicId: string;
  kind?: string;
  focus?: string;
}): string {
  const params = new URLSearchParams({
    grade: String(options.grade),
    subject: options.subject,
    topic: options.topicId,
  });
  if (options.kind) params.set("kind", options.kind);
  if (options.focus) params.set("focus", options.focus);
  return `/generate?${params}`;
}
