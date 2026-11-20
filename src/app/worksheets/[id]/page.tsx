import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { WorksheetView } from "@/components/WorksheetView";
import { topicLabel } from "@/data/curriculum";
import { createClient } from "@/lib/supabase/server";
import { parseWorksheet } from "@/lib/worksheet";
import { deleteWorksheet } from "../actions";
import { DeleteButton } from "./DeleteButton";

export default function WorksheetPage({ params }: PageProps<"/worksheets/[id]">) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-24">
      <Link href="/worksheets" className="w-fit text-sm font-medium underline">
        ← My worksheets
      </Link>
      <Suspense fallback={<p className="text-zinc-500">Loading worksheet…</p>}>
        <SavedWorksheet params={params} />
      </Suspense>
    </main>
  );
}

async function SavedWorksheet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Returns nothing if the worksheet doesn't exist or belongs to someone else.
  const { data: row } = await supabase
    .from("worksheets")
    .select("id, grade, subject, topic_id, content")
    .eq("id", id)
    .maybeSingle();

  if (!row) {
    notFound();
  }

  // Check the stored data before showing it, in case its shape ever changes.
  const parsed = parseWorksheet(row.content);
  if (!("worksheet" in parsed)) {
    console.error(`Saved worksheet ${id} is invalid:`, parsed.problem);
    return (
      <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
        This worksheet couldn&apos;t be displayed.
      </p>
    );
  }

  return (
    <>
      <WorksheetView
        worksheet={parsed.worksheet}
        label={topicLabel(row.grade, row.subject, row.topic_id)}
      />
      <form action={deleteWorksheet.bind(null, row.id)}>
        <DeleteButton />
      </form>
    </>
  );
}
