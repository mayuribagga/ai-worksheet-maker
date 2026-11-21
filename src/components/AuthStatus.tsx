import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AccountMenu } from "./AccountMenu";

// Right side of the header: sign in / create account, or the main action
// and the account menu for signed-in users.
export async function AuthStatus() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims.email;
  const savedName = data?.claims.user_metadata?.full_name;

  if (!email) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login" className="link inline-block py-1 text-sm">
          Sign in
        </Link>
        <Link href="/signup" className="btn-primary text-sm">
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/generate" className="btn-primary text-sm">
        Make a worksheet
      </Link>
      <AccountMenu email={email} name={displayName(savedName, email)} />
    </div>
  );
}

// The name the user gave at sign-up, or the start of their email for older
// accounts that don't have one (e.g. "meghankb06" for meghankb06@gmail.com).
function displayName(savedName: unknown, email: string): string {
  if (typeof savedName === "string" && savedName.trim()) return savedName.trim();
  return email.split("@")[0];
}
