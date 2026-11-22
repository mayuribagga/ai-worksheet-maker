import type { Worksheet, WorksheetMeta } from "../worksheet";

// Example worksheets for each age group, written the way Claude is asked to
// write them. Tests check they're valid and fit their grade.
export const fixtures: { name: string; meta: WorksheetMeta; worksheet: Worksheet }[] = [
  {
    name: "Grade 2 Core French picture vocabulary",
    meta: { grade: 2, subject: "french", topicId: "food-and-drinks", kind: "worksheet" },
    worksheet: {
      title: "J'aime les fruits !",
      instructions: "Look at the pictures. Learn the French words for fruit.",
      sections: [
        {
          title: "Part 1: Look and say",
          instructions: "Say each word out loud.",
          stimulus: {
            kind: "visual",
            visual: {
              kind: "picture-cards",
              cards: [
                { picture: "apple", label: "la pomme" },
                { picture: "banana", label: "la banane" },
                { picture: "strawberry", label: "la fraise" },
                { picture: "orange", label: "l'orange" },
              ],
            },
          },
          layout: "cards",
          questions: [
            {
              type: "matching",
              prompt: "Match the picture to the word.",
              pairs: [
                { term: "", match: "la pomme", picture: "apple" },
                { term: "", match: "la banane", picture: "banana" },
                { term: "", match: "la fraise", picture: "strawberry" },
              ],
              marks: 3,
            },
          ],
        },
        {
          title: "Part 2: J'aime… Je n'aime pas…",
          instructions: "Use the word bank. Write the missing word.",
          stimulus: { kind: "word-bank", words: ["pomme", "banane", "fraise"] },
          questions: [
            { type: "fill-in-the-blank", prompt: "J'aime la ___ rouge.", answers: ["pomme"], marks: 1, visual: { kind: "pictures", groups: [{ picture: "apple", count: 1 }] } },
            { type: "fill-in-the-blank", prompt: "La ___ est jaune.", answers: ["banane"], marks: 1, visual: { kind: "pictures", groups: [{ picture: "banana", count: 1 }] } },
            { type: "fill-in-the-blank", prompt: "J'aime la ___ !", answers: ["fraise"], marks: 1, visual: { kind: "pictures", groups: [{ picture: "strawberry", count: 1 }] } },
            { type: "true-false", statement: "La banane est rouge.", answer: false, explanation: "A banana is yellow: la banane est jaune.", marks: 1 },
            { type: "short-answer", prompt: "Draw your favourite fruit. Write: J'aime ___.", lines: 2, answer: "Any fruit, e.g. J'aime la fraise.", marks: 2 },
          ],
        },
      ],
    },
  },
  {
    name: "Grade 3 math morning work",
    meta: { grade: 3, subject: "math", topicId: "fractions", kind: "practice" },
    worksheet: {
      title: "Fraction Morning Work",
      instructions: "Read each box carefully. Show your thinking.",
      notes: [{ heading: "What is a fraction?", points: ["A fraction names equal parts of a whole.", "The bottom number tells how many equal parts. The top number tells how many we count."], example: "3/4 means 3 of 4 equal parts." }],
      sections: [
        {
          title: "Box it up",
          instructions: "Answer each box.",
          layout: "cards",
          questions: [
            { type: "fill-in-the-blank", prompt: "___ out of 4 parts are shaded.", answers: ["3"], marks: 1, visual: { kind: "fraction", model: "bar", parts: 4, shaded: 3 } },
            { type: "multiple-choice", prompt: "What fraction is shaded?", choices: ["1/2", "1/3", "1/4"], answerIndex: 2, explanation: "1 of 4 equal parts is shaded.", marks: 1, visual: { kind: "fraction", model: "circle", parts: 4, shaded: 1 } },
            { type: "multiple-choice", prompt: "What time does the clock show?", choices: ["3:15", "3:45", "9:15"], answerIndex: 0, explanation: "The short hand is just past 3 and the long hand points to 3, which is 15 minutes.", marks: 1, visual: { kind: "clock", hour: 3, minute: 15 } },
            { type: "true-false", statement: "1/2 is bigger than 1/3.", answer: true, explanation: "Halves are bigger pieces than thirds.", marks: 1 },
            { type: "fill-in-the-blank", prompt: "A pizza cut into 6 equal slices. Each slice is ___ of the pizza.", answers: ["1/6"], marks: 1 },
            { type: "multiple-choice", prompt: "How many thirds make one whole?", choices: ["2", "3", "6"], answerIndex: 1, explanation: "3 thirds make 1 whole.", marks: 1 },
            { type: "fill-in-the-blank", prompt: "The time is ___.", answers: ["7:30"], marks: 1, visual: { kind: "clock", hour: 7, minute: 30 } },
          ],
        },
        {
          title: "Pizza day",
          instructions: "Use the graph to answer.",
          stimulus: { kind: "visual", visual: { kind: "bar-graph", title: "Slices eaten at lunch", categories: ["Ana", "Ben", "Kai", "Zoe"], values: [3, 5, 2, 4], valueLabel: "Slices" } },
          questions: [
            { type: "short-answer", prompt: "Who ate the most slices? How many?", lines: 1, answer: "Ben ate 5 slices.", marks: 1 },
            { type: "show-your-work", prompt: "Each pizza has 8 slices. Ana and Kai shared one pizza. What fraction of the pizza did they eat?", answer: "5/8", solution: ["Ana ate 3 and Kai ate 2.", "3 + 2 = 5 slices.", "5 out of 8 slices is 5/8."], marks: 3 },
          ],
        },
      ],
    },
  },
  {
    name: "Grade 2 Social Studies community map",
    meta: { grade: 2, subject: "social-studies", topicId: "how-people-live-around-the-world", kind: "worksheet" },
    worksheet: {
      title: "My Community Map",
      instructions: "Look at the map. Answer the questions.",
      sections: [
        {
          title: "Find it on the map",
          instructions: "Use the letters and numbers to find each place.",
          stimulus: {
            kind: "visual",
            visual: {
              kind: "grid-map",
              title: "Maple Street",
              columns: 5,
              rows: 4,
              compass: true,
              places: [
                { label: "School", picture: "school", column: 1, row: 1 },
                { label: "Park", picture: "tree", column: 4, row: 1 },
                { label: "Store", picture: "shopping-cart", column: 2, row: 3 },
                { label: "Home", picture: "house", column: 5, row: 4 },
              ],
            },
          },
          questions: [
            { type: "fill-in-the-blank", prompt: "The school is in square ___.", answers: ["A1"], marks: 1 },
            { type: "multiple-choice", prompt: "What is in square D1?", choices: ["the park", "the store", "home"], answerIndex: 0, explanation: "Column D, row 1 has the park.", marks: 1 },
            { type: "true-false", statement: "The park is north of the store.", answer: true, explanation: "The park is in row 1, higher on the map than the store in row 3.", marks: 1 },
            { type: "short-answer", prompt: "Which place would you like to visit? Why?", lines: 2, answer: "Any place with a reason, e.g. The park, because I like to play.", marks: 2 },
          ],
        },
        {
          title: "Needs and wants",
          instructions: "Match each picture to the word.",
          questions: [
            {
              type: "matching",
              prompt: "Is it a need or a want?",
              pairs: [
                { term: "Water", match: "need", picture: "water-drop" },
                { term: "Balloon", match: "want", picture: "balloon" },
                { term: "Coat in winter", match: "keeps us warm", picture: "coat" },
              ],
              marks: 3,
            },
            {
              type: "multiple-choice",
              prompt: "Which shape is a stop sign?",
              choices: ["circle", "octagon", "triangle"],
              answerIndex: 1,
              explanation: "A stop sign has 8 sides, so it is an octagon.",
              marks: 1,
              visual: { kind: "shapes", shapes: ["circle", "octagon", "triangle"] },
            },
          ],
        },
      ],
    },
  },
];
