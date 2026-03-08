-- ============================================================
-- Migration 008: Drop counsellor RLS policies
-- These were added by migration 005 (Phase D — now removed).
--
-- ROOT CAUSE:
--   "Counsellors can view school student profiles" is a SELECT
--   policy on public.profiles that contains a sub-SELECT from
--   public.profiles itself.  PostgreSQL detects this as infinite
--   recursion and raises:
--     ERROR: infinite recursion detected in policy for relation "profiles"
--
--   This error is returned (silently swallowed by the JS client)
--   for EVERY profiles query, which is why:
--     • fetchProfile() always fails → profile stays null → "User" in navbar
--     • results INSERT+SELECT also fails → "Error loading results"
--
--   "Counsellors can view school student results" has a sub-SELECT
--   on profiles inside a results policy, which triggers the same
--   profiles RLS recursion.
--
-- FIX: Drop both counsellor policies.
--      Phase D has been removed from the app; these are no longer needed.
-- ============================================================

-- Drop the self-referential policy on profiles (ROOT CAUSE of infinite recursion)
DROP POLICY IF EXISTS "Counsellors can view school student profiles" ON public.profiles;

-- Drop the results policy that also triggers the profiles recursion
DROP POLICY IF EXISTS "Counsellors can view school student results" ON public.results;

-- Done.
-- After running this:
--   1. fetchProfile() will succeed → navbar will show the correct name
--   2. Results page INSERT + SELECT will succeed → results will load
-- ============================================================
