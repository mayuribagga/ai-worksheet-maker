import { Suspense } from "react";
import { AuthStatus } from "@/components/AuthStatus";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">AI Worksheet Maker</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Pick a grade, subject and topic from the Ontario curriculum, choose a
        worksheet style, and get a ready-to-print worksheet with an answer key.
      </p>
      <Suspense fallback={<div className="h-10" />}>
        <AuthStatus />
      </Suspense>
    </main>
  );
}
