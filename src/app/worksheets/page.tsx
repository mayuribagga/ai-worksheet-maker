import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PlusIcon } from "@/components/Icons";
import { WorksheetList } from "./WorksheetList";

export const metadata: Metadata = { title: "My worksheets" };

export default function WorksheetsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="page-title">My worksheets</h1>
        <Link href="/generate" className="btn-secondary">
          <PlusIcon className="h-4 w-4" />
          New worksheet
        </Link>
      </div>
      <Suspense fallback={<ListSkeleton />}>
        <WorksheetList />
      </Suspense>
    </main>
  );
}

function ListSkeleton() {
  return (
    <div aria-label="Loading your worksheets" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card flex flex-col gap-3 p-4">
          <div className="skeleton aspect-[4/3] w-full rounded-2xl" />
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-5 w-3/4" />
        </div>
      ))}
    </div>
  );
}
