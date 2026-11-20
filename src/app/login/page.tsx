import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { StatusMessage, type StatusSearchParams } from "@/components/StatusMessage";
import { login } from "./actions";

export default function LoginPage({ searchParams }: { searchParams: StatusSearchParams }) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="card flex w-full max-w-md flex-col gap-6 p-8">
        <h1 className="page-title">Sign in</h1>

        <Suspense>
          <StatusMessage searchParams={searchParams} />
        </Suspense>

        <AuthForm
          action={login}
          submitLabel="Sign in"
          pendingLabel="Signing in…"
        />

        <p className="text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="link">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
