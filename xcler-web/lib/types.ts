export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  tags: string[];
  category: string;
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  order_index: number;
  created_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  photo_url: string | null;
  order_index: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  author_company: string;
  featured: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  author_name: string;
  reading_time_minutes: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: string;
  contact_email: string;
  whatsapp_number: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  hero_headline_line1: string;
  hero_headline_line2: string;
  hero_subheading: string;
};
