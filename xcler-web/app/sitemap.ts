import type { MetadataRoute } from "next";
import { getBlogPosts, getProjects } from "@/lib/db";

const baseUrl = "https://xcler.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${baseUrl}/services/germany`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${baseUrl}/services/berlin`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${baseUrl}/services/hamburg`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${baseUrl}/services/munich`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${baseUrl}/services/frankfurt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${baseUrl}/services/cologne`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${baseUrl}/services/dusseldorf`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const [posts, projects] = await Promise.all([getBlogPosts(true), getProjects()]);

    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.created_at ? new Date(project.created_at) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticPages, ...blogPages, ...projectPages];
  } catch {
    return staticPages;
  }
}
