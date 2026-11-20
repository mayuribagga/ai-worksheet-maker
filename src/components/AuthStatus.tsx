import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

// Header links: sign in / create account, or the signed-in user's links.
export async function AuthStatus() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims.email;

  if (!email) {
    return (
      <nav className="flex items-center gap-3">
        <Link href="/login" className="link text-sm">
          Sign in
        </Link>
        <Link href="/signup" className="btn-primary text-sm">
          Create account
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex flex-wrap items-center gap-3">
      <Link href="/generate" className="btn-primary text-sm">
        Make a worksheet
      </Link>
      <Link href="/worksheets" className="link text-sm">
        My worksheets
      </Link>
      <div className="flex items-center gap-2 border-l-2 border-line pl-3">
        {/* Shows who's signed in: the first letter in a circle, plus the email. */}
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lilac font-display text-sm font-bold uppercase text-ink"
        >
          {email[0]}
        </span>
        <span className="hidden max-w-48 truncate text-sm text-muted sm:inline" title={email}>
          <span className="sr-only">Signed in as </span>
          {email}
        </span>
        <form action={signOut}>
          <button className="btn-secondary">Sign out</button>
        </form>
      </div>
    </nav>
  );
}
