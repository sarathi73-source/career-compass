-- ============================================================
-- Migration 006: Fix counsellor profile UUID alignment
-- ============================================================
-- Problem: The profile row for vasanthk@gmail.com may have a
-- different UUID than the auth.users UUID, causing RLS to block
-- the JS client from reading its own profile (auth.uid() ≠ id).
-- ============================================================

BEGIN;

-- Step 1: Diagnostic — shows whether the IDs match.
-- Both rows in the output must show the SAME UUID value.
SELECT
  u.id                   AS auth_user_id,
  p.id                   AS profile_id,
  (u.id = p.id)          AS ids_match,
  p.role,
  p.school_name,
  p.city
FROM auth.users u
FULL OUTER JOIN public.profiles p ON p.email = u.email
WHERE u.email = 'vasanthk@gmail.com'
   OR p.email = 'vasanthk@gmail.com';

-- Step 2: Delete any orphaned profile row whose id doesn't
-- match the real auth user UUID for this email.
DELETE FROM public.profiles
WHERE email = 'vasanthk@gmail.com'
  AND id NOT IN (
    SELECT id FROM auth.users WHERE email = 'vasanthk@gmail.com'
  );

-- Step 3: Insert (or update) the correctly-linked profile row.
-- Uses auth.users.id as the primary key so RLS works correctly.
INSERT INTO public.profiles
  (id, full_name, email, role, school_name, city, updated_at)
SELECT
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    'Vasanth K'
  ),
  u.email,
  'counsellor',
  'DPS Vasanj Kunj',
  'Delhi',
  now()
FROM auth.users u
WHERE u.email = 'vasanthk@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role        = 'counsellor',
  school_name = 'DPS Vasanj Kunj',
  city        = 'Delhi',
  updated_at  = now();

COMMIT;

-- Step 4: Final verification — both IDs must now match.
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
WHERE u.email = 'vasanthk@gmail.com';
