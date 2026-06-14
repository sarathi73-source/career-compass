-- ============================================================
-- Migration 010: Add stream_preference column to profiles
-- Run this in Supabase SQL Editor
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stream_preference text
  CHECK (stream_preference IN ('Science', 'Commerce', 'Humanities', 'not_sure'));
