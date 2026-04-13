import styles from "@/app/admin/admin.module.css";

export default function AdminLoading() {
  return (
    <div className={styles.loadingWrap}>
      <div className={styles.loadingSpinner} aria-label="Loading" />
    </div>
  );
}
