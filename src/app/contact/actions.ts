"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const messageSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "That name is too long."),
  email: z.email("Please enter a valid email address.").max(200, "That email is too long."),
  message: z
    .string()
    .trim()
    .min(10, "Please write a message of at least 10 characters.")
    .max(5000, "Please keep your message under 5,000 characters."),
});

export type ContactState = {
  sent?: boolean;
  error?: string;
  // Sent back after an error so the form keeps what the person typed.
  values?: { name: string; email: string; message: string };
};

export async function sendMessage(
  _previousState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // A hidden field that people never see. Spam bots fill in every field,
  // so if it has a value, pretend it worked and quietly drop the message.
  if (formData.get("website")) {
    return { sent: true };
  }

  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = messageSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, values };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);
  if (error) {
    console.error("Saving contact message failed:", error);
    return { error: "Sorry, your message couldn't be sent. Please try again.", values };
  }

  return { sent: true };
}
