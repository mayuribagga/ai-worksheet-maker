import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// The home page buttons, which depend on whether someone is signed in.
export async function HeroActions() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    return (
      <div className="flex flex-wrap gap-3">
        <Link href="/generate" className="btn-primary px-6 py-3 text-lg">
          Make a worksheet
        </Link>
        <Link href="/worksheets" className="btn-secondary px-6 py-3 text-base">
          My worksheets
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/signup" className="btn-primary px-6 py-3 text-lg">
        Create a free account
      </Link>
      <Link href="/login" className="btn-secondary px-6 py-3 text-base">
        Sign in
      </Link>
    </div>
  );
}
