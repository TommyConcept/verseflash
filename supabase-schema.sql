-- VerseFlash Database Schema
-- Run this in your Supabase SQL Editor

-- ─── Enable UUID extension ────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null unique references auth.users(id) on delete cascade,
  full_name          text,
  email              text,
  preferred_version  text not null default 'NKJV',
  preferred_language text not null default 'English',
  plan               text not null default 'free' check (plan in ('free', 'premium')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ─── Verse Detections ─────────────────────────────────────────────────────────
create table if not exists public.verse_detections (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  book               text not null,
  chapter            integer not null,
  verse_start        integer,
  verse_end          integer,
  version            text not null default 'KJV',
  language           text not null default 'English',
  detected_reference text not null,
  raw_transcript     text,
  confidence         numeric(4,3) default 0,
  created_at         timestamptz not null default now()
);

-- ─── Saved Verses ─────────────────────────────────────────────────────────────
create table if not exists public.saved_verses (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  book        text not null,
  chapter     integer not null,
  verse_start integer,
  verse_end   integer,
  version     text not null default 'KJV',
  language    text not null default 'English',
  verse_text  text not null,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists idx_verse_detections_user_id on public.verse_detections(user_id);
create index if not exists idx_verse_detections_created_at on public.verse_detections(created_at desc);
create index if not exists idx_saved_verses_user_id on public.saved_verses(user_id);
create index if not exists idx_saved_verses_created_at on public.saved_verses(created_at desc);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.verse_detections enable row level security;
alter table public.saved_verses enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Verse detections policies
create policy "Users can view own detections"
  on public.verse_detections for select
  using (auth.uid() = user_id);

create policy "Users can insert own detections"
  on public.verse_detections for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own detections"
  on public.verse_detections for delete
  using (auth.uid() = user_id);

-- Saved verses policies
create policy "Users can view own saved verses"
  on public.saved_verses for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved verses"
  on public.saved_verses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own saved verses"
  on public.saved_verses for update
  using (auth.uid() = user_id);

create policy "Users can delete own saved verses"
  on public.saved_verses for delete
  using (auth.uid() = user_id);

-- ─── Auto-create profile on signup ───────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
