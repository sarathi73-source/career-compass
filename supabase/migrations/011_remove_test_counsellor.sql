-- ============================================================
-- Migration 011: Remove hard-coded test counsellor account
-- ============================================================
-- Migration 006 hard-coded a real person's email and school
-- name. This migration removes that test data from the live DB.
-- The auth.users row must be deleted via the Supabase Dashboard
-- (Auth → Users) as the SQL Editor cannot modify auth.users.
-- ============================================================

-- Remove the profile row if it still exists.
-- (Safe to run even if the row was never created.)
DELETE FROM public.profiles
WHERE email = 'vasanthk@gmail.com';
