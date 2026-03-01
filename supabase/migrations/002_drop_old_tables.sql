-- Drop old tables from previous project (not needed for Career Compass)
drop table if exists public."User_Career_Ma" cascade;
drop table if exists public."Users" cascade;
drop table if exists public."Assessments" cascade;
drop table if exists public."Careers" cascade;
drop table if exists public."students" cascade;

-- Also handle possible variations of the names
drop table if exists public."User_Career_Matches" cascade;
drop table if exists public.students cascade;
