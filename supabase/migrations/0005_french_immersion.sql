-- Allow French Immersion as a worksheet subject.
-- Run after 0004 in the Supabase SQL Editor.

alter table public.worksheets
  drop constraint worksheets_subject_check,
  add constraint worksheets_subject_check check (
    subject in (
      'math',
      'french',
      'french-immersion',
      'science',
      'social-studies',
      'history-geography'
    )
  );
