import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

// Shows who's signed in with a sign-out button, or a sign-in link.
export async function AuthStatus() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims.email;

  if (!email) {
    return (
      <Link
        href="/login"
        className="w-fit rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Sign in or create an account
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Signed in as {email}</p>
      <form action={signOut}>
        <button className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
          Sign out
        </button>
      </form>
    </div>
  );
}
