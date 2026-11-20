import { Suspense } from "react";
import { WorksheetList } from "./WorksheetList";

export default function WorksheetsPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="page-title">My worksheets</h1>
      <Suspense fallback={<p className="text-muted">Loading your worksheets…</p>}>
        <WorksheetList />
      </Suspense>
    </main>
  );
}
