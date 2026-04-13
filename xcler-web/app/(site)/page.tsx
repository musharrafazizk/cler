import HomePageClient from "@/components/site/HomePageClient";
import { getProjects, getTeamMembers, getTestimonials } from "@/lib/db";
import { buildPageMetadata } from "@/lib/metadata";
import type { Project, TeamMember, Testimonial } from "@/lib/types";

type HomeProject = {
  name: string;
  tags: string;
  description: string;
  imageUrl?: string | null;
};

type HomeTeam = {
  name: string;
  role: string;
  initials: string;
  skills: string[];
  photoUrl?: string | null;
};

type HomeTestimonial = {
  quote: string;
  author: string;
};

const fallbackProjects: HomeProject[] = [
  {
    name: "green-navigator",
    tags: "B2B SaaS · Carbon reporting · Gemini OCR",
    description: "Carbon intelligence platform with OCR-assisted reporting workflows.",
  },
  {
    name: "AegisFlow",
    tags: "FinTech SaaS · LSTM forecasting · Pakistani market",
    description: "Forecasting and decision support product tailored for local financial operators.",
  },
  {
    name: "visa-path",
    tags: "B2C SaaS · Visa strategy · Digital nomads",
    description: "Guided visa planning experience for individuals building global mobility plans.",
  },
];

const fallbackTeam: HomeTeam[] = [
  {
    name: "Musharraf Aziz",
    role: "Workflow Automation & AI Systems",
    initials: "MA",
    skills: ["n8n", "Make.com", "LLMs"],
  },
  {
    name: "Abeel Mehr",
    role: "Full Stack (Next.js, Python, APIs)",
    initials: "AM",
    skills: ["Next.js", "Python", "APIs"],
  },
  {
    name: "Mehru Seemab",
    role: "CMS & E-commerce (WordPress, Shopify)",
    initials: "MS",
    skills: ["WordPress", "Shopify", "UX"],
  },
];

const fallbackTestimonials: HomeTestimonial[] = [
  {
    quote:
      "Working with Xcler felt different from day one. Fast, clear, and they delivered exactly what we needed.",
    author: "Local Business Owner, Lahore",
  },
  {
    quote:
      "Our automation pipeline went live in 3 days. I couldn't believe how quickly they moved.",
    author: "E-commerce Founder",
  },
  {
    quote: "Best decision we made was switching our dev work to this team.",
    author: "Healthcare Startup",
  },
];

const toHomeProject = (item: Project): HomeProject => ({
  name: item.title,
  tags: item.tags.join(" · "),
  description: item.description,
  imageUrl: item.image_url,
});

const toHomeTeam = (item: TeamMember): HomeTeam => ({
  name: item.name,
  role: item.role,
  initials: item.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join(""),
  skills: item.skills,
  photoUrl: item.photo_url,
});

const toHomeTestimonial = (item: Testimonial): HomeTestimonial => ({
  quote: item.quote,
  author: [item.author_name, item.author_role, item.author_company].filter(Boolean).join(", "),
});

export default async function HomePage() {
  let projects = fallbackProjects;
  let team = fallbackTeam;
  let testimonials = fallbackTestimonials;

  try {
    const [projectRows, teamRows, testimonialRows] = await Promise.all([
      getProjects(),
      getTeamMembers(),
      getTestimonials(),
    ]);

    const featuredProjects = projectRows.filter((item) => item.featured).slice(0, 3);
    if (featuredProjects.length) {
      projects = featuredProjects.map(toHomeProject);
    }

    if (teamRows.length) {
      team = teamRows.sort((a, b) => a.order_index - b.order_index).map(toHomeTeam);
    }

    const featuredTestimonials = testimonialRows.filter((item) => item.featured);
    if (featuredTestimonials.length) {
      testimonials = featuredTestimonials.map(toHomeTestimonial);
    }
  } catch {
    // fallback data is used when Supabase is unavailable or empty
  }

  return <HomePageClient projects={projects} team={team} testimonials={testimonials} />;
}

export const metadata = buildPageMetadata({
  title: "Xcler — Web Development, App Development & Automation Agency",
  description:
    "Xcler is a digital agency specializing in web development, app development, workflow automation, AI agents, WordPress, and Shopify.",
  path: "/",
});
