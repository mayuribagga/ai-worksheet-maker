import type { SubjectId } from "./subjects";

// The kinds of learning resource the site can make for a topic.
// Every kind comes with an answer key.
export type ResourceKind = "worksheet" | "practice" | "quiz" | "test" | "notes" | "reading";

export type ResourceKindInfo = {
  name: string;
  // What students get, in one line.
  description: string;
  // Instructions for Claude: what this kind of resource should contain.
  recipe: string;
};

// Recipes describe each kind's structure. How long and how hard it is comes
// from the student's grade (see src/lib/grade-bands.ts).
export const resourceKinds: Record<ResourceKind, ResourceKindInfo> = {
  worksheet: {
    name: "Worksheet",
    description: "Mixed questions that build from recall to applying the idea.",
    recipe:
      "A classroom worksheet in 2 to 4 sections that move from recall to application, following the design " +
      "below. Use at least three different question types.",
  },
  practice: {
    name: "Practice activity",
    description: "A worked example, then lots of focused practice.",
    recipe:
      "A practice activity. Start with study notes that teach the skill through one fully worked example, " +
      "step by step, at the student's level. Then sections of practice that get gradually harder, with more " +
      "short items than a worksheet, following the design below. End with one challenge question.",
  },
  quiz: {
    name: "Quiz",
    description: "A short, marked check of what students know.",
    recipe:
      "A short quiz. Part A (Partie A in French): short answers (multiple choice, true or false, fill in the " +
      "blank, matching). Part B (Partie B): written answers that ask students to explain, as long as suits the grade.",
  },
  test: {
    name: "Unit test",
    description: "A full test across the four Ontario achievement categories.",
    recipe:
      "An end-of-unit test with exactly 4 sections named after Ontario's achievement categories: Knowledge " +
      "and Understanding, Thinking, Communication, Application (in French: Connaissance et compréhension, " +
      "Habiletés de la pensée, Communication, Mise en application). Use a variety of question types, and " +
      "give the Communication section at least one written response.",
  },
  notes: {
    name: "Study notes",
    description: "Clear notes with key terms and examples, plus a quick self-check.",
    recipe:
      "Study notes a student could review before a test: 3 to 5 note blocks with short explanations, key " +
      "terms with definitions and a worked example where it helps. Then one short 'Check your understanding' " +
      "section.",
  },
  reading: {
    name: "Reading comprehension",
    description: "An original passage with questions that ask students to use the text.",
    recipe:
      "A reading comprehension activity built on one original passage about the topic, split into short " +
      "paragraphs, in the genre given below. Sections: true or false, then questions answered using the text " +
      "(including at least one inference), then one longer response that asks students to support their " +
      "answer with details from the passage.",
  },
};

export const resourceKindOrder: ResourceKind[] = ["worksheet", "practice", "quiz", "test", "notes", "reading"];

// Reading passages fit language and social sciences topics, not math.
export function kindsFor(subject: SubjectId): ResourceKind[] {
  return subject === "math" ? resourceKindOrder.filter((k) => k !== "reading") : resourceKindOrder;
}

export function isResourceKind(value: string): value is ResourceKind {
  return value in resourceKinds;
}
