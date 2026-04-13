import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/db";
import { blurDataURL } from "@/lib/image";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/metadata";
import styles from "@/app/(site)/content.module.css";

type Params = { slug: string };

async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = params;
  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) {
    return buildPageMetadata({
      title: "Project",
      description: "Project from Xcler.",
      path: `/projects/${slug}`,
    });
  }

  return buildPageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.image_url || "/opengraph-image",
  });
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = params;
  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) {
    notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ]);

  return (
    <article className={styles.article}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1>{project.title}</h1>
      {project.image_url ? (
        <Image
          src={project.image_url}
          alt={`${project.title} cover image`}
          width={800}
          height={600}
          sizes="(max-width: 900px) 100vw, 860px"
          className={styles.cover}
          placeholder="blur"
          blurDataURL={blurDataURL}
        />
      ) : (
        <div className={`${styles.placeholder} ${styles.projectPlaceholder}`} aria-hidden="true">
          {project.category?.slice(0, 2).toUpperCase() || "PR"}
        </div>
      )}
      <p>{project.long_description}</p>
      <p className={styles.meta}>{project.tags.join(" · ")}</p>
    </article>
  );
}
