import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { StatusMessage, type StatusSearchParams } from "@/components/StatusMessage";
import { signup } from "../login/actions";

export default function SignupPage({ searchParams }: { searchParams: StatusSearchParams }) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Create an account</h1>

      <Suspense>
        <StatusMessage searchParams={searchParams} />
      </Suspense>

      <AuthForm
        action={signup}
        submitLabel="Create account"
        pendingLabel="Creating account…"
        passwordAutoComplete="new-password"
      />

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-zinc-900 underline dark:text-zinc-100">
          Sign in
        </Link>
      </p>
    </main>
  );
}
