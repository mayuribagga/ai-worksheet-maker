import { topicLabel } from "@/data/curriculum";
import { createClient } from "@/lib/supabase/server";
import { parseWorksheet, type Worksheet } from "@/lib/worksheet";

export type LoadedWorksheet =
  | { status: "ok"; id: string; worksheet: Worksheet; label: string }
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
    label: topicLabel(row.grade, row.subject, row.topic_id),
  };
}
