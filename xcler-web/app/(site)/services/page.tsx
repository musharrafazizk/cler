import { buildPageMetadata } from "@/lib/metadata";
import styles from "@/app/(site)/content.module.css";

export const metadata = buildPageMetadata({
  title: "Services",
  description: "Web development, app development, automation, and AI services by Xcler.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main className={styles.container}>
      <h1>Services</h1>
      <p className={styles.lead}>
        We deliver web development, app development, workflow automation, and AI systems for growth-stage teams.
      </p>
    </main>
  );
}
