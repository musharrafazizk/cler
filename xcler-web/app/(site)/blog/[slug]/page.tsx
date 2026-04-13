import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/db";
import { blurDataURL } from "@/lib/image";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/metadata";
import styles from "@/app/(site)/content.module.css";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = params;
  const post = await getBlogPost(slug).catch(() => null);

  if (!post) {
    return buildPageMetadata({
      title: "Blog post",
      description: "Blog post from Xcler.",
      path: `/blog/${slug}`,
    });
  }

  const published = post.published_at ?? post.created_at;

  return {
    ...buildPageMetadata({
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      path: `/blog/${post.slug}`,
      image: post.cover_image_url || "/opengraph-image",
    }),
    openGraph: {
      type: "article",
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      url: `https://xcler.dev/blog/${post.slug}`,
      images: [{ url: post.cover_image_url || "/opengraph-image" }],
      publishedTime: published,
      modifiedTime: post.updated_at,
      authors: ["Musharraf Aziz"],
      section: post.seo_keywords?.[0] || "Blog",
    },
    other: {
      "article:published_time": published,
      "article:modified_time": post.updated_at,
      "article:author": "Musharraf Aziz",
      "article:section": post.seo_keywords?.[0] || "Blog",
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = params;
  const post = await getBlogPost(slug).catch(() => null);

  if (!post || !post.published) {
    notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <article className={styles.article}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1>{post.title}</h1>
      <p className={styles.meta}>
        By Musharraf Aziz · {new Date(post.published_at ?? post.created_at).toLocaleDateString()}
      </p>
      {post.cover_image_url ? (
        <Image
          src={post.cover_image_url}
          alt={`${post.title} cover image`}
          width={1200}
          height={630}
          sizes="(max-width: 900px) 100vw, 860px"
          className={`${styles.cover} ${styles.blogCover}`}
          placeholder="blur"
          blurDataURL={blurDataURL}
        />
      ) : (
        <div className={`${styles.placeholder} ${styles.blogPlaceholder}`} aria-hidden="true">
          BLOG
        </div>
      )}
      <p>{post.content}</p>
    </article>
  );
}
