-- Fix assessments table: add started_at and completed_at columns
alter table public.assessments
  add column if not exists started_at timestamptz default now(),
  add column if not exists completed_at timestamptz;

-- Fix assessment_responses table: add question_id and answer_value columns
-- (code uses question_id/answer_value, schema had question_index/answer)
alter table public.assessment_responses
  add column if not exists question_id text,
  add column if not exists answer_value text;

-- Copy data if any exists (just in case)
update public.assessment_responses
  set question_id = question_index::text, answer_value = answer
  where question_id is null;

-- Drop old unique constraint and add new one
alter table public.assessment_responses
  drop constraint if exists assessment_responses_assessment_id_question_index_key;

alter table public.assessment_responses
  add constraint if not exists assessment_responses_assessment_id_question_id_key
  unique (assessment_id, question_id);

-- Fix results table: add recommended_stream column (code uses this name)
alter table public.results
  add column if not exists recommended_stream text;

-- Copy stream -> recommended_stream
update public.results set recommended_stream = stream where recommended_stream is null;
