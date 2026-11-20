import type { Metadata } from "next";
import { subjectSummaries } from "@/data/curriculum";
import { GenerateForm } from "./GenerateForm";

const topicCount = subjectSummaries().reduce((sum, s) => sum + s.topicCount, 0);

export const metadata: Metadata = { title: "Make a worksheet" };

export default function GeneratePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-10 sm:px-6">
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="page-title">Make a worksheet</h1>
        <p className="text-muted">
          Choose from {topicCount} Ontario curriculum topics for Grades 1 to 8. Your worksheet is saved
          automatically.
        </p>
      </div>
      <GenerateForm />
    </main>
  );
}
