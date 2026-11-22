# Mayuri Teaches: AI Worksheet Maker

A web app that generates printable worksheets for any Ontario curriculum topic from Grades 1 to 8. Teachers, parents and tutors browse a Grades 1 to 8 resource library, pick a topic, and the app uses an LLM to write a worksheet, quiz, unit test, study notes or reading activity with an answer key, saves it to their account, and exports it as a branded PDF.

## Features

- **Resource library**: 452 topics with subtopics for Mathematics, Core French, French Immersion, Social Studies, History and Geography, organized by grade, subject and strand, with search, filters and per-topic resource pages. Science and Technology is also available in the worksheet maker.
- **Six kinds of resources**: worksheets, practice activities, quizzes, unit tests (organized by Ontario's four achievement categories), study notes and reading comprehension, all with answer keys.
- **Designed for each grade**: every request is built from a profile of the student's age group (Grades 1–2, 3, 4–6 and 7–8) covering language, instructions, thinking level, length and layout, plus subject guidance by grade (for example, Core French instructions move from English to French as grades go up). One of 20 worksheet designs is picked at random for the grade and subject, so worksheets don't all follow the same template, and the result is checked against the grade (length, passage size, written answers).
- **Drawings and pictures**: ten-frames, number lines, fraction models, bar graphs, clocks, grid maps, shapes and counting pictures are drawn by the site from the worksheet data, so they're always accurate and look the same on screen, in print and in PDFs. Younger grades get bigger type, handwriting lines, answer boxes and task cards. Pictures are [Twemoji](https://github.com/jdecked/twemoji) (CC BY 4.0).
- **Structured AI generation**: resources come back from Claude as validated JSON with seven question types (multiple choice, true or false, fill in the blank, matching, short answer, long answer, show your work) plus reading passages, data tables, rule boxes and word banks, not free text.
- **Accounts and saved worksheets**: email sign-up with password rules, and a "My worksheets" page to reopen or delete past worksheets.
- **Printable PDFs**: a Letter-size print layout with marks per question, followed by a filled-in answer key, exported with the browser's Save as PDF. French resources print with French labels.
- **Daily usage limit**: 10 worksheets per user per day, enforced in the database (switched off for now in `src/lib/limits.ts`).

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend and server | Next.js 16 (App Router, Server Actions), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Auth and database | Supabase (Postgres, Auth, row-level security) |
| AI | Claude API (`claude-haiku-5-5`) with tool use for structured output |
| Validation | Zod |

## How it works

1. The user picks a grade, subject, topic and kind of resource, often straight from a library topic page. The server checks the choice against the curriculum data, since form values can be changed in the browser.
2. A Postgres function counts the request against the user's daily limit. The limit lives in the database, so it can't be bypassed from the client, and the check-and-increment happens in one statement so simultaneous requests can't both slip through.
3. The server calls Claude with a `save_worksheet` tool whose input schema is generated from a Zod schema, and forces Claude to use that tool. A style guide in the system prompt, based on a review of real classroom worksheets, sets the quality bar, with extra guidance per subject. The reply is validated (schema, blank counts, unique choices and matches, table shapes, and what each kind of resource needs). If it fails, the problem is sent back to Claude as a tool error so it can fix it once.
4. The worksheet is saved as JSON in Postgres. Row-level security policies make sure users can only read or delete their own worksheets.

### Project structure

```
src/
  app/            Pages, server actions and route handlers
    library/      Grade, subject and topic pages
    generate/     Topic picker and worksheet generation
    worksheets/   Saved worksheets, detail view and print layout
    login/        Sign in, sign up and sign out
  components/     Shared UI (header, worksheet views, forms)
  data/           Curriculum library (one file per subject), resource kinds, samples
  lib/            Supabase clients, worksheet schema, branding
  proxy.ts        Refreshes sessions and redirects by sign-in status
supabase/
  migrations/     Database tables, security policies and functions
```

## Running it locally

**Requirements:** Node.js 22 or newer, a free [Supabase](https://supabase.com) project, and a Claude API key from [platform.claude.com](https://platform.claude.com).

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your Supabase URL, Supabase publishable key and Claude API key.
3. In the Supabase SQL Editor, run the files in `supabase/migrations/` in order.
4. In Supabase, go to **Authentication → URL Configuration** and add `http://localhost:3000/**` as a redirect URL.
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npm test           # unit tests (Vitest)
npm run lint       # ESLint
npm run typecheck  # TypeScript
```

The tests cover worksheet validation (including the checks that catch Claude's mistakes), the curriculum data, links into the worksheet maker, the TPT cover lookup, the prompt sent to Claude and PDF generation. GitHub Actions runs all three checks on every push.

## Roadmap

- Evaluation pipeline: automatically check answer correctness (SymPy for math) and track quality across prompt and model changes
- Question difficulty classifier: TF-IDF baseline compared with a fine-tuned DistilBERT model
- Curriculum retrieval (RAG) with embeddings in pgvector
- A fine-tuned open model for math worksheets, compared with Claude on accuracy and cost
