"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import styles from "@/app/admin/admin.module.css";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.logo}>
          XCLER
        </Link>
        <nav className={styles.nav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.active : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.mobileTop}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={pathname === link.href ? styles.active : ""}>
              {link.label}
            </Link>
          ))}
        </div>
        <button className={styles.signOut} type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
