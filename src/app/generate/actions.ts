"use server";

import Anthropic from "@anthropic-ai/sdk";
import { findTopic, subjectNames, type SubjectId } from "@/data/curriculum";
import { createClient } from "@/lib/supabase/server";

export type GenerateState = {
  worksheet?: string;
  error?: string;
};

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

  const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY

  try {
    const message = await anthropic.messages.create({
      model: process.env.WORKSHEET_MODEL ?? "claude-haiku-5-5",
      max_tokens: 2000,
      system:
        "You write worksheets for Ontario elementary students that follow the Ontario curriculum. " +
        "Use age-appropriate language for the grade, Canadian spelling and metric units.",
      messages: [
        {
          role: "user",
          content:
            `Write a Grade ${grade} ${subjectNames[subject]} worksheet on "${topic.name}" ` +
            `(strand: ${topic.strand}). ` +
            (subject === "french"
              ? "Write the questions in French at a Core French level for this grade. "
              : "") +
            "Include a title, one line of instructions, 5 multiple choice questions " +
            "with four options each, and an answer key at the end. Plain text only, no Markdown.",
        },
      ],
    });

    const worksheet = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return { worksheet };
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
