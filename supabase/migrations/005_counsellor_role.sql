-- ============================================================
-- Migration 005: Counsellor Role
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- 1. Extend the role check constraint to include 'counsellor'
--    The constraint was auto-named 'profiles_role_check'.
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('student', 'parent', 'counsellor'));

-- 2. RLS: counsellors can view student profiles from their own school.
--    (PostgREST ORs all SELECT policies, so this adds to the existing ones.)
create policy "Counsellors can view school student profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles c
      where c.id = auth.uid()
        and c.role = 'counsellor'
        and c.school_name = profiles.school_name
        and profiles.role = 'student'
    )
  );

-- 3. RLS: counsellors can view results of students from their school.
create policy "Counsellors can view school student results"
  on public.results for select
  using (
    exists (
      select 1
      from public.profiles c
      join public.profiles s on s.id = results.student_id
      where c.id = auth.uid()
        and c.role = 'counsellor'
        and c.school_name = s.school_name
    )
  );
