import type { BlogPost, SiteSettings } from "@/lib/types";

type ServiceInput = {
  name: string;
  description: string;
  url?: string;
  areaServed?: string | string[];
  serviceType?: string;
};

type FaqInput = {
  question: string;
  answer: string;
};

type OrganizationSettings = Pick<SiteSettings, "facebook_url" | "instagram_url">;

const baseUrl = "https://xcler.dev";

export function organizationSchema(settings?: Partial<OrganizationSettings>) {
  const sameAs = [settings?.facebook_url, settings?.instagram_url].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Xcler",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Digital agency specializing in web development, app development, workflow automation, and AI systems.",
    email: "hello@xcler.dev",
    foundingDate: "2022",
    numberOfEmployees: 3,
    areaServed: ["DE", "PK", "Worldwide"],
    serviceType: [
      "Web Development",
      "App Development",
      "Workflow Automation",
      "AI Agents",
      "WordPress",
      "Shopify",
    ],
    sameAs,
  };
}

export function serviceSchema(service: ServiceInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "Xcler",
      url: baseUrl,
    },
    url: service.url,
    areaServed: service.areaServed ?? "Worldwide",
    serviceType: service.serviceType ?? service.name,
  };
}

export function localBusinessSchema(city: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Xcler — Webentwicklung & Automatisierung",
    url: `${baseUrl}/services/${city.toLowerCase()}`,
    areaServed: {
      "@type": "City",
      name: city,
    },
    priceRange: "€€",
    currenciesAccepted: "EUR",
    email: "hello@xcler.dev",
    availableLanguage: ["de", "en"],
  };
}

export function blogPostSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    image: post.cover_image_url ? [post.cover_image_url] : [`${baseUrl}/og-image.png`],
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author_name,
    },
    publisher: {
      "@type": "Organization",
      name: "Xcler",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    url: `${baseUrl}/blog/${post.slug}`,
    keywords: post.seo_keywords,
    articleSection: "Blog",
    wordCount: post.content.split(/\s+/).filter(Boolean).length,
    timeRequired: `PT${Math.max(post.reading_time_minutes, 1)}M`,
  };
}

export function faqSchema(faqs: FaqInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
