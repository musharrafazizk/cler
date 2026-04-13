import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/lib/db";
import { blurDataURL } from "@/lib/image";
import { buildPageMetadata } from "@/lib/metadata";
import styles from "@/app/(site)/content.module.css";

export const metadata = buildPageMetadata({
  title: "Blog",
  description: "Insights on web development, automation, and AI systems from Xcler.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getBlogPosts(true).catch(() => []);

  return (
    <main className={styles.container}>
      <h1>Blog</h1>
      <p className={styles.lead}>Practical notes from shipped client projects.</p>
      <section className={styles.grid}>
        {posts.map((post) => (
          <article key={post.id} className={styles.card}>
            {post.cover_image_url ? (
              <Image
                src={post.cover_image_url}
                alt={`${post.title} cover image`}
                width={1200}
                height={630}
                sizes="(max-width: 900px) 100vw, 33vw"
                className={`${styles.cover} ${styles.blogCover}`}
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
            ) : (
              <div className={`${styles.placeholder} ${styles.blogPlaceholder}`} aria-hidden="true">
                BLOG
              </div>
            )}
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`}>Read article →</Link>
          </article>
        ))}
      </section>
    </main>
  );
}
