-- Enable necessary extensions
create extension if not exists "vector" with schema "public";

-- Skills table
create table if not exists "public"."skills" (
  "id" text primary key,
  "name" text not null,
  "description" text not null,
  "level" text not null check (level in ('beginner', 'intermediate', 'advanced', 'master')),
  "category" text not null check (category in ('combat', 'strategy', 'wisdom', 'technique')),
  "icon" text not null,
  "required_points" integer not null default 100,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Skills progress
create table if not exists "public"."user_skills" (
  "id" uuid default gen_random_uuid() primary key,
  "user_id" uuid references auth.users not null,
  "skill_id" text references public.skills not null,
  "current_points" integer not null default 0,
  "is_active" boolean not null default true,
  "last_activity" timestamp with time zone default timezone('utc'::text, now()),
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  unique ("user_id", "skill_id")
);

-- Skill embeddings for RAG
create table if not exists "public"."skill_embeddings" (
  "id" uuid default gen_random_uuid() primary key,
  "skill_id" text references public.skills not null,
  "content" text not null,
  "embedding" vector(1536),
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable row level security
alter table "public"."skills" enable row level security;
alter table "public"."user_skills" enable row level security;
alter table "public"."skill_embeddings" enable row level security;

-- Set up RLS policies
create policy "Skills are viewable by everyone"
  on "public"."skills"
  for select
  to authenticated
  using (true);

create policy "Users can view own skills progress"
  on "public"."user_skills"
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update own skills progress"
  on "public"."user_skills"
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can modify own skills progress"
  on "public"."user_skills"
  for update
  to authenticated
  using (auth.uid() = user_id);

-- Enable realtime subscriptions
alter publication supabase_realtime add table "public"."user_skills";

-- Insert initial skill data
insert into "public"."skills" (id, name, description, level, category, icon, required_points)
values
  ('rag_mastery', 'RAG Mastery', 'Advanced knowledge retrieval and generation capabilities powered by vector embeddings and LLM integration', 'advanced', 'technique', '🧠', 100),
  ('katana_basics', 'Katana Basics', 'Master the fundamental techniques of wielding a katana with precision and respect', 'beginner', 'combat', '⚔️', 50),
  ('zen_meditation', 'Zen Meditation', 'Develop mental clarity and focus through traditional meditation practices', 'intermediate', 'wisdom', '🧘', 75)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  level = excluded.level,
  category = excluded.category,
  icon = excluded.icon,
  required_points = excluded.required_points; 