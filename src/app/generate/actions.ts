"use server";

import Anthropic from "@anthropic-ai/sdk";
import { findTopic, subjectNames, type SubjectId } from "@/data/curriculum";
import { createClient } from "@/lib/supabase/server";
import {
  parseWorksheet,
  QUESTION_COUNT,
  worksheetJsonSchema,
  type Worksheet,
  type WorksheetMeta,
} from "@/lib/worksheet";

export type GenerateState = {
  worksheet?: Worksheet;
  meta?: WorksheetMeta;
  savedId?: string;
  saveFailed?: boolean;
  remainingToday?: number;
  error?: string;
};

const MAX_ATTEMPTS = 2;

export async function generateWorksheet(
  _previousState: GenerateState,
  formData: FormData,
): Promise<GenerateState> {
  // Only signed-in users can generate, since every call costs money.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Please sign in to generate a worksheet." };
  }

  // Check the choice against our curriculum data, since form values can be faked.
  const grade = Number(formData.get("grade"));
  const subject = String(formData.get("subject") ?? "") as SubjectId;
  const topic = findTopic(grade, subject, String(formData.get("topic") ?? ""));
  if (!topic) {
    return { error: "Please choose a grade, subject and topic." };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "ANTHROPIC_API_KEY is missing from .env.local." };
  }

  // Count this generation against the user's daily limit. The database does
  // the counting so the limit can't be bypassed from the browser.
  const { data: remainingToday, error: limitError } = await supabase.rpc("use_generation");
  if (limitError) {
    console.error("Checking the daily limit failed:", limitError);
    return { error: "Couldn't check your daily worksheet limit. Please try again." };
  }
  if (remainingToday < 0) {
    return { error: "You've reached today's worksheet limit. You can make more tomorrow." };
  }

  const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY
  const meta: WorksheetMeta = { grade, subject, topicId: topic.id };

  const request =
    `Write a Grade ${grade} ${subjectNames[subject]} worksheet on "${topic.name}" ` +
    `(strand: ${topic.strand}) with ${QUESTION_COUNT} multiple choice questions. ` +
    (subject === "french"
      ? "Write the title, instructions, questions and choices in French at a Core French level " +
        "for this grade. Write the explanations in English. "
      : "") +
    "Each question has exactly one correct choice. Save it with the save_worksheet tool.";

  try {
    let problem = "";

    // Ask Claude, check the reply, and try again once if it's not usable.
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const message = await anthropic.messages.create({
        model: process.env.WORKSHEET_MODEL ?? "claude-haiku-5-5",
        max_tokens: 3000,
        system:
          "You write worksheets for Ontario elementary students that follow the Ontario curriculum. " +
          "Use age-appropriate language for the grade, Canadian spelling and metric units. " +
          "Double-check that every marked answer is correct.",
        tools: [
          {
            name: "save_worksheet",
            description: "Save the finished worksheet.",
            input_schema: worksheetJsonSchema() as Anthropic.Tool.InputSchema,
          },
        ],
        // Forces Claude to reply by calling the tool, so we always get structured data.
        tool_choice: { type: "tool", name: "save_worksheet" },
        messages: [{ role: "user", content: request }],
      });

      const toolUse = message.content.find((block) => block.type === "tool_use");
      const result = parseWorksheet(toolUse?.input);
      if ("worksheet" in result) {
        // Save it to the signed-in user's worksheets. user_id is filled in by
        // the database, and row-level security makes sure it's theirs.
        const { data: saved, error: saveError } = await supabase
          .from("worksheets")
          .insert({
            title: result.worksheet.title,
            grade,
            subject,
            topic_id: topic.id,
            style_id: "multiple-choice",
            content: result.worksheet,
          })
          .select("id")
          .single();

        if (saveError) {
          // Still show the worksheet, just let the user know it wasn't saved.
          console.error("Saving the worksheet failed:", saveError);
        }

        return {
          worksheet: result.worksheet,
          meta,
          savedId: saved?.id,
          saveFailed: Boolean(saveError),
          remainingToday,
        };
      }

      problem = result.problem;
      console.warn(`Worksheet attempt ${attempt} was invalid:`, problem);
    }

    console.error("Worksheet still invalid after retrying:", problem);
    return { error: "Claude's worksheet didn't come out right. Please try again." };
  } catch (error) {
    console.error("Worksheet generation failed:", error);

    if (error instanceof Anthropic.AuthenticationError) {
      return { error: "The Claude API key in .env.local isn't valid." };
    }
    if (error instanceof Anthropic.APIError) {
      return { error: `Claude API error: ${error.message}` };
    }
    return { error: "Something went wrong generating the worksheet. Please try again." };
  }
}
