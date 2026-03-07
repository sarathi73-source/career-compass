-- ============================================================
-- Migration 004: Score History / Attempt Tracking
-- Adds attempt_number to results so every retake is preserved.
-- Run in Supabase SQL Editor after 003_fix_columns.sql
-- ============================================================

-- 1. Add attempt_number column (defaults to 1 for existing rows)
alter table public.results
  add column if not exists attempt_number int not null default 1;

-- 2. Add reasoning column to store the dynamic stream reasoning text
alter table public.results
  add column if not exists reasoning text;

-- 3. Backfill attempt_number for any existing rows per student
--    (assigns sequential numbers ordered by created_at)
with numbered as (
  select id,
    row_number() over (partition by student_id order by created_at) as rn
  from public.results
)
update public.results r
  set attempt_number = n.rn
  from numbered n
  where r.id = n.id;

-- 4. Ensure students can still insert/select/update/delete their own results
--    (existing policy "Students can manage own results" already covers all,
--     so no policy changes needed)

-- Done.
-- After running this, Results.tsx will stop deleting old results and instead
-- insert a new row with attempt_number = previous_max + 1.
