import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { createServerSupabaseClient } from "@/lib/supabase";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      redirect("/admin/login");
    }
  } catch {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
