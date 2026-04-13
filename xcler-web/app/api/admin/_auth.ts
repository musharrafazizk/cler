import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function requireAdminSession() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
