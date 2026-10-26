-- Switch worksheets to Kindergarten to Grade 8 and the four starting subjects.
-- Run after 0001 in the Supabase SQL Editor.

-- Grade 0 means Kindergarten.
alter table public.worksheets
  drop constraint worksheets_grade_check,
  add constraint worksheets_grade_check check (grade between 0 and 8);

-- Elementary grades are organized by subject, not course code.
alter table public.worksheets
  rename column course_code to subject;

alter table public.worksheets
  add constraint worksheets_subject_check check (
    subject in ('math', 'french', 'science', 'social-studies', 'history-geography')
  );
