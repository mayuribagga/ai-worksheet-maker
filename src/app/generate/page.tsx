import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { totalTopicCount } from "@/data/curriculum";
import { choicesFrom } from "./choices";
import { GenerateForm } from "./GenerateForm";

const topicCount = totalTopicCount();

export const metadata: Metadata = { title: "Make a worksheet" };

export default function GeneratePage({ searchParams }: PageProps<"/generate">) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-10 sm:px-6 print:max-w-none print:p-0">
      <div className="flex max-w-2xl flex-col gap-2 print:hidden">
        <h1 className="page-title">Make a worksheet</h1>
        <p className="text-muted">
          Choose from {topicCount} Ontario curriculum topics for Grades 1 to 8, or find a topic in the{" "}
          <Link href="/library" className="link">
            resource library
          </Link>
          . Everything you make is saved automatically.
        </p>
      </div>
      {/* Links from the library pre-fill the form, which needs the request's URL. */}
      <Suspense fallback={<GenerateForm />}>
        <PrefilledForm searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function PrefilledForm({ searchParams }: { searchParams: PageProps<"/generate">["searchParams"] }) {
  return <GenerateForm initial={choicesFrom(await searchParams)} />;
}
