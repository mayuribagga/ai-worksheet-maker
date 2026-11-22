import type { ResourceKind } from "@/data/resource-kinds";

// Worksheets are designed for one of four age groups. Each group sets how
// long and how hard a worksheet is, how it reads and how it looks, based on
// what Ontario classrooms (and the worksheets Mayuri uses) expect at that age.

export type GradeBand = "early" | "primary" | "junior" | "intermediate";

export function gradeBand(grade: number): GradeBand {
  if (grade <= 2) return "early";
  if (grade === 3) return "primary";
  if (grade <= 6) return "junior";
  return "intermediate";
}

type Range = [number, number];

export type BandProfile = {
  label: string;
  // Who's reading, so Claude pictures the right student.
  reader: string;
  language: string;
  instructions: string;
  thinking: string;
  design: string;
  // Question count and total marks for each kind of resource.
  size: Record<ResourceKind, { questions: Range; marks: Range }>;
  // Words in a reading passage, from shortest to longest.
  passageWords: Range;
  // Most answer lines for a single written answer.
  maxLines: number;
  // Question types that suit the age group.
  questionTypes: string;
};

export const bandProfiles: Record<GradeBand, BandProfile> = {
  early: {
    label: "Grades 1 and 2",
    reader: "a 6- or 7-year-old who is just learning to read and write, often working with an adult nearby",
    language:
      "Very short sentences (5 to 10 words) with everyday words a young child can sound out or recognize. One idea per sentence. No abstract words, idioms or long numbers written in words.",
    instructions:
      "One short action per instruction, starting with a verb a child knows: Count, Circle, Colour, Draw, Write, Match, Trace. Say exactly how many (\"Circle the 3 biggest…\").",
    thinking:
      "Mostly recognizing, counting, naming and comparing, with concrete objects. One simple 'tell how you know' question at most. Everything is about things a child can see or touch.",
    design:
      "Big, friendly and uncrowded. Use pictures and drawings in most questions (picture groups to count, ten-frames, number lines, shapes, clocks, picture cards). Prefer the 'cards' layout for practice sections so each task sits in its own box. Fill-in answers are single words or numbers. No long answers.",
    size: {
      worksheet: { questions: [6, 10], marks: [8, 14] },
      practice: { questions: [8, 12], marks: [8, 14] },
      quiz: { questions: [6, 8], marks: [6, 10] },
      test: { questions: [10, 14], marks: [14, 22] },
      notes: { questions: [3, 5], marks: [3, 6] },
      reading: { questions: [5, 7], marks: [6, 10] },
    },
    passageWords: [60, 130],
    maxLines: 2,
    questionTypes:
      "fill-in-the-blank (one word or number), multiple-choice with 3 short choices, true-false, matching with pictures, short-answer with 1 or 2 lines, show-your-work for simple sums",
  },
  primary: {
    label: "Grade 3",
    reader: "an 8-year-old who reads independently but still benefits from pictures and clear structure",
    language:
      "Short, clear sentences (8 to 14 words) and familiar vocabulary. Introduce at most a few subject words, and explain each one in context.",
    instructions: "Clear numbered steps in plain words. Bold-face isn't available, so put the key action first.",
    thinking:
      "Recall and understanding, plus simple application: solve a one- or two-step problem, sort, compare, explain in one or two sentences.",
    design:
      "Friendly and organized, like a 'morning work' page: some sections can use the 'cards' layout with short mixed tasks in boxes. Include drawings where they help (number lines, fraction models, bar graphs, clocks, grid maps, picture cards).",
    size: {
      worksheet: { questions: [8, 12], marks: [12, 20] },
      practice: { questions: [10, 15], marks: [12, 20] },
      quiz: { questions: [6, 10], marks: [10, 16] },
      test: { questions: [12, 16], marks: [20, 30] },
      notes: { questions: [4, 5], marks: [4, 8] },
      reading: { questions: [6, 8], marks: [10, 16] },
    },
    passageWords: [150, 250],
    maxLines: 4,
    questionTypes: "all types; long answers are short paragraphs of at most 5 lines",
  },
  junior: {
    label: "Grades 4 to 6",
    reader: "a 9- to 11-year-old who can read longer texts and write a full paragraph",
    language:
      "Clear, varied sentences and grade-level subject vocabulary. Define new terms the first time they appear.",
    instructions: "Specific and complete, including what a full answer needs (\"Use two details from the text\").",
    thinking:
      "A balance of knowledge, application and thinking: multi-step problems, comparing, explaining reasons, making inferences, supporting answers with evidence.",
    design:
      "Clean and organized with clear sections. Use tables, graphs, number lines, fraction models, maps and diagrams where they carry real information. Mostly 'list' layout.",
    size: {
      worksheet: { questions: [10, 15], marks: [20, 30] },
      practice: { questions: [14, 20], marks: [18, 28] },
      quiz: { questions: [8, 12], marks: [15, 25] },
      test: { questions: [14, 20], marks: [30, 45] },
      notes: { questions: [4, 6], marks: [6, 10] },
      reading: { questions: [7, 10], marks: [15, 25] },
    },
    passageWords: [250, 400],
    maxLines: 8,
    questionTypes: "all types",
  },
  intermediate: {
    label: "Grades 7 and 8",
    reader: "a 12- or 13-year-old preparing for high school, able to analyze sources and write structured arguments",
    language:
      "Academic, precise language and full subject vocabulary. Sentences can be longer and more complex, but stay clear.",
    instructions: "Concise and academic, with success criteria for written answers (\"Take a position and support it with two pieces of evidence\").",
    thinking:
      "Mostly application, analysis and evaluation: multi-step and non-routine problems, interpreting data, comparing perspectives, judging significance, justifying conclusions. Keep a few recall questions as a warm-up.",
    design:
      "Clean, academic and text-forward, like a high-school handout: clear sections, data tables, sources and graphs that students must analyze. 'list' layout. Pictures only where they carry information.",
    size: {
      worksheet: { questions: [10, 15], marks: [25, 40] },
      practice: { questions: [14, 20], marks: [20, 35] },
      quiz: { questions: [8, 12], marks: [20, 30] },
      test: { questions: [14, 20], marks: [35, 50] },
      notes: { questions: [4, 6], marks: [8, 12] },
      reading: { questions: [7, 10], marks: [20, 30] },
    },
    passageWords: [400, 550],
    maxLines: 14,
    questionTypes: "all types, with several longer written responses",
  },
};
