import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthLayout } from "@/components/AuthLayout";
import { StatusMessage, type StatusSearchParams } from "@/components/StatusMessage";
import { login } from "./actions";

export default function LoginPage({ searchParams }: { searchParams: StatusSearchParams }) {
  return (
    <AuthLayout title="Sign in">
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
    </AuthLayout>
  );
}
