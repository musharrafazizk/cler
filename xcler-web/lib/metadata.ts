import type { Metadata } from "next";

const siteUrl = "https://xcler.dev";
const defaultImage = "/opengraph-image";

type PageMetaOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function buildPageMetadata({ title, description, path, image = defaultImage }: PageMetaOptions): Metadata {
  const canonical = path === "/" ? siteUrl : `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: image }],
    },
    twitter: {
      title,
      description,
      images: [image],
    },
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : `${siteUrl}${item.path}`,
    })),
  };
}
