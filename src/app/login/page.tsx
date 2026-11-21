import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthLayout } from "@/components/AuthLayout";
import { StatusMessage, type StatusSearchParams } from "@/components/StatusMessage";
import { login } from "./actions";

type LoginSearchParams = Promise<Awaited<StatusSearchParams> & { next?: string }>;

export default function LoginPage({ searchParams }: { searchParams: LoginSearchParams }) {
  return (
    <AuthLayout title="Sign in">
      <Suspense>
        <StatusMessage searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<AuthForm action={login} submitLabel="Sign in" pendingLabel="Signing in…" />}>
        <LoginForm searchParams={searchParams} />
      </Suspense>

      <p className="text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="link">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

// The sign-in form, remembering the page the visitor was trying to open.
async function LoginForm({ searchParams }: { searchParams: LoginSearchParams }) {
  const { next } = await searchParams;
  return <AuthForm action={login} submitLabel="Sign in" pendingLabel="Signing in…" next={next} />;
}
