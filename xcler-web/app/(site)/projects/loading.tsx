import styles from "@/app/(site)/content.module.css";

export default function ProjectsLoading() {
  return (
    <main className={styles.container}>
      <h1>Projects</h1>
      <section className={styles.grid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className={styles.card}>
            <div className={`${styles.skeletonBlock} ${styles.projectPlaceholder} skeletonPulse`} />
            <div className={`${styles.skeletonBlock} skeletonPulse`} style={{ height: 26, width: "70%" }} />
            <div className={`${styles.skeletonBlock} skeletonPulse`} style={{ height: 18, width: "100%" }} />
            <div className={`${styles.skeletonBlock} skeletonPulse`} style={{ height: 18, width: "60%" }} />
          </article>
        ))}
      </section>
    </main>
  );
}
