import { createClient } from "@/lib/supabase/server";

// What the signed-in user has already made in the library.
// Both return null for signed-out visitors.

// How many resources the user has made for each topic in a grade and subject.
export async function savedTopicCounts(grade: number, subject: string): Promise<Record<string, number> | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return null;

  // Row-level security means this only returns the user's own worksheets.
  const { data, error } = await supabase
    .from("worksheets")
    .select("topic_id")
    .eq("grade", grade)
    .eq("subject", subject);
  if (error) {
    console.error("Loading saved topic counts failed:", error);
    return {};
  }

  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.topic_id] = (counts[row.topic_id] ?? 0) + 1;
  }
  return counts;
}

export type SavedResource = { id: string; title: string; kind: string; createdAt: string };

// The user's resources for one topic, newest first.
export async function savedForTopic(
  grade: number,
  subject: string,
  topicId: string,
): Promise<SavedResource[] | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return null;

  const { data, error } = await supabase
    .from("worksheets")
    .select("id, title, style_id, created_at")
    .eq("grade", grade)
    .eq("subject", subject)
    .eq("topic_id", topicId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Loading saved resources failed:", error);
    return [];
  }
  return data.map((row) => ({ id: row.id, title: row.title, kind: row.style_id, createdAt: row.created_at }));
}
