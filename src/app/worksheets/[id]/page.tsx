import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeftIcon } from "@/components/Icons";
import { PrintableWorksheet } from "@/components/PrintableWorksheet";
import { WorksheetActions } from "@/components/WorksheetActions";
import { WorksheetView } from "@/components/WorksheetView";
import { deleteWorksheet } from "../actions";
import { loadWorksheet } from "../load";
import { DeleteButton } from "./DeleteButton";

export default function WorksheetPage({ params }: PageProps<"/worksheets/[id]">) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 py-10 sm:px-6 print:max-w-none print:p-0">
      <Suspense fallback={<WorksheetSkeleton />}>
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

  return (
    <>
      {/* What's on screen. Printing shows only the printable version below. */}
      <div className="flex flex-col gap-6 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/worksheets" className="link inline-flex items-center gap-1.5 py-1 text-sm">
            <ArrowLeftIcon className="h-4 w-4" />
            My worksheets
          </Link>
          {result.status === "ok" && (
            <div className="flex flex-wrap items-center gap-2">
              <form action={deleteWorksheet.bind(null, result.id)}>
                <DeleteButton />
              </form>
              <WorksheetActions worksheetId={result.id} />
            </div>
          )}
        </div>

        {result.status === "ok" ? (
          <WorksheetView worksheet={result.worksheet} meta={result.meta} titleAs="h1" />
        ) : (
          <p className="alert alert-error">
            This worksheet&apos;s saved data is damaged, so it can&apos;t be shown. You can delete it
            from My worksheets.
          </p>
        )}
      </div>

      {result.status === "ok" && (
        <div className="hidden print:block">
          <PrintableWorksheet worksheet={result.worksheet} meta={result.meta} />
        </div>
      )}
    </>
  );
}

function WorksheetSkeleton() {
  return (
    <div aria-label="Loading worksheet" className="card flex flex-col gap-4 p-8">
      <div className="skeleton h-7 w-2/3" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton mt-6 h-4 w-5/6" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-4 w-4/5" />
    </div>
  );
}
