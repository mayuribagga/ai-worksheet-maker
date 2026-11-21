// Everything the site knows about the Ontario curriculum, in one place:
// the library's grades, subjects and topics, plus Science for the
// worksheet maker. Pages and components should import from here.
import { slugify, type Course, type Topic } from "./library/build";
import { libraryCourses } from "./library";
import { findLegacyTopic, scienceTopics } from "./legacy-topics";
import { librarySubjects, subjectNames, worksheetSubjects, type SubjectId } from "./subjects";

export type { Course, Strand, Topic } from "./library/build";
export {
  grades,
  librarySubjects,
  subjectBlurbs,
  subjectNames,
  worksheetSubjects,
  type SubjectId,
} from "./subjects";

// Science keeps the topic ids it has always had, since saved worksheets use them.
const scienceCourses: Course[] = scienceTopics.map((entry) => {
  const strandNames = [...new Set(entry.topics.map((t) => t.strand))];
  return {
    grade: entry.grade,
    subject: "science",
    strands: strandNames.map((name) => ({
      name,
      topics: entry.topics.filter((t) => t.strand === name).map((t) => ({ ...t, subtopics: [] })),
    })),
  };
});

const allCourses = [...libraryCourses, ...scienceCourses];

export function isLibrarySubject(subject: string): subject is SubjectId {
  return librarySubjects.includes(subject as SubjectId);
}

export function courseFor(grade: number, subject: string): Course | undefined {
  return allCourses.find((c) => c.grade === grade && c.subject === subject);
}

// The subjects offered in a grade: library subjects only, or every subject
// the worksheet maker can do.
export function subjectsForGrade(grade: number, scope: "library" | "worksheets" = "worksheets"): SubjectId[] {
  const subjects = scope === "library" ? librarySubjects : worksheetSubjects;
  return subjects.filter((subject) => courseFor(grade, subject));
}

export function topicsFor(grade: number, subject: string): Topic[] {
  return courseFor(grade, subject)?.strands.flatMap((s) => s.topics) ?? [];
}

export function findTopic(grade: number, subject: string, topicId: string): Topic | undefined {
  return topicsFor(grade, subject).find((topic) => topic.id === topicId);
}

export type TopicDescription = {
  gradeLabel: string;
  subjectName: string;
  topicName: string;
  strand?: string;
};

// The parts of a topic's description, for showing as separate labels.
// Falls back to the old topic lists for worksheets saved before the library.
export function describeTopic(grade: number, subject: string, topicId: string): TopicDescription {
  const topic = findTopic(grade, subject, topicId) ?? findLegacyTopic(grade, subject, topicId);
  return {
    gradeLabel: grade === 0 ? "Kindergarten" : `Grade ${grade}`,
    subjectName: subjectNames[subject as SubjectId] ?? subject,
    topicName: topic?.name ?? topicId,
    strand: topic?.strand,
  };
}

export type SubjectSummary = {
  subject: SubjectId;
  firstGrade: number;
  lastGrade: number;
  topicCount: number;
};

// For each subject: which grades it covers and how many topics it has.
export function subjectSummaries(scope: "library" | "worksheets" = "worksheets"): SubjectSummary[] {
  const subjects = scope === "library" ? librarySubjects : worksheetSubjects;
  return subjects.map((subject) => {
    const courses = allCourses.filter((c) => c.subject === subject);
    const gradeList = courses.map((c) => c.grade);
    return {
      subject,
      firstGrade: Math.min(...gradeList),
      lastGrade: Math.max(...gradeList),
      topicCount: courses.reduce((sum, c) => sum + c.strands.reduce((n, s) => n + s.topics.length, 0), 0),
    };
  });
}

export function totalTopicCount(scope: "library" | "worksheets" = "worksheets"): number {
  return subjectSummaries(scope).reduce((sum, s) => sum + s.topicCount, 0);
}

export { generateHref, libraryHref, parseGradeSlug } from "./links";
export { slugify };

// One row per library topic, for searching.
export type SearchEntry = {
  grade: number;
  subject: SubjectId;
  id: string;
  name: string;
  strand: string;
  subtopics: string[];
};

export function librarySearchIndex(): SearchEntry[] {
  return libraryCourses.flatMap((c) =>
    c.strands.flatMap((s) =>
      s.topics.map((t) => ({
        grade: c.grade,
        subject: c.subject,
        id: t.id,
        name: t.name,
        strand: s.name,
        subtopics: t.subtopics,
      })),
    ),
  );
}

// The topics before and after one topic in its grade and subject, for
// "previous" and "next" links.
export function neighbours(grade: number, subject: string, topicId: string) {
  const list = topicsFor(grade, subject);
  const i = list.findIndex((t) => t.id === topicId);
  return { previous: i > 0 ? list[i - 1] : undefined, next: i >= 0 ? list[i + 1] : undefined };
}
