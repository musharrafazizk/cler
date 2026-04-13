import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/db";
import { blurDataURL } from "@/lib/image";
import { buildPageMetadata } from "@/lib/metadata";
import styles from "@/app/(site)/content.module.css";

export const metadata = buildPageMetadata({
  title: "Projects",
  description: "Recent web, app, automation, and AI builds delivered by Xcler.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => []);

  return (
    <main className={styles.container}>
      <h1>Projects</h1>
      <p className={styles.lead}>Selected launches and automation systems.</p>
      <section className={styles.grid}>
        {projects.map((project) => (
          <article key={project.id} className={styles.card}>
            {project.image_url ? (
              <Image
                src={project.image_url}
                alt={`${project.title} cover image`}
                width={800}
                height={600}
                sizes="(max-width: 900px) 100vw, 33vw"
                className={styles.cover}
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
            ) : (
              <div className={`${styles.placeholder} ${styles.projectPlaceholder}`} aria-hidden="true">
                {project.category?.slice(0, 2).toUpperCase() || "PR"}
              </div>
            )}
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <Link href={`/projects/${project.slug}`}>View project →</Link>
          </article>
        ))}
      </section>
    </main>
  );
}
