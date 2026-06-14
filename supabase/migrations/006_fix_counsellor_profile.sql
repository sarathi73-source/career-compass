-- ============================================================
-- Migration 006: Fix counsellor profile UUID alignment
-- ============================================================
-- Problem: The profile row for the test counsellor account may
-- have a different UUID than the auth.users UUID, causing RLS
-- to block the JS client from reading its own profile
-- (auth.uid() ≠ id).
-- NOTE: Real email/name redacted from this file.
--       Migration 011 removes the test account from the DB.
-- ============================================================

BEGIN;

-- Step 1: Diagnostic — shows whether the IDs match.
SELECT
  u.id                   AS auth_user_id,
  p.id                   AS profile_id,
  (u.id = p.id)          AS ids_match,
  p.role,
  p.school_name,
  p.city
FROM auth.users u
FULL OUTER JOIN public.profiles p ON p.email = u.email
WHERE u.email = 'test-counsellor@example.com'
   OR p.email = 'test-counsellor@example.com';

-- Step 2: Delete any orphaned profile row.
DELETE FROM public.profiles
WHERE email = 'test-counsellor@example.com'
  AND id NOT IN (
    SELECT id FROM auth.users WHERE email = 'test-counsellor@example.com'
  );

-- Step 3: Insert (or update) the correctly-linked profile row.
INSERT INTO public.profiles
  (id, full_name, email, role, school_name, city, updated_at)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Test Counsellor'),
  u.email,
  'counsellor',
  'Test School',
  'Delhi',
  now()
FROM auth.users u
WHERE u.email = 'test-counsellor@example.com'
ON CONFLICT (id) DO UPDATE SET
  role        = 'counsellor',
  school_name = 'Test School',
  city        = 'Delhi',
  updated_at  = now();

COMMIT;

-- Step 4: Final verification.
SELECT
  u.id                   AS auth_user_id,
  p.id                   AS profile_id,
  (u.id = p.id)          AS ids_match,
  p.role,
  p.school_name,
  p.city,
  p.full_name
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'test-counsellor@example.com';
