-- ============================================================
-- Migration 009: Admin role support
-- Safe to re-run — uses IF NOT EXISTS / OR REPLACE guards.
-- ============================================================

-- 1. Expand the role CHECK constraint to include 'admin'
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('student', 'parent', 'counsellor', 'admin'));

-- 2. Security-definer helper: checks whether the calling user is admin.
--    SECURITY DEFINER runs as the function owner (bypasses RLS) so it
--    avoids the infinite-recursion problem that plagued counsellor policies.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 3. Admin can read all profiles
drop policy if exists "Admin can read all profiles" on public.profiles;
create policy "Admin can read all profiles"
  on public.profiles for select
  using (public.is_admin());

-- 4. Admin can read all results
drop policy if exists "Admin can read all results" on public.results;
create policy "Admin can read all results"
  on public.results for select
  using (public.is_admin());

-- 5. Admin can read all assessments
drop policy if exists "Admin can read all assessments" on public.assessments;
create policy "Admin can read all assessments"
  on public.assessments for select
  using (public.is_admin());

-- Done.
-- To create an admin user, run in SQL Editor:
--   UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
