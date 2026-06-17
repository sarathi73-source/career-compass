-- ============================================================
-- Migration 012: Add indexes on foreign key columns
-- ============================================================
-- All five user-data tables lack indexes on FK columns that are
-- heavily filtered in routine queries. These indexes reduce query
-- time from O(n) full-table scans to O(log n) at scale.
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_assessments_student_id
  ON public.assessments(student_id);

CREATE INDEX IF NOT EXISTS idx_assessment_responses_assessment_id
  ON public.assessment_responses(assessment_id);

CREATE INDEX IF NOT EXISTS idx_results_student_id
  ON public.results(student_id);

CREATE INDEX IF NOT EXISTS idx_parent_student_links_student_id
  ON public.parent_student_links(student_id);

CREATE INDEX IF NOT EXISTS idx_parent_student_links_parent_id
  ON public.parent_student_links(parent_id);
