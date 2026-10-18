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

  // The form already checks this, but never trust input from the browser.
  if (!meetsPasswordRules(credentials.password)) {
    redirect(`/signup?error=${encodeURIComponent("Password doesn't meet the requirements.")}`);
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    ...credentials,
    options: { emailRedirectTo: `${origin}/auth/callback` },
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
