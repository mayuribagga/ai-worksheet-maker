// Mayuri's lessons and activities on Teachers Pay Teachers.
// Cover pictures load automatically from each TPT page. To use a different
// picture for a product, put it in public/resources/ and set `image`
// (e.g. image: "/resources/grade-8-diagnostic.png").
// To add a product, add its title, format and TPT link to a group below.
// To show a product in the resource library, add `fits`: the grades and
// subject it's for, and optionally the library topic ids it matches.

import type { SubjectId } from "./subjects";

export type ResourceFit = { grade: number; subject: SubjectId; topicIds?: string[] };

export type Resource = {
  title: string;
  description?: string;
  format: string;
  url: string;
  image?: string;
  fits?: ResourceFit[];
};

export type ResourceGroup = {
  id: string;
  name: string;
  intro: string;
  resources: Resource[];
};

const tpt = (path: string) => `https://www.teacherspayteachers.com/Product/${path}`;

export const resourceGroups: ResourceGroup[] = [
  {
    id: "math",
    name: "Math",
    intro: "Lessons, activities and assessments for intermediate math.",
    resources: [
      {
        title: "Grade 8 Math Diagnostic",
        description: "A start-of-year diagnostic to see where students are.",
        format: "Google Docs and PDF",
        url: tpt("Grade-8-Math-Diagnostic-Start-of-Year-Google-Docs-PDF-12741042"),
        fits: [{ grade: 8, subject: "math" }],
      },
      {
        title: "Problem Solving Package (UPCE)",
        description: "A lesson with practice questions on problem solving using UPCE.",
        format: "Google Slides",
        url: tpt("Problem-Solving-Package-UPCE-Google-Slides-Lesson-Practice-Questions-12741111"),
        fits: [6, 7, 8].map((grade) => ({ grade, subject: "math" as const })),
      },
      {
        title: "Exponents and Powers",
        description: "A lesson and activity introducing exponents and powers.",
        format: "Google Drive and PDF",
        url: tpt("Exponents-and-Powers-Lesson-Activity-Google-Drive-and-PDF-12741143"),
        fits: [{ grade: 8, subject: "math", topicIds: ["exponents-and-powers"] }],
      },
      {
        title: "Exponent Rules",
        description: "A lesson and activity on the exponent laws.",
        format: "Google Slides and PowerPoint",
        url: tpt("Exponent-Rules-Lesson-Activity-Google-Slides-PPTX-12741149"),
        fits: [{ grade: 8, subject: "math", topicIds: ["exponents-and-powers"] }],
      },
      {
        title: "Fractions: Add, Subtract, Multiply, Divide",
        description: "A two-part lesson covering all four operations with fractions.",
        format: "Google Slides and PowerPoint",
        url: tpt("Fractions-AddSubtractMultiplyDivide-2-Part-Lesson-Google-Slides-PPTX-12741196"),
        fits: [
          { grade: 6, subject: "math", topicIds: ["fractions"] },
          { grade: 7, subject: "math", topicIds: ["rational-numbers"] },
          { grade: 8, subject: "math", topicIds: ["rational-numbers"] },
        ],
      },
      {
        title: "Scientific Notation",
        description: "A lesson and quiz on writing numbers in scientific notation.",
        format: "Google Slides and PDF",
        url: tpt("Scientific-Notation-Lesson-Quiz-Google-Slides-PDF-12741168"),
        fits: [{ grade: 8, subject: "math", topicIds: ["scientific-notation"] }],
      },
    ],
  },
  {
    id: "python",
    name: "Python course",
    intro: "An 11-lesson introduction to programming in Python.",
    resources: [
      {
        title: "Python Lesson Package",
        description: "All 11 lessons in one bundle.",
        format: "Bundle",
        url: tpt("Python-Lesson-Package-12741289"),
      },
      { title: "Lesson 1: Introduction to Python", format: "Lesson", url: tpt("Lesson-1-Introduction-to-Python-12741222") },
      { title: "Lesson 2: Types", format: "Lesson", url: tpt("Lesson-2-Types-12741228") },
      { title: "Lesson 3: Operators", format: "Lesson", url: tpt("Lesson-3-Operators-12741232") },
      { title: "Lesson 4: Conditions", format: "Lesson", url: tpt("Lesson-4-Conditions-12741238") },
      { title: "Lesson 5: While Loops", format: "Lesson", url: tpt("Lesson-5-While-Loops-12741248") },
      { title: "Lesson 6: Lists and Loops", format: "Lesson", url: tpt("Lesson-6-Lists-Loops-12741265") },
      { title: "Lesson 7: Functions", format: "Lesson", url: tpt("Lesson-7-Functions-12741268") },
      { title: "Lesson 8: List and String Methods", format: "Lesson", url: tpt("Lesson-8-List-String-Methods-12741273") },
      { title: "Lesson 9: Modules", format: "Lesson", url: tpt("Lesson-9-Modules-12741280") },
      { title: "Lesson 10: Data Structures", format: "Lesson", url: tpt("Lesson-10-Data-Structures-12741281") },
      { title: "Lesson 11: Classes", format: "Lesson", url: tpt("Lesson-11-Classes-12741285") },
    ],
  },
];

export const featuredResources: Resource[] = [
  resourceGroups[0].resources[0],
  resourceGroups[0].resources[4],
  resourceGroups[1].resources[0],
];

// Mayuri's products for a grade and subject, or for one topic.
// A product with no topic ids fits every topic in its grade and subject.
export function resourcesFor(grade: number, subject: SubjectId, topicId?: string): Resource[] {
  return resourceGroups
    .flatMap((group) => group.resources)
    .filter((resource) =>
      resource.fits?.some(
        (fit) =>
          fit.grade === grade &&
          fit.subject === subject &&
          (!topicId || !fit.topicIds || fit.topicIds.includes(topicId)),
      ),
    );
}
