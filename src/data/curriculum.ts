// Ontario curriculum topics for Grades 1–8.
// Starter list for development: check each topic against the official
// curriculum documents (dcp.edu.gov.on.ca) before launch.

export type SubjectId = "math" | "french" | "science" | "social-studies" | "history-geography";

export type Topic = {
  id: string;
  name: string;
  strand: string;
};

type GradeSubject = {
  grade: number;
  subject: SubjectId;
  topics: Topic[];
};

export const subjectNames: Record<SubjectId, string> = {
  math: "Mathematics",
  french: "French (Core French)",
  science: "Science and Technology",
  "social-studies": "Social Studies",
  "history-geography": "History and Geography",
};

export const grades = [1, 2, 3, 4, 5, 6, 7, 8];

// Turns a strand and a list of topic names into Topic objects with ids.
function strand(name: string, topicNames: string[]): Topic[] {
  return topicNames.map((topicName) => ({
    id: topicName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    name: topicName,
    strand: name,
  }));
}

const math: GradeSubject[] = [
  {
    grade: 1,
    subject: "math",
    topics: [
      ...strand("Number", ["Counting to 50", "Adding and subtracting to 20", "Halves and fourths"]),
      ...strand("Algebra", ["Patterns", "Coding: following instructions"]),
      ...strand("Data", ["Sorting and simple graphs"]),
      ...strand("Spatial Sense", ["2D shapes and 3D objects", "Measuring length"]),
      ...strand("Financial Literacy", ["Canadian coins"]),
    ],
  },
  {
    grade: 2,
    subject: "math",
    topics: [
      ...strand("Number", ["Numbers to 200", "Adding and subtracting to 100", "Equal groups", "Fractions as equal parts"]),
      ...strand("Algebra", ["Growing and shrinking patterns", "Coding: sequences of instructions"]),
      ...strand("Data", ["Tally charts and bar graphs", "Likelihood of events"]),
      ...strand("Spatial Sense", ["Shapes and symmetry", "Measuring length and time"]),
      ...strand("Financial Literacy", ["Counting money"]),
    ],
  },
  {
    grade: 3,
    subject: "math",
    topics: [
      ...strand("Number", ["Numbers to 1000", "Adding and subtracting to 1000", "Multiplication and division facts", "Fractions"]),
      ...strand("Algebra", ["Patterns and equations", "Coding: loops and repetition"]),
      ...strand("Data", ["Graphs and probability"]),
      ...strand("Spatial Sense", ["Geometry and location", "Perimeter, area and mass", "Telling time"]),
      ...strand("Financial Literacy", ["Making change with money"]),
    ],
  },
  {
    grade: 4,
    subject: "math",
    topics: [
      ...strand("Number", ["Numbers to 10 000", "Decimals to tenths", "Fractions", "Multiplication and division"]),
      ...strand("Algebra", ["Patterns", "Equations", "Coding"]),
      ...strand("Data", ["Data and graphs", "Probability"]),
      ...strand("Spatial Sense", ["Geometry", "Area and perimeter", "Time"]),
      ...strand("Financial Literacy", ["Money and simple budgets"]),
    ],
  },
  {
    grade: 5,
    subject: "math",
    topics: [
      ...strand("Number", ["Numbers to 100 000", "Decimals to hundredths", "Fractions and decimals", "Multiplication and division"]),
      ...strand("Algebra", ["Patterns", "Equations and inequalities", "Coding"]),
      ...strand("Data", ["Data and graphs", "Probability"]),
      ...strand("Spatial Sense", ["Angles and triangles", "Area of triangles and parallelograms", "Transformations"]),
      ...strand("Financial Literacy", ["Budgets and sales tax"]),
    ],
  },
  {
    grade: 6,
    subject: "math",
    topics: [
      ...strand("Number", ["Numbers to 1 000 000", "Decimals to thousandths", "Ratios, rates and percents", "Integers"]),
      ...strand("Algebra", ["Patterns", "Equations", "Coding"]),
      ...strand("Data", ["Data and graphs", "Probability"]),
      ...strand("Spatial Sense", ["Cartesian plane", "Area of polygons", "Volume and surface area"]),
      ...strand("Financial Literacy", ["Ways to pay and financial goals"]),
    ],
  },
  {
    grade: 7,
    subject: "math",
    topics: [
      ...strand("Number", ["Integers", "Rational numbers", "Ratios, rates and percents", "Powers and square roots"]),
      ...strand("Algebra", ["Patterns", "Equations and inequalities", "Coding"]),
      ...strand("Data", ["Data and graphs", "Probability"]),
      ...strand("Spatial Sense", ["Geometry and transformations", "Circles", "Volume and surface area of prisms"]),
      ...strand("Financial Literacy", ["Interest and borrowing"]),
    ],
  },
  {
    grade: 8,
    subject: "math",
    topics: [
      ...strand("Number", ["Rational numbers", "Square roots and exponents", "Scientific notation", "Proportional reasoning"]),
      ...strand("Algebra", ["Linear patterns", "Solving equations", "Coding"]),
      ...strand("Data", ["Scatter plots", "Probability"]),
      ...strand("Spatial Sense", ["The Pythagorean relationship", "Volume of cylinders"]),
      ...strand("Financial Literacy", ["Budgets and credit"]),
    ],
  },
];

