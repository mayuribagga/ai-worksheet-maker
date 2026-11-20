import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { StatusMessage, type StatusSearchParams } from "@/components/StatusMessage";
import { signup } from "../login/actions";

export default function SignupPage({ searchParams }: { searchParams: StatusSearchParams }) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="card flex w-full max-w-md flex-col gap-6 p-8">
        <h1 className="page-title">Create an account</h1>

        <Suspense>
          <StatusMessage searchParams={searchParams} />
        </Suspense>

        <AuthForm
          action={signup}
          submitLabel="Create account"
          pendingLabel="Creating account…"
          isNewPassword
        />

        <p className="text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="link">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
