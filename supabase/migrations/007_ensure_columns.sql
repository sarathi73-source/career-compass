-- ============================================================
-- Migration 007: Ensure all required columns exist
-- Safe to re-run — uses ADD COLUMN IF NOT EXISTS everywhere.
-- Run this in Supabase SQL Editor if results fail to load.
-- ============================================================

-- assessments: started_at / completed_at (added by 003)
alter table public.assessments
  add column if not exists started_at  timestamptz default now(),
  add column if not exists completed_at timestamptz;

-- assessment_responses: question_id / answer_value (added by 003)
-- These replace the original question_index / answer columns.
alter table public.assessment_responses
  add column if not exists question_id  text,
  add column if not exists answer_value text;

-- Copy old integer-index data if any exists
update public.assessment_responses
  set question_id  = question_index::text,
      answer_value = answer
  where question_id is null
    and question_index is not null;

-- Unique constraint on (assessment_id, question_id)
alter table public.assessment_responses
  drop constraint if exists assessment_responses_assessment_id_question_index_key;

alter table public.assessment_responses
  add constraint if not exists assessment_responses_assessment_id_question_id_key
  unique (assessment_id, question_id);

-- results: recommended_stream (added by 003)
alter table public.results
  add column if not exists recommended_stream text;

-- results: reasoning (in original schema but double-check)
alter table public.results
  add column if not exists reasoning text;

-- results: attempt_number (added by 004)
alter table public.results
  add column if not exists attempt_number int not null default 1;

-- profiles: language_preference (used by the app)
alter table public.profiles
  add column if not exists language_preference text;

-- Backfill recommended_stream from stream for any existing rows
update public.results
  set recommended_stream = stream
  where recommended_stream is null;

-- Done.
-- After running this, reload the Results page and it should work.
