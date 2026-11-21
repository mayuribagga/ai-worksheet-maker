import { z } from "zod";
import { resourceKinds, type ResourceKind } from "@/data/resource-kinds";
import type { SubjectId } from "@/data/subjects";

// The shape every generated resource must have. Claude is asked to reply in
// exactly this shape (through a tool), and the reply is checked before it's used.
//
// A resource has optional study notes, then sections. A section can open with
// something to work from (a reading passage, a data table, a grammar rule box
// or a word bank), followed by its questions.

const text = (description: string) => z.string().min(1).describe(description);
const marks = z.number().int().min(1).max(10).describe("How many marks the question is worth");

// Blanks are written as three or more underscores.
const BLANK = /_{3,}/g;

const multipleChoice = z.object({
  type: z.literal("multiple-choice"),
  prompt: text("The question"),
  choices: z.array(z.string().min(1)).min(3).max(4).describe("Three or four answer choices"),
  answerIndex: z.number().int().min(0).max(3).describe("Position (0-3) of the correct choice"),
  explanation: text("One sentence explaining the correct answer"),
  marks,
});

const trueFalse = z.object({
  type: z.literal("true-false"),
  statement: text("A statement that is clearly true or clearly false"),
  answer: z.boolean().describe("true if the statement is true"),
  explanation: text("One sentence explaining why, correcting the statement if it's false"),
  marks,
});

const fillInTheBlank = z.object({
  type: z.literal("fill-in-the-blank"),
  prompt: text(
    "A sentence with each blank written as ___ (three underscores). A hint may follow in brackets, " +
      "for example: Hier, nous ___ (manger) une pizza.",
  ),
  answers: z.array(z.string().min(1)).min(1).max(4).describe("The answer for each blank, in order"),
  marks,
});

const matching = z.object({
  type: z.literal("matching"),
  prompt: text("Instructions, for example: Match each term with its definition."),
  pairs: z
    .array(z.object({ term: text("Left column item"), match: text("Its matching right column item") }))
    .min(3)
    .max(8),
  marks,
});

const shortAnswer = z.object({
  type: z.literal("short-answer"),
  prompt: text("The question"),
  lines: z.number().int().min(1).max(6).describe("Answer lines to print"),
  answer: text("A model answer a teacher could mark against"),
  marks,
});

const longAnswer = z.object({
  type: z.literal("long-answer"),
  prompt: text("A question that needs a paragraph or more"),
  lines: z.number().int().min(5).max(14).describe("Answer lines to print"),
  answer: text("What a full-marks answer includes"),
  marks,
});

const showYourWork = z.object({
  type: z.literal("show-your-work"),
  prompt: text("A math problem where students show their working"),
  answer: text("The final answer, with units if needed"),
  solution: z.array(z.string().min(1)).min(1).max(8).describe("The worked solution, one step per item"),
  marks,
});

const question = z.discriminatedUnion("type", [
  multipleChoice,
  trueFalse,
  fillInTheBlank,
  matching,
  shortAnswer,
  longAnswer,
  showYourWork,
]);

const stimulus = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("passage"),
    title: text("Passage title"),
    paragraphs: z.array(z.string().min(1)).min(1).max(10),
  }),
  z.object({
    kind: z.literal("table"),
    title: text("What the table shows, with the source if it's real data"),
    columns: z.array(z.string().min(1)).min(2).max(6),
    rows: z.array(z.array(z.string())).min(2).max(12).describe("Each row has one cell per column"),
  }),
  z.object({
    kind: z.literal("rule"),
    title: text("The rule or reminder, for example: Le passé composé avec avoir"),
    points: z.array(z.string().min(1)).min(1).max(8),
  }),
  z.object({
    kind: z.literal("word-bank"),
    words: z.array(z.string().min(1)).min(3).max(16),
  }),
]);

const section = z.object({
  title: text("Section title, for example: Part A: Vocabulary"),
  instructions: text("What students do in this section, written to the student"),
  stimulus: stimulus.optional().describe("Something to work from, if the section needs it"),
  questions: z.array(question).min(1).max(12),
});

const noteBlock = z.object({
  heading: text("Note heading"),
  points: z.array(z.string().min(1)).min(1).max(6).describe("Short explanations, one idea each"),
  keyTerms: z
    .array(z.object({ term: text("Term"), definition: text("Student-friendly definition") }))
    .max(6)
    .optional(),
  example: z.string().min(1).optional().describe("A worked example; separate steps with new lines"),
});

// What Claude fills in.
export const worksheetSchema = z.object({
  title: text("Short, specific title"),
  instructions: text("One or two sentences to the student about the whole resource"),
  notes: z.array(noteBlock).max(6).optional().describe("Study notes, shown before the sections"),
  sections: z.array(section).min(1).max(5),
});

export type Worksheet = z.infer<typeof worksheetSchema>;
export type Question = z.infer<typeof question>;
export type Section = z.infer<typeof section>;
export type Stimulus = z.infer<typeof stimulus>;
export type NoteBlock = z.infer<typeof noteBlock>;

