// Every subject the site knows about.
// "history-geography" is no longer offered: Grades 7 and 8 now have History
// and Geography as separate subjects. It stays here so worksheets saved
// before the split still show the right name.
export type SubjectId =
  | "math"
  | "french"
  | "french-immersion"
  | "social-studies"
  | "history"
  | "geography"
  | "science"
  | "history-geography";

export const subjectNames: Record<SubjectId, string> = {
  math: "Mathematics",
  french: "Core French",
  "french-immersion": "French Immersion",
  "social-studies": "Social Studies",
  history: "History",
  geography: "Geography",
  science: "Science and Technology",
  "history-geography": "History and Geography",
};

// The six subjects in the resource library, in the order they're shown.
export const librarySubjects: SubjectId[] = [
  "math",
  "french",
  "french-immersion",
  "social-studies",
  "history",
  "geography",
];

// Subjects you can make worksheets for. Science isn't part of the library,
// but the worksheet maker has offered it from the start, so it stays.
export const worksheetSubjects: SubjectId[] = [...librarySubjects, "science"];

export const grades = [1, 2, 3, 4, 5, 6, 7, 8];

// One sentence about each library subject, for subject cards.
export const subjectBlurbs: Partial<Record<SubjectId, string>> = {
  math: "Number, algebra, data, spatial sense and financial literacy, from the 2020 Ontario math curriculum.",
  french: "Vocabulary, grammar, reading and writing for students learning French a little each day.",
  "french-immersion": "Grammaire, lecture, écriture et communication orale, entièrement en français.",
  "social-studies": "Heritage and identity, and people and environments, in Grades 1 to 6.",
  history: "New France to 1914: how Canada was created and how it changed.",
  geography: "Physical patterns, natural resources, global settlement and quality of life.",
};
