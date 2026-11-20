import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Runs on every request: refreshes the login so users stay signed in,
// and keeps signed-out visitors away from members-only pages.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // Checks the login token and refreshes it if it's about to expire.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const path = request.nextUrl.pathname;

  // Signed-out visitors can't use these pages, so send them to sign in first.
  if (!signedIn && membersOnly.some((prefix) => path.startsWith(prefix))) {
    return redirectTo(request, response, "/login", {
      message: "Please sign in to continue.",
    });
  }

  // Signed-in users don't need the sign-in or sign-up pages.
  if (signedIn && (path === "/login" || path === "/signup")) {
    return redirectTo(request, response, "/generate");
  }

  return response;
}

const membersOnly = ["/generate", "/worksheets"];

// Redirects while keeping any refreshed login cookies set above.
function redirectTo(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
  params: Record<string, string> = {},
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = new URLSearchParams(params).toString();

  const redirect = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
