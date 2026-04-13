create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  long_description text not null,
  tags text[] not null default '{}',
  category text not null,
  image_url text,
  live_url text,
  github_url text,
  featured boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text not null,
  skills text[] not null default '{}',
  photo_url text,
  order_index integer not null default 0
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_role text not null,
  author_company text not null,
  featured boolean not null default false
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  seo_title text not null,
  seo_description text not null,
  seo_keywords text[] not null default '{}',
  author_name text not null,
  reading_time_minutes integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  contact_email text not null,
  whatsapp_number text not null,
  facebook_url text not null,
  instagram_url text not null,
  linkedin_url text not null,
  hero_headline_line1 text not null,
  hero_headline_line2 text not null,
  hero_subheading text not null
);

insert into site_settings (
  contact_email,
  whatsapp_number,
  facebook_url,
  instagram_url,
  linkedin_url,
  hero_headline_line1,
  hero_headline_line2,
  hero_subheading
)
select
  'hello@xcler.dev',
  '',
  '',
  '',
  '',
  'We build',
  'digital things',
  'that work.'
where not exists (select 1 from site_settings);

alter table projects enable row level security;
alter table team_members enable row level security;
alter table testimonials enable row level security;
alter table blog_posts enable row level security;
alter table site_settings enable row level security;

create policy "authenticated full access projects" on projects
for all to authenticated using (true) with check (true);

create policy "authenticated full access team_members" on team_members
for all to authenticated using (true) with check (true);

create policy "authenticated full access testimonials" on testimonials
for all to authenticated using (true) with check (true);

create policy "authenticated full access blog_posts" on blog_posts
for all to authenticated using (true) with check (true);

create policy "authenticated full access site_settings" on site_settings
for all to authenticated using (true) with check (true);

create policy "public read projects" on projects
for select to anon using (true);

create policy "public read team_members" on team_members
for select to anon using (true);

create policy "public read testimonials" on testimonials
for select to anon using (true);

create policy "public read published blog_posts" on blog_posts
for select to anon using (published = true);
