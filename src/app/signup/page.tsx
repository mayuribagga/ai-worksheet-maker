import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthLayout } from "@/components/AuthLayout";
import { StatusMessage, type StatusSearchParams } from "@/components/StatusMessage";
import { signup } from "../login/actions";

export default function SignupPage({ searchParams }: { searchParams: StatusSearchParams }) {
  return (
    <AuthLayout title="Create an account">
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
    </AuthLayout>
  );
}
