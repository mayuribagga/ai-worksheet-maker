"use server";

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

export type GenerateState = {
  worksheet?: string;
  error?: string;
};

// Hardcoded for now. The topic and style pickers come later.
const topic = {
  grade: 4,
  subject: "Math",
  name: "Fractions",
};

export async function generateWorksheet(): Promise<GenerateState> {
  // Only signed-in users can generate, since every call costs money.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Please sign in to generate a worksheet." };
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
            `Write a Grade ${topic.grade} ${topic.subject} worksheet on ${topic.name}. ` +
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
