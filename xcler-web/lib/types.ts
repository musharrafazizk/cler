export type Project = {
  id: string;
  title: string;
  description: string;
  url?: string;
  tags: string[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author: string;
};
