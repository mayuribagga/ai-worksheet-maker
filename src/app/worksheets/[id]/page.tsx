import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { WorksheetView } from "@/components/WorksheetView";
import { deleteWorksheet } from "../actions";
import { loadWorksheet } from "../load";
import { DeleteButton } from "./DeleteButton";

export default function WorksheetPage({ params }: PageProps<"/worksheets/[id]">) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <Link href="/worksheets" className="w-fit link text-sm">
        ← My worksheets
      </Link>
      <Suspense fallback={<p className="text-muted">Loading worksheet…</p>}>
        <SavedWorksheet params={params} />
      </Suspense>
    </main>
  );
}

async function SavedWorksheet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await loadWorksheet(id);

  if (result.status === "not-found") {
    notFound();
  }
  if (result.status === "invalid") {
    return (
      <p className="alert alert-error">
        This worksheet couldn&apos;t be displayed.
      </p>
    );
  }

  return (
    <>
      <WorksheetView worksheet={result.worksheet} label={result.label} />
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/worksheets/${result.id}/print`}
          className="btn-primary text-sm"
        >
          Print or save as PDF
        </Link>
        <form action={deleteWorksheet.bind(null, result.id)}>
          <DeleteButton />
        </form>
      </div>
    </>
  );
}
