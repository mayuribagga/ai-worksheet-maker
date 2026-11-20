"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";
import { meetsPasswordRules } from "@/lib/password";
import { createClient } from "@/lib/supabase/server";

// Turns Supabase errors into messages that make sense to users.
function friendlyError(error: AuthError) {
  if (error.name === "AuthRetryableFetchError") {
    return "Couldn't reach the sign-in service. Please try again in a moment.";
  }
  return error.message;
}

function getCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(getCredentials(formData));

  if (error) {
    redirect(`/login?error=${encodeURIComponent(friendlyError(error))}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const credentials = getCredentials(formData);

  const name = String(formData.get("name") ?? "").trim();

  // The form already checks these, but never trust input from the browser.
  if (name.length < 1 || name.length > 60) {
    redirect(`/signup?error=${encodeURIComponent("Please enter your name (up to 60 characters).")}`);
  }
  if (!meetsPasswordRules(credentials.password)) {
    redirect(`/signup?error=${encodeURIComponent("Password doesn't meet the requirements.")}`);
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    ...credentials,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      // Saved with the account and included in the login, so the header can show it.
      data: { full_name: name },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(friendlyError(error))}`);
  }

  redirect(
    `/login?message=${encodeURIComponent("Check your email for a link to confirm your account.")}`,
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
