-- WISE Lab platform — initial schema
-- Tables: submissions, blog_posts, admin_profiles
-- Never applied to a live project in this environment (no Supabase MCP
-- auth available, no project provisioned). Run via `supabase db push` or
-- the SQL editor once a project exists. See TODO_FOR_HUMAN.md.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- admin_profiles
-- One row per admin user, keyed to auth.users. No public sign-up: rows are
-- inserted manually (SQL editor or a one-off script) once an auth user has
-- been created for a trusted team member.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

-- Admins can read their own profile (used to confirm admin status).
create policy "admin_profiles: self read"
  on public.admin_profiles for select
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- submissions
-- One row per Founder/Enterprise/Mentor/Partner application. `values` holds
-- the full raw form payload (jsonb, shape defined by the matching
-- FormSchema in src/lib/forms/schemas/); `analytics` holds the flattened
-- chartable-dimension map (src/lib/forms/submission.ts) so dashboards can
-- query one shape regardless of track.
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  track text not null check (track in ('founder', 'enterprise', 'mentor', 'partner')),
  values jsonb not null,
  analytics jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  meta jsonb not null default '{}'::jsonb
);

create index if not exists submissions_track_idx on public.submissions (track);
create index if not exists submissions_submitted_at_idx on public.submissions (submitted_at desc);
-- GIN index so admin dashboards can filter/aggregate on analytics dimensions efficiently.
create index if not exists submissions_analytics_gin_idx on public.submissions using gin (analytics);

alter table public.submissions enable row level security;

-- Public (anon) can INSERT their own application — this is how the public
-- DynamicForm on /apply/:track submits. No public SELECT/UPDATE/DELETE.
create policy "submissions: public insert"
  on public.submissions for insert
  to anon, authenticated
  with check (true);

-- Only admins can read submissions (admin dashboard).
create policy "submissions: admin read"
  on public.submissions for select
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- ---------------------------------------------------------------------------
-- blog_posts
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  author text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_published_idx
  on public.blog_posts (status, published_at desc);

alter table public.blog_posts enable row level security;

-- Anyone can read published posts (public blog list/detail pages).
create policy "blog_posts: public read published"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'published');

-- Admins can read everything, including drafts.
create policy "blog_posts: admin read all"
  on public.blog_posts for select
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- Admins can insert/update/delete.
create policy "blog_posts: admin write"
  on public.blog_posts for all
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()))
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();
