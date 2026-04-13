import { buildPageMetadata } from "@/lib/metadata";
import styles from "@/app/(site)/content.module.css";

export const metadata = buildPageMetadata({
  title: "About Xcler",
  description: "Meet the team behind Xcler and our approach to building digital products.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <h1>About</h1>
      <p className={styles.lead}>
        Xcler is a compact product team helping businesses launch web apps, automate operations, and build AI-enabled workflows.
      </p>
    </main>
  );
}
