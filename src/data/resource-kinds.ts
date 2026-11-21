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

export const resourceKinds: Record<ResourceKind, ResourceKindInfo> = {
  worksheet: {
    name: "Worksheet",
    description: "Mixed questions that build from recall to applying the idea.",
    recipe:
      "A classroom worksheet of 3 sections that move from recall to application. Use at least four " +
      "different question types across the sheet. Around 12 to 16 questions and 20 to 30 marks in total.",
  },
  practice: {
    name: "Practice activity",
    description: "A worked example, then lots of focused practice.",
    recipe:
      "A practice activity. Start with study notes that teach the skill through one fully worked example, " +
      "step by step. Then 2 or 3 sections of practice that get gradually harder, with more short items than " +
      "a worksheet (around 15 to 20). End with one challenge question.",
  },
  quiz: {
    name: "Quiz",
    description: "A short, marked check of what students know.",
    recipe:
      "A short quiz worth 15 to 25 marks. Part A (Partie A in French): short answers (multiple choice, true or false, " +
      "fill in the blank). Part B: 1 or 2 longer written answers that ask students to explain.",
  },
  test: {
    name: "Unit test",
    description: "A full test across the four Ontario achievement categories.",
    recipe:
      "An end-of-unit test worth 30 to 45 marks, with exactly 4 sections named after Ontario's achievement " +
      "categories: Knowledge and Understanding, Thinking, Communication, Application. Use a variety of " +
      "question types and include at least one longer response.",
  },
  notes: {
    name: "Study notes",
    description: "Clear notes with key terms and examples, plus a quick self-check.",
    recipe:
      "Study notes a student could review before a test: 3 to 5 note blocks with short explanations, key " +
      "terms with definitions and a worked example where it helps. Then one short 'Check your understanding' " +
      "section of 4 to 6 questions.",
  },
  reading: {
    name: "Reading comprehension",
    description: "An original passage with questions that ask students to use the text.",
    recipe:
      "A reading comprehension activity built on one original passage about the topic (length suited to the " +
      "grade: about 150 words in Grade 1 to 2, 250 to 350 in Grades 3 to 5, 400 to 500 in Grades 6 to 8, " +
      "split into short paragraphs). Sections: true or false, then questions answered using the text, then " +
      "one longer response that asks students to support their answer with details from the passage.",
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