const science: GradeSubject[] = [
  [1, "Needs and Characteristics of Living Things", "Energy in Our Lives", "Materials, Objects, and Everyday Structures", "Daily and Seasonal Changes"],
  [2, "Growth and Changes in Animals", "Properties of Liquids and Solids", "Simple Machines and Movement", "Air and Water in the Environment"],
  [3, "Growth and Changes in Plants", "Forces Causing Movement", "Strong and Stable Structures", "Soils in the Environment"],
  [4, "Habitats and Communities", "Light and Sound", "Pulleys and Gears", "Rocks and Minerals"],
  [5, "Human Organ Systems", "Properties of and Changes in Matter", "Forces Acting on Structures", "Conservation of Energy and Resources"],
  [6, "Biodiversity", "Electrical Phenomena", "Flight", "Space"],
  [7, "Interactions in the Environment", "Pure Substances and Mixtures", "Form and Function", "Heat in the Environment"],
  [8, "Cells", "Fluids", "Systems in Action", "Water Systems"],
].map(([grade, life, matter, structures, earth]) => ({
  grade: grade as number,
  subject: "science" as const,
  topics: [
    ...strand("Life Systems", [life as string]),
    ...strand("Matter and Energy", [matter as string]),
    ...strand("Structures and Mechanisms", [structures as string]),
    ...strand("Earth and Space Systems", [earth as string]),
  ],
}));

const socialStudies: GradeSubject[] = [
  [1, "Our Changing Roles and Responsibilities", "The Local Community"],
  [2, "Changing Family and Community Traditions", "Global Communities"],
  [3, "Communities in Canada, 1780–1850", "Living and Working in Ontario"],
  [4, "Early Societies to 1500 CE", "Political and Physical Regions of Canada"],
  [5, "First Nations and Europeans in New France and Early Canada", "The Role of Government and Responsible Citizenship"],
  [6, "Communities in Canada, Past and Present", "Canada's Interactions with the Global Community"],
].map(([grade, heritage, people]) => ({
  grade: grade as number,
  subject: "social-studies" as const,
  topics: [
    ...strand("Heritage and Identity", [heritage as string]),
    ...strand("People and Environments", [people as string]),
  ],
}));

const historyGeography: GradeSubject[] = [
  {
    grade: 7,
    subject: "history-geography",
    topics: [
      ...strand("History", ["New France and British North America, 1713–1800", "Canada, 1800–1850: Conflict and Challenges"]),
      ...strand("Geography", ["Physical Patterns in a Changing World", "Natural Resources Around the World"]),
    ],
  },
  {
    grade: 8,
    subject: "history-geography",
    topics: [
      ...strand("History", ["Creating Canada, 1850–1890", "Canada, 1890–1914: A Changing Society"]),
      ...strand("Geography", ["Global Settlement: Patterns and Sustainability", "Global Inequalities: Economic Development and Quality of Life"]),
    ],
  },
];

// Core French starts in Grade 4. The curriculum is organized by skills
// (listening, speaking, reading, writing), so topics here are themes.
const french: GradeSubject[] = [
  {
    grade: 4,
    subject: "french",
    topics: strand("Vocabulary and Grammar", ["Greetings and introductions", "Numbers, days and months", "My family", "Colours and classroom objects"]),
  },
  {
    grade: 5,
    subject: "french",
    topics: strand("Vocabulary and Grammar", ["Food and likes and dislikes", "Weather and seasons", "The verbs être and avoir", "Telling time"]),
  },
  {
    grade: 6,
    subject: "french",
    topics: strand("Vocabulary and Grammar", ["Regular -er verbs", "Describing people", "Hobbies and sports", "My community"]),
  },
  {
    grade: 7,
    subject: "french",
    topics: strand("Vocabulary and Grammar", ["Asking questions", "Daily routines", "Regular -ir and -re verbs", "The near future (aller + infinitive)"]),
  },
  {
    grade: 8,
    subject: "french",
    topics: strand("Vocabulary and Grammar", ["The passé composé with avoir", "The passé composé with être", "Possessive adjectives", "Francophone communities"]),
  },
];

const curriculum: GradeSubject[] = [...math, ...french, ...science, ...socialStudies, ...historyGeography];

export function subjectsForGrade(grade: number): SubjectId[] {
  return curriculum.filter((entry) => entry.grade === grade).map((entry) => entry.subject);
}

export function topicsFor(grade: number, subject: SubjectId): Topic[] {
  return curriculum.find((entry) => entry.grade === grade && entry.subject === subject)?.topics ?? [];
}

export function findTopic(grade: number, subject: string, topicId: string): Topic | undefined {
  return topicsFor(grade, subject as SubjectId).find((topic) => topic.id === topicId);
}
