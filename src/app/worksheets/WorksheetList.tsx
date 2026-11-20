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
      <p className="text-zinc-600 dark:text-zinc-400">
        <Link href="/login" className="font-medium underline">
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
      <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
        Couldn&apos;t load your worksheets. Please try again.
      </p>
    );
  }

  if (worksheets.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        No worksheets yet.{" "}
        <Link href="/generate" className="font-medium underline">
          Make your first one
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
      {worksheets.map((worksheet) => (
        <li key={worksheet.id} className="py-3">
          <Link href={`/worksheets/${worksheet.id}`} className="font-medium hover:underline">
            {worksheet.title}
          </Link>
          <p className="text-sm text-zinc-500">
            {topicLabel(worksheet.grade, worksheet.subject, worksheet.topic_id)} ·{" "}
            {dateFormat.format(new Date(worksheet.created_at))}
          </p>
        </li>
      ))}
    </ul>
  );
}
