import type { SubjectId } from "@/data/curriculum";
import { createClient } from "@/lib/supabase/server";
import { parseWorksheet, type Worksheet, type WorksheetMeta } from "@/lib/worksheet";

export type LoadedWorksheet =
  | { status: "ok"; id: string; worksheet: Worksheet; meta: WorksheetMeta }
  | { status: "not-found" }
  | { status: "invalid" };

// Loads one of the signed-in user's saved worksheets.
// Row-level security means other users' worksheets come back as not found.
export async function loadWorksheet(id: string): Promise<LoadedWorksheet> {
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("worksheets")
    .select("id, grade, subject, topic_id, content")
    .eq("id", id)
    .maybeSingle();

  if (!row) {
    return { status: "not-found" };
  }

  // Check the stored data before showing it, in case its shape ever changes.
  const parsed = parseWorksheet(row.content);
  if (!("worksheet" in parsed)) {
    console.error(`Saved worksheet ${id} is invalid:`, parsed.problem);
    return { status: "invalid" };
  }

  return {
    status: "ok",
    id: row.id,
    worksheet: parsed.worksheet,
    meta: { grade: row.grade, subject: row.subject as SubjectId, topicId: row.topic_id },
  };
}
