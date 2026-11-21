"use server";

import Anthropic from "@anthropic-ai/sdk";
import { findTopic, worksheetSubjects, type SubjectId } from "@/data/curriculum";
import { isResourceKind, kindsFor, type ResourceKind } from "@/data/resource-kinds";
import { createClient } from "@/lib/supabase/server";
import {
  checkResourceKind,
  parseWorksheet,
  worksheetJsonSchema,
  type Worksheet,
  type WorksheetMeta,
} from "@/lib/worksheet";
import { buildRequest, styleGuide } from "@/lib/worksheet-prompt";

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
    return { error: "Please sign in to make a worksheet." };
  }

  // Check every choice against our curriculum data, since form values can be faked.
  const grade = Number(formData.get("grade"));
  const subject = String(formData.get("subject") ?? "") as SubjectId;
  const topic = worksheetSubjects.includes(subject)
    ? findTopic(grade, subject, String(formData.get("topic") ?? ""))
    : undefined;
  if (!topic) {
    return { error: "Please choose a grade, subject and topic." };
  }
  const kindValue = String(formData.get("kind") ?? "worksheet");
  const kind: ResourceKind =
    isResourceKind(kindValue) && kindsFor(subject).includes(kindValue) ? kindValue : "worksheet";
  const focusValue = String(formData.get("focus") ?? "");
  const focus = topic.subtopics.includes(focusValue) ? focusValue : undefined;

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
  const meta: WorksheetMeta = { grade, subject, topicId: topic.id, kind, focus };
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: buildRequest({ grade, subject, topic, kind, focus }) },
  ];

  try {
    let problem = "";

    // Ask Claude and check the reply. If it isn't usable, tell Claude what was
    // wrong and let it fix it once.
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const message = await anthropic.messages.create({
        model: process.env.WORKSHEET_MODEL ?? "claude-haiku-5-5",
        max_tokens: 8000,
        system: styleGuide,
        tools: [
          {
            name: "save_worksheet",
            description: "Save the finished resource.",
            input_schema: worksheetJsonSchema() as Anthropic.Tool.InputSchema,
          },
        ],
        // Forces Claude to reply by calling the tool, so we always get structured data.
        tool_choice: { type: "tool", name: "save_worksheet" },
        messages,
      });

      const toolUse = message.content.find((block) => block.type === "tool_use");
      const result = parseWorksheet(toolUse?.input);
      problem = "worksheet" in result ? checkResourceKind(kind, result.worksheet) ?? "" : result.problem;
      if (message.stop_reason === "max_tokens") {
        problem = "The resource was too long and got cut off. Make it a little shorter.";
      }

      if ("worksheet" in result && !problem) {
        // Save it to the signed-in user's worksheets. user_id is filled in by
        // the database, and row-level security makes sure it's theirs.
        const { data: saved, error: saveError } = await supabase
          .from("worksheets")
          .insert({
            title: result.worksheet.title,
            grade,
            subject,
            topic_id: topic.id,
            style_id: kind,
            content: result.worksheet,
          })
          .select("id")
          .single();

        if (saveError) {
          // Still show the worksheet, just let the user know it wasn't saved.
          // The error's fields are logged one by one, since the dev log shows
          // the whole object as {}.
          console.error(
            `Saving the worksheet failed: ${saveError.code} ${saveError.message}` +
              (saveError.code === "23514"
                ? ` (the database doesn't accept "${subject}" yet: run the latest files in supabase/migrations)`
                : ""),
          );
        }

        return {
          worksheet: result.worksheet,
          meta,
          savedId: saved?.id,
          saveFailed: Boolean(saveError),
          remainingToday,
        };
      }

      console.warn(`Worksheet attempt ${attempt} was invalid:`, problem);
      if (toolUse) {
        messages.push(
          { role: "assistant", content: message.content },
          {
            role: "user",
            content: [
              {
                type: "tool_result",
                tool_use_id: toolUse.id,
                is_error: true,
                content: `This can't be used yet: ${problem}\nPlease fix it and call save_worksheet again with the whole resource.`,
              },
            ],
          },
        );
      }
    }

    console.error("Worksheet still invalid after retrying:", problem);
    return { error: "The worksheet didn't come out right. Please try again." };
  } catch (error) {
    console.error("Worksheet generation failed:", error);

    if (error instanceof Anthropic.AuthenticationError) {
      return { error: "The Claude API key in .env.local isn't valid." };
    }
    if (error instanceof Anthropic.APIError) {
      return { error: `Claude API error: ${error.message}` };
    }
    return { error: "Something went wrong making the worksheet. Please try again." };
  }
}
