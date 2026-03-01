-- ============================================================
-- Career Compass — Full Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  email         text,
  phone         text,
  grade         text,
  school_name   text,
  city          text,
  role          text not null default 'student' check (role in ('student', 'parent')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- ASSESSMENTS TABLE
-- ============================================================
create table if not exists public.assessments (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid not null references public.profiles(id) on delete cascade,
  type           text not null check (type in ('aptitude', 'interest', 'personality')),
  status         text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  pause_position int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique(student_id, type)
);

alter table public.assessments enable row level security;

create policy "Students can manage own assessments"
  on public.assessments for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

-- ============================================================
-- ASSESSMENT RESPONSES TABLE
-- ============================================================
create table if not exists public.assessment_responses (
  id              uuid primary key default gen_random_uuid(),
  assessment_id   uuid not null references public.assessments(id) on delete cascade,
  question_index  int not null,
  answer          text not null,
  created_at      timestamptz not null default now(),
  unique(assessment_id, question_index)
);

alter table public.assessment_responses enable row level security;

create policy "Students can manage own responses"
  on public.assessment_responses for all
  using (
    exists (
      select 1 from public.assessments a
      where a.id = assessment_responses.assessment_id
        and a.student_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.assessments a
      where a.id = assessment_responses.assessment_id
        and a.student_id = auth.uid()
    )
  );

-- ============================================================
-- RESULTS TABLE
-- ============================================================
create table if not exists public.results (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references public.profiles(id) on delete cascade,
  stream            text not null check (stream in ('Science', 'Commerce', 'Humanities')),
  science_score     numeric not null default 0,
  commerce_score    numeric not null default 0,
  humanities_score  numeric not null default 0,
  reasoning         text,
  ai_narrative      text,
  share_token       text unique default encode(gen_random_bytes(16), 'hex'),
  created_at        timestamptz not null default now()
);

alter table public.results enable row level security;

create policy "Students can manage own results"
  on public.results for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

-- Public read via share token (no auth required)
create policy "Anyone can view result by share token"
  on public.results for select
  using (share_token is not null);

-- ============================================================
-- PARENT STUDENT LINKS TABLE
-- ============================================================
create table if not exists public.parent_student_links (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references public.profiles(id) on delete cascade,
  student_id  uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(parent_id, student_id)
);

alter table public.parent_student_links enable row level security;

create policy "Parents can view own links"
  on public.parent_student_links for select
  using (auth.uid() = parent_id);

create policy "Parents can insert own links"
  on public.parent_student_links for insert
  with check (auth.uid() = parent_id);

-- Allow parents to read linked students' profiles
create policy "Parents can view linked student profiles"
  on public.profiles for select
  using (
    auth.uid() = id
    or exists (
      select 1 from public.parent_student_links psl
      where psl.parent_id = auth.uid()
        and psl.student_id = profiles.id
    )
  );

-- Allow parents to read linked students' results
create policy "Parents can view linked student results"
  on public.results for select
  using (
    auth.uid() = student_id
    or exists (
      select 1 from public.parent_student_links psl
      where psl.parent_id = auth.uid()
        and psl.student_id = results.student_id
    )
    or share_token is not null
  );
