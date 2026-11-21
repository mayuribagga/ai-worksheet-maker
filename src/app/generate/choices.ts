import { findTopic, grades, subjectsForGrade, type SubjectId } from "@/data/curriculum";
import { isResourceKind, kindsFor, type ResourceKind } from "@/data/resource-kinds";

// What the worksheet maker's form has selected.
export type FormChoices = {
  grade: number;
  subject: SubjectId;
  topicId: string;
  kind: ResourceKind;
  focus: string;
};

export const defaultChoices: FormChoices = { grade: 4, subject: "math", topicId: "", kind: "worksheet", focus: "" };

// Turns ?grade=4&subject=math&topic=fractions&kind=quiz into form choices,
// ignoring anything that isn't a real grade, subject, topic or kind.
export function choicesFrom(params: Record<string, string | string[] | undefined>): FormChoices {
  const value = (key: string) => (typeof params[key] === "string" ? params[key] : "");
  let grade = Number(value("grade"));
  let subject = value("subject") as SubjectId;

  // Fill in what's missing: a subject alone starts at its first grade, and a
  // grade alone starts with its first subject.
  if (!grades.includes(grade)) {
    grade = grades.find((g) => subjectsForGrade(g).includes(subject)) ?? 0;
  }
  if (!grade) return defaultChoices;
  if (!subjectsForGrade(grade).includes(subject)) {
    subject = subjectsForGrade(grade)[0];
  }

  const topic = findTopic(grade, subject, value("topic"));
  const kind = value("kind");
  return {
    grade,
    subject,
    topicId: topic?.id ?? "",
    kind: isResourceKind(kind) && kindsFor(subject).includes(kind) ? kind : "worksheet",
    focus: topic?.subtopics.includes(value("focus")) ? value("focus") : "",
  };
}
