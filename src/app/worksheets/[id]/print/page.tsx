import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PrintableWorksheet } from "@/components/PrintableWorksheet";
import { loadWorksheet } from "../../load";
import { WorksheetActions } from "@/components/WorksheetActions";

export default function PrintPage({ params }: PageProps<"/worksheets/[id]/print">) {
  return (
    <main className="flex flex-1 flex-col bg-lilac/25 px-3 py-8 sm:px-4 print:bg-white print:p-0">
      <Suspense fallback={<p className="text-center text-muted">Loading worksheet…</p>}>
        <PrintableSavedWorksheet params={params} />
      </Suspense>
    </main>
  );
}

async function PrintableSavedWorksheet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await loadWorksheet(id);

  if (result.status === "not-found") {
    notFound();
  }
  if (result.status === "invalid") {
    return <p className="text-center text-red-700">This worksheet couldn&apos;t be displayed.</p>;
  }

  return (
    <>
      {/* Toolbar shows on screen only, never on the printed page. */}
      <div className="mx-auto mb-6 flex w-full max-w-[8.5in] flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={`/worksheets/${result.id}`} className="link inline-block py-1 text-sm">
          ← Back to worksheet
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted">The answer key prints after the worksheet.</p>
          <WorksheetActions worksheetId={result.id} />
        </div>
      </div>
      <PrintableWorksheet worksheet={result.worksheet} meta={result.meta} titleAs="h1" />
    </>
  );
}
