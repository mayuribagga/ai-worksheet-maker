import { z } from "zod";

export const QUESTION_COUNT = 5;

// The shape every generated worksheet must have.
// Claude is asked to reply in exactly this shape, and we check it before using it.
export const worksheetSchema = z.object({
  title: z.string().min(1).describe("Short worksheet title"),
  instructions: z.string().min(1).describe("One sentence telling students what to do"),
  questions: z
    .array(
      z.object({
        prompt: z.string().min(1).describe("The question"),
        choices: z.array(z.string().min(1)).length(4).describe("Exactly four answer choices"),
        answerIndex: z.number().int().min(0).max(3).describe("Position (0-3) of the correct choice"),
        explanation: z.string().min(1).describe("One short sentence explaining the correct answer"),
      }),
    )
    .length(QUESTION_COUNT),
});

export type Worksheet = z.infer<typeof worksheetSchema>;

// Checks Claude's reply. Returns the worksheet, or a description of what was wrong.
export function parseWorksheet(input: unknown): { worksheet: Worksheet } | { problem: string } {
  const result = worksheetSchema.safeParse(input);
  if (!result.success) {
    return { problem: z.prettifyError(result.error) };
  }

  // Things the schema can't express: no question should repeat a choice.
  for (const [i, question] of result.data.questions.entries()) {
    const unique = new Set(question.choices.map((c) => c.trim().toLowerCase()));
    if (unique.size !== question.choices.length) {
      return { problem: `Question ${i + 1} has duplicate choices.` };
    }
  }

  return { worksheet: result.data };
}

// JSON Schema version of the shape, for Claude's tool definition.
export function worksheetJsonSchema() {
  const schema = z.toJSONSchema(worksheetSchema);
  delete schema.$schema; // Claude's API doesn't need the schema version
  return schema;
}
