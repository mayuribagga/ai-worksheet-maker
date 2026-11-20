import Link from "next/link";
import { topicLabel } from "@/data/curriculum";
import { createClient } from "@/lib/supabase/server";

const dateFormat = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "medium",
  timeZone: "America/Toronto",
});

// Lists the signed-in user's saved worksheets, newest first.
export async function WorksheetList() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) {
    return (
      <p className="text-muted">
        <Link href="/login" className="link">
          Sign in
        </Link>{" "}
        to see your worksheets.
      </p>
    );
  }

  // Row-level security means this only ever returns the user's own worksheets.
  const { data: worksheets, error } = await supabase
    .from("worksheets")
    .select("id, title, grade, subject, topic_id, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Loading worksheets failed:", error);
    return (
      <p className="alert alert-error">
        Couldn&apos;t load your worksheets. Please try again.
      </p>
    );
  }

  if (worksheets.length === 0) {
    return (
      <p className="text-muted">
        No worksheets yet.{" "}
        <Link href="/generate" className="link">
          Make your first one
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-line">
      {worksheets.map((worksheet) => (
        <li key={worksheet.id} className="py-3">
          <Link href={`/worksheets/${worksheet.id}`} className="font-display text-lg font-bold text-ink hover:underline">
            {worksheet.title}
          </Link>
          <p className="text-sm text-muted">
            {topicLabel(worksheet.grade, worksheet.subject, worksheet.topic_id)} ·{" "}
            {dateFormat.format(new Date(worksheet.created_at))}
          </p>
        </li>
      ))}
    </ul>
  );
}
