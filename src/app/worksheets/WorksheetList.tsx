import Link from "next/link";
import { PlusIcon } from "@/components/Icons";
import { Sparkle } from "@/components/Sparkle";
import { TopicTags } from "@/components/TopicTags";
import { WorksheetThumbnail } from "@/components/WorksheetThumbnail";
import { describeTopic, type SubjectId } from "@/data/curriculum";
import { createClient } from "@/lib/supabase/server";
import { parseWorksheet } from "@/lib/worksheet";

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
    .select("id, title, grade, subject, topic_id, content, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Loading worksheets failed:", error);
    return (
      <p className="alert alert-error">
        Your worksheets couldn&apos;t be loaded. Refresh the page to try again.
      </p>
    );
  }

  if (worksheets.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <p className="-mt-2 text-sm text-muted">
        {worksheets.length === 1 ? "1 saved worksheet" : `${worksheets.length} saved worksheets`}
      </p>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {worksheets.map((worksheet) => {
          const parsed = parseWorksheet(worksheet.content);
          const description = describeTopic(worksheet.grade, worksheet.subject, worksheet.topic_id);
          return (
            <li key={worksheet.id}>
              <Link
                href={`/worksheets/${worksheet.id}`}
                className="card card-link group flex h-full flex-col overflow-hidden"
              >
                <div className="dotted bg-paper px-8 pt-6">
                  {"worksheet" in parsed ? (
                    <div className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-0.6deg]">
                      <WorksheetThumbnail worksheet={parsed.worksheet} />
                    </div>
                  ) : (
                    <div className="aspect-[8.5/11] rounded-lg bg-white" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 border-t-2 border-line p-4">
                  <TopicTags
                    subject={worksheet.subject as SubjectId}
                    description={description}
                    size="sm"
                  />
                  <h2 className="font-display text-lg leading-snug font-bold text-ink">
                    {worksheet.title}
                  </h2>
                  <p className="mt-auto flex justify-between gap-2 text-xs text-muted">
                    <span className="truncate">{description.topicName}</span>
                    <span className="shrink-0">{dateFormat.format(new Date(worksheet.created_at))}</span>
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function EmptyState() {
  return (
    <div className="card dotted flex flex-col items-center gap-5 px-6 py-14 text-center">
      <div aria-hidden className="relative h-28 w-24">
        <div className="absolute inset-0 rotate-[-8deg] rounded-xl bg-lilac/60" />
        <div className="absolute inset-0 rotate-[5deg] rounded-xl bg-blush/50" />
        <div className="absolute inset-0 flex flex-col gap-2 rounded-xl border-2 border-line bg-white p-3">
          <div className="h-2 w-3/4 rounded-full bg-violet/40" />
          <div className="h-1.5 w-full rounded-full bg-line" />
          <div className="h-1.5 w-5/6 rounded-full bg-line" />
          <div className="h-1.5 w-2/3 rounded-full bg-line" />
        </div>
        <Sparkle className="absolute -top-3 -right-4 h-6 w-6 text-orchid" />
      </div>
      <div className="flex max-w-sm flex-col gap-1">
        <h2 className="section-title text-2xl">No worksheets yet</h2>
        <p className="text-muted">
          Worksheets you make are saved here automatically, so you can print them again any time.
        </p>
      </div>
      <Link href="/generate" className="btn-primary">
        <PlusIcon className="h-4 w-4" />
        Make your first worksheet
      </Link>
    </div>
  );
}
