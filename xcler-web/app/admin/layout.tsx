import styles from "@/app/admin/admin.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <section className={styles.page}>{children}</section>;
}