// Worksheets saved before mixed question types: five multiple-choice questions.
const legacySchema = z.object({
  title: z.string().min(1),
  instructions: z.string().min(1),
  questions: z
    .array(
      z.object({
        prompt: z.string().min(1),
        choices: z.array(z.string().min(1)).length(4),
        answerIndex: z.number().int().min(0).max(3),
        explanation: z.string().min(1),
      }),
    )
    .min(1),
});

function fromLegacy(old: z.infer<typeof legacySchema>): Worksheet {
  return {
    title: old.title,
    instructions: old.instructions,
    sections: [
      {
        title: "Multiple choice",
        instructions: old.instructions,
        questions: old.questions.map((q) => ({ type: "multiple-choice" as const, ...q, marks: 1 })),
      },
    ],
  };
}

// Checks a worksheet (from Claude or the database). Returns the worksheet, or
// a description of what's wrong, written so Claude can fix it on a retry.
export function parseWorksheet(input: unknown): { worksheet: Worksheet } | { problem: string } {
  const legacy = legacySchema.safeParse(input);
  if (legacy.success) {
    return { worksheet: fromLegacy(legacy.data) };
  }

  const result = worksheetSchema.safeParse(input);
  if (!result.success) {
    return { problem: z.prettifyError(result.error) };
  }

  // Things the schema can't express.
  for (const [s, sec] of result.data.sections.entries()) {
    for (const [q, item] of sec.questions.entries()) {
      const where = `Section ${s + 1}, question ${q + 1}`;
      const problem = checkQuestion(item);
      if (problem) return { problem: `${where}: ${problem}` };
    }
    if (sec.stimulus?.kind === "table") {
      const width = sec.stimulus.columns.length;
      if (sec.stimulus.rows.some((row) => row.length !== width)) {
        return { problem: `Section ${s + 1}: every table row needs exactly ${width} cells.` };
      }
    }
  }

  return { worksheet: result.data };
}

function checkQuestion(item: Question): string | undefined {
  switch (item.type) {
    case "multiple-choice": {
      if (item.answerIndex >= item.choices.length) return "answerIndex points past the last choice.";
      const unique = new Set(item.choices.map((c) => c.trim().toLowerCase()));
      if (unique.size !== item.choices.length) return "it has duplicate choices.";
      return;
    }
    case "fill-in-the-blank": {
      const blanks = item.prompt.match(BLANK)?.length ?? 0;
      if (blanks === 0) return "the prompt needs a blank written as ___.";
      if (blanks !== item.answers.length) return `it has ${blanks} blank(s) but ${item.answers.length} answer(s).`;
      return;
    }
    case "matching": {
      const terms = new Set(item.pairs.map((p) => p.term.trim().toLowerCase()));
      const matches = new Set(item.pairs.map((p) => p.match.trim().toLowerCase()));
      if (terms.size !== item.pairs.length || matches.size !== item.pairs.length) {
        return "every term and every match must be different.";
      }
      return;
    }
  }
}

// Splits a fill-in-the-blank prompt around its blanks.
export function splitBlanks(prompt: string): string[] {
  return prompt.split(BLANK);
}

// The right-hand column of a matching question, in a fixed mixed-up order
// (alphabetical), so the same worksheet always prints the same way.
export function matchingOrder(pairs: { term: string; match: string }[]) {
  const right = [...pairs.map((p) => p.match)].sort((a, b) => a.localeCompare(b, "fr"));
  const letterFor = (match: string) => String.fromCharCode(65 + right.indexOf(match));
  return { right, letterFor };
}

export function totalMarks(worksheet: Worksheet): number {
  return worksheet.sections.reduce(
    (sum, sec) => sum + sec.questions.reduce((n, q) => n + q.marks, 0),
    0,
  );
}

export function sectionMarks(sec: Section): number {
  return sec.questions.reduce((n, q) => n + q.marks, 0);
}

export function questionCount(worksheet: Worksheet): number {
  return worksheet.sections.reduce((n, sec) => n + sec.questions.length, 0);
}

// JSON Schema version of the shape, for Claude's tool definition.
export function worksheetJsonSchema() {
  const schema = z.toJSONSchema(worksheetSchema);
  delete schema.$schema; // Claude's API doesn't need the schema version
  // Zod writes question types as "oneOf"; "anyOf" is the form tool schemas
  // support most widely, and means the same here since each type is distinct.
  return JSON.parse(JSON.stringify(schema).replaceAll('"oneOf":', '"anyOf":'));
}

// Which curriculum topic a worksheet is for, and what kind of resource it is.
export type WorksheetMeta = {
  grade: number;
  subject: SubjectId;
  topicId: string;
  kind: ResourceKind;
  focus?: string;
};

// Checks that the resource has what its kind needs.
export function checkResourceKind(kind: ResourceKind, worksheet: Worksheet): string | undefined {
  const name = resourceKinds[kind].name.toLowerCase();
  switch (kind) {
    case "reading":
      if (!worksheet.sections.some((s) => s.stimulus?.kind === "passage")) {
        return `A ${name} needs a reading passage in its first section.`;
      }
      return;
    case "test":
      if (worksheet.sections.length !== 4) {
        return `A ${name} needs exactly 4 sections, one per achievement category.`;
      }
      return;
    case "notes":
    case "practice":
      if (!worksheet.notes?.length) {
        return `${resourceKinds[kind].name} need study notes before the questions.`;
      }
      return;
  }
}
