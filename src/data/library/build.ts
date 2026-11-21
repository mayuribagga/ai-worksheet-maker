import type { SubjectId } from "@/data/subjects";

// The building blocks of the curriculum library. Each subject file
// (math.ts, core-french.ts, …) describes its grades with these helpers,
// so the data stays easy to read and edit by hand.

export type Topic = {
  id: string;
  name: string;
  strand: string;
  subtopics: string[];
};

export type Strand = {
  name: string;
  topics: Topic[];
};

export type Course = {
  grade: number;
  subject: SubjectId;
  // The unit title from the curriculum document, e.g. "Global Communities".
  title?: string;
  // Something a teacher or parent should know, e.g. that a program is
  // offered by some boards only.
  note?: string;
  strands: Strand[];
};

// "Adding and subtracting to 20" → "adding-and-subtracting-to-20".
// Accents are removed first so French names make readable ids.
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// One topic, with its subtopics written as a single string split on "; ".
export function topic(name: string, subtopics: string): Omit<Topic, "strand"> {
  return {
    id: slugify(name),
    name,
    subtopics: subtopics
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export function strand(name: string, ...topics: Omit<Topic, "strand">[]): Strand {
  return { name, topics: topics.map((t) => ({ ...t, strand: name })) };
}

export function course(
  grade: number,
  subject: SubjectId,
  strands: Strand[],
  details: { title?: string; note?: string } = {},
): Course {
  // Topic ids are used in links and saved worksheets, so they must be unique
  // within a grade and subject. Catch mistakes while the data is being edited.
  const ids = strands.flatMap((s) => s.topics.map((t) => t.id));
  const duplicate = ids.find((id, i) => ids.indexOf(id) !== i);
  if (duplicate) {
    throw new Error(`Grade ${grade} ${subject} has two topics with the id "${duplicate}".`);
  }
  return { grade, subject, strands, ...details };
}
