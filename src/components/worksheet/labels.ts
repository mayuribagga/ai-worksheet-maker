import { resourceKinds, type ResourceKind } from "@/data/resource-kinds";
import type { SubjectId } from "@/data/subjects";

// Words printed on the worksheet itself. French resources get French labels,
// like the sheets students see in class.
const en = {
  name: "Name",
  date: "Date",
  total: "Total",
  marks: "marks",
  true: "True",
  false: "False",
  answer: "Answer",
  example: "Example",
  workSpace: "Space for your work",
  answerKey: "Answer key",
  curriculum: "Curriculum connection",
  pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
  seeWorksheet: "passage on the worksheet",
};

export type SheetLabels = typeof en;

const fr: SheetLabels = {
  name: "Nom",
  date: "Date",
  total: "Total",
  marks: "points",
  true: "Vrai",
  false: "Faux",
  answer: "Réponse",
  example: "Exemple",
  workSpace: "Espace pour ton travail",
  answerKey: "Corrigé",
  curriculum: "Lien avec le curriculum",
  pageOf: (page: number, total: number) => `Page ${page} sur ${total}`,
  seeWorksheet: "texte sur la fiche",
};

export function labelsFor(lang: "en" | "fr"): SheetLabels {
  return lang === "fr" ? fr : en;
}

export function sheetLanguage(subject: SubjectId): "en" | "fr" {
  return subject === "french" || subject === "french-immersion" ? "fr" : "en";
}

const frenchKindNames: Record<ResourceKind, string> = {
  worksheet: "Fiche de travail",
  practice: "Activité de pratique",
  quiz: "Quiz",
  test: "Évaluation de fin d'unité",
  notes: "Notes d'étude",
  reading: "Compréhension de lecture",
};

// The kind of resource, as printed on the sheet.
export function kindLabel(kind: ResourceKind, lang: "en" | "fr"): string {
  return lang === "fr" ? frenchKindNames[kind] : resourceKinds[kind].name;
}
