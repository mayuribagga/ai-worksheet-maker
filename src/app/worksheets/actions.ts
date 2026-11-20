"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function deleteWorksheet(id: string) {
  const supabase = await createClient();

  // Row-level security only lets users delete their own worksheets.
  const { error } = await supabase.from("worksheets").delete().eq("id", id);
  if (error) {
    console.error("Deleting worksheet failed:", error);
  }

  revalidatePath("/worksheets");
  redirect("/worksheets");
}
