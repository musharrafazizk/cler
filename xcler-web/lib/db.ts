import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase";
import type { BlogPost, Project, SiteSettings, TeamMember, Testimonial } from "@/lib/types";

type ProjectInput = Omit<Project, "id" | "created_at">;
type TeamMemberInput = Omit<TeamMember, "id">;
type TestimonialInput = Omit<Testimonial, "id">;
type BlogPostInput = Omit<BlogPost, "id" | "created_at" | "updated_at">;
type SiteSettingsInput = Omit<SiteSettings, "id">;

function throwOnError(error: { message: string } | null, defaultMessage: string) {
  if (error) {
    throw new Error(error.message || defaultMessage);
  }
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("projects").select("*").order("order_index", { ascending: true });
  throwOnError(error, "Failed to fetch projects");
  return data ?? [];
}

export async function getProject(id: string): Promise<Project> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  throwOnError(error, "Failed to fetch project");
  return data;
}

export async function createProject(data: ProjectInput): Promise<Project> {
  const supabase = await createServerSupabaseClient();
  const { data: created, error } = await supabase.from("projects").insert(data).select("*").single();
  throwOnError(error, "Failed to create project");
  return created;
}

export async function updateProject(id: string, data: Partial<ProjectInput>): Promise<Project> {
  const supabase = await createServerSupabaseClient();
  const { data: updated, error } = await supabase.from("projects").update(data).eq("id", id).select("*").single();
  throwOnError(error, "Failed to update project");
  return updated;
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  throwOnError(error, "Failed to delete project");
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("team_members").select("*").order("order_index", { ascending: true });
  throwOnError(error, "Failed to fetch team members");
  return data ?? [];
}

export async function createTeamMember(data: TeamMemberInput): Promise<TeamMember> {
  const supabase = await createServerSupabaseClient();
  const { data: created, error } = await supabase.from("team_members").insert(data).select("*").single();
  throwOnError(error, "Failed to create team member");
  return created;
}

export async function updateTeamMember(id: string, data: Partial<TeamMemberInput>): Promise<TeamMember> {
  const supabase = await createServerSupabaseClient();
  const { data: updated, error } = await supabase.from("team_members").update(data).eq("id", id).select("*").single();
  throwOnError(error, "Failed to update team member");
  return updated;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  throwOnError(error, "Failed to delete team member");
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("testimonials").select("*");
  throwOnError(error, "Failed to fetch testimonials");
  return data ?? [];
}

export async function createTestimonial(data: TestimonialInput): Promise<Testimonial> {
  const supabase = await createServerSupabaseClient();
  const { data: created, error } = await supabase.from("testimonials").insert(data).select("*").single();
  throwOnError(error, "Failed to create testimonial");
  return created;
}

export async function updateTestimonial(id: string, data: Partial<TestimonialInput>): Promise<Testimonial> {
  const supabase = await createServerSupabaseClient();
  const { data: updated, error } = await supabase.from("testimonials").update(data).eq("id", id).select("*").single();
  throwOnError(error, "Failed to update testimonial");
  return updated;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  throwOnError(error, "Failed to delete testimonial");
}

export async function getBlogPosts(published?: boolean): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (typeof published === "boolean") {
    query = query.eq("published", published);
  }
  const { data, error } = await query;
  throwOnError(error, "Failed to fetch blog posts");
  return data ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
  throwOnError(error, "Failed to fetch blog post");
  return data;
}

export async function createBlogPost(data: BlogPostInput): Promise<BlogPost> {
  const supabase = await createServerSupabaseClient();
  const { data: created, error } = await supabase.from("blog_posts").insert(data).select("*").single();
  throwOnError(error, "Failed to create blog post");
  return created;
}

export async function updateBlogPost(id: string, data: Partial<BlogPostInput>): Promise<BlogPost> {
  const supabase = await createServerSupabaseClient();
  const { data: updated, error } = await supabase.from("blog_posts").update(data).eq("id", id).select("*").single();
  throwOnError(error, "Failed to update blog post");
  return updated;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  throwOnError(error, "Failed to delete blog post");
}

export async function getSettings(): Promise<SiteSettings> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
  throwOnError(error, "Failed to fetch settings");

  if (data) {
    return data;
  }

  const defaultSettings: SiteSettingsInput = {
    contact_email: "hello@xcler.dev",
    whatsapp_number: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    hero_headline_line1: "We build",
    hero_headline_line2: "digital things",
    hero_subheading: "that work.",
  };

  const { data: created, error: createError } = await supabase
    .from("site_settings")
    .insert(defaultSettings)
    .select("*")
    .single();

  throwOnError(createError, "Failed to initialize settings");
  return created;
}

export async function updateSettings(data: SiteSettingsInput): Promise<SiteSettings> {
  const current = await getSettings();
  const supabase = await createServerSupabaseClient();
  const { data: updated, error } = await supabase
    .from("site_settings")
    .update(data)
    .eq("id", current.id)
    .select("*")
    .single();

  throwOnError(error, "Failed to update settings");
  return updated;
}
