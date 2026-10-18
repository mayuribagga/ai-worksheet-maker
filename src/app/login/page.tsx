import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { StatusMessage, type StatusSearchParams } from "@/components/StatusMessage";
import { login } from "./actions";

export default function LoginPage({ searchParams }: { searchParams: StatusSearchParams }) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>

      <Suspense>
        <StatusMessage searchParams={searchParams} />
      </Suspense>

      <AuthForm
        action={login}
        submitLabel="Sign in"
        pendingLabel="Signing in…"
      />

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-zinc-900 underline dark:text-zinc-100">
          Create one
        </Link>
      </p>
    </main>
  );
}
