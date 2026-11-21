-- Grades 7 and 8 now have History and Geography as separate subjects,
-- like the Ontario curriculum. 'history-geography' stays allowed so
-- worksheets saved before the split are still valid.
-- Run after 0005 in the Supabase SQL Editor.

alter table public.worksheets
  drop constraint worksheets_subject_check,
  add constraint worksheets_subject_check check (
    subject in (
      'math',
      'french',
      'french-immersion',
      'science',
      'social-studies',
      'history',
      'geography',
      'history-geography'
    )
  );
