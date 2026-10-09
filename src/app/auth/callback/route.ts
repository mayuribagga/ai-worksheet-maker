import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// The link in the confirmation email sends users here with a one-time code.
// We swap the code for a login session, then send them to the home page.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/`);
    }
  }

  const error = "Couldn't confirm your email. Try signing in, or create your account again.";
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`);
}
