import type { Worksheet, WorksheetMeta } from "@/lib/worksheet";

// Example worksheets shown on the home page, so visitors can see what they'll
// get before creating an account. Every answer and figure has been checked.
export type Sample = { id: string; meta: WorksheetMeta; worksheet: Worksheet };

export const samples: Sample[] = [
  {
    id: "grade-1-math",
    meta: { grade: 1, subject: "math", topicId: "adding-and-subtracting-to-20", kind: "worksheet" },
    worksheet: {
      title: "Snack Time Adding",
      instructions: "Count the pictures. Write how many in the box.",
      sections: [
        {
          title: "Count and add",
          instructions: "Count each group. Write the answer in the box.",
          layout: "cards",
          questions: [
            {
              type: "fill-in-the-blank",
              prompt: "3 + 2 = ___",
              answers: ["5"],
              marks: 1,
              visual: { kind: "pictures", groups: [{ picture: "apple", count: 3 }, { picture: "apple", count: 2 }], operator: "+" },
            },
            {
              type: "fill-in-the-blank",
              prompt: "4 + 4 = ___",
              answers: ["8"],
              marks: 1,
              visual: { kind: "pictures", groups: [{ picture: "strawberry", count: 4 }, { picture: "strawberry", count: 4 }], operator: "+" },
            },
            {
              type: "fill-in-the-blank",
              prompt: "6 − 2 = ___",
              answers: ["4"],
              marks: 1,
              visual: { kind: "pictures", groups: [{ picture: "cookie", count: 6 }, { picture: "cookie", count: 2 }], operator: "-" },
            },
            {
              type: "fill-in-the-blank",
              prompt: "There are ___ counters.",
              answers: ["7"],
              marks: 1,
              visual: { kind: "ten-frame", filled: 7 },
            },
          ],
        },
        {
          title: "Number line hops",
          instructions: "Use the number line. Write the answer in the box.",
          questions: [
            {
              type: "fill-in-the-blank",
              prompt: "Start at 5. Hop 3 more. You land on ___.",
              answers: ["8"],
              marks: 1,
              visual: { kind: "number-line", start: 0, end: 10, step: 1, marked: [5] },
            },
            {
              type: "multiple-choice",
              prompt: "Which number comes next? 10, 11, 12, ___",
              choices: ["13", "14", "20"],
              answerIndex: 0,
              explanation: "Counting on by 1 from 12 gives 13.",
              marks: 1,
            },
          ],
        },
        {
          title: "Story problem",
          instructions: "Read the story. Show how you know.",
          questions: [
            {
              type: "show-your-work",
              prompt: "Maya has 5 cookies. Leo gives her 4 more. How many cookies does Maya have now?",
              answer: "9 cookies",
              solution: ["5 + 4 = 9", "Maya has 9 cookies."],
              marks: 2,
            },
            {
              type: "short-answer",
              prompt: "Draw 6 apples in two groups. Write a number sentence for your groups.",
              lines: 2,
              answer: "Any two groups that make 6, for example 4 + 2 = 6.",
              marks: 2,
            },
          ],
        },
      ],
    },
  },
  {
    id: "math",
    meta: { grade: 4, subject: "math", topicId: "fractions", kind: "worksheet" },
    worksheet: {
      title: "Fractions all around us",
      instructions: "Show what you know about equivalent fractions and comparing fractions.",
      sections: [
        {
          title: "Part A: Equivalent fractions",
          instructions: "Fill in the missing number to make the fractions equal.",
          stimulus: {
            kind: "rule",
            title: "Equivalent fractions",
            points: [
              "Multiply or divide the numerator and the denominator by the same number.",
              "Example: 1/2 = 2/4 = 4/8",
            ],
          },
          questions: [
            { type: "fill-in-the-blank", prompt: "1/2 = ___/8", answers: ["4"], marks: 1 },
            { type: "fill-in-the-blank", prompt: "3/4 = ___/12", answers: ["9"], marks: 1 },
            { type: "fill-in-the-blank", prompt: "2/3 = 4/___", answers: ["6"], marks: 1 },
            {
              type: "multiple-choice",
              prompt: "Which fraction is equal to 2/5?",
              choices: ["4/10", "2/10", "5/2", "4/5"],
              answerIndex: 0,
              explanation: "Multiplying the numerator and denominator of 2/5 by 2 gives 4/10.",
              marks: 1,
            },
          ],
        },
        {
          title: "Part B: Comparing fractions",
          instructions: "Circle True or False, or choose the best answer.",
          questions: [
            {
              type: "true-false",
              statement: "1/6 is greater than 1/4.",
              answer: false,
              explanation: "Sixths are smaller pieces than fourths, so 1/6 is less than 1/4.",
              marks: 1,
            },
            {
              type: "multiple-choice",
              prompt: "Which list is in order from least to greatest?",
              choices: ["1/8, 1/4, 1/2", "1/2, 1/4, 1/8", "1/4, 1/8, 1/2", "1/2, 1/8, 1/4"],
              answerIndex: 0,
              explanation: "With the same numerator, the bigger the denominator, the smaller the piece.",
              marks: 1,
            },
          ],
        },
        {
          title: "Part C: Problem solving",
          instructions: "Show your work or explain your thinking.",
          questions: [
            {
              type: "show-your-work",
              prompt: "Maya ate 3/8 of a pizza. Theo ate 1/4 of the same pizza. Who ate more?",
              answer: "Maya ate more.",
              solution: ["Write 1/4 in eighths: 1/4 = 2/8.", "Compare: 3/8 is greater than 2/8.", "Maya ate more pizza."],
              marks: 3,
            },
            {
              type: "short-answer",
              prompt: "Jordan says 3/4 of a small pizza is the same amount as 3/4 of a large pizza. Is he right? Explain.",
              lines: 3,
              answer: "No. Both are 3 of 4 equal parts, but the parts of the large pizza are bigger, so 3/4 of the large pizza is more pizza.",
              marks: 2,
            },
          ],
        },
      ],
    },
  },
  {
    id: "french",
    meta: { grade: 5, subject: "french", topicId: "common-irregular-verbs", kind: "worksheet" },
    worksheet: {
      title: "Les verbes être et avoir",
      instructions: "Complète les trois parties. (Complete the three parts.)",
      sections: [
        {
          title: "Partie A : La conjugaison",
          instructions: "Écris la bonne forme du verbe. (Write the correct form of the verb.)",
          stimulus: {
            kind: "rule",
            title: "Être et avoir au présent",
            points: [
              "être : je suis, tu es, il/elle/on est, nous sommes, vous êtes, ils/elles sont",
              "avoir : j'ai, tu as, il/elle/on a, nous avons, vous avez, ils/elles ont",
            ],
          },
          questions: [
            { type: "fill-in-the-blank", prompt: "Je ___ (être) content aujourd'hui.", answers: ["suis"], marks: 1 },
            { type: "fill-in-the-blank", prompt: "Nous ___ (avoir) un chien.", answers: ["avons"], marks: 1 },
            { type: "fill-in-the-blank", prompt: "Elles ___ (être) à l'école.", answers: ["sont"], marks: 1 },
            { type: "fill-in-the-blank", prompt: "Tu ___ (avoir) dix ans.", answers: ["as"], marks: 1 },
          ],
        },
        {
          title: "Partie B : Être ou avoir ?",
          instructions: "Choisis la bonne réponse. (Choose the correct answer.)",
          questions: [
            {
              type: "multiple-choice",
              prompt: "Vous ___ très gentils.",
              choices: ["avez", "êtes", "sont", "ont"],
              answerIndex: 1,
              explanation: "With vous, être becomes êtes: vous êtes.",
              marks: 1,
            },
            {
              type: "true-false",
              statement: "On dit « J'ai dix ans » en français.",
              answer: true,
              explanation: "French uses avoir for age: j'ai dix ans.",
              marks: 1,
            },
            {
              type: "multiple-choice",
              prompt: "Mes amis et moi, nous ___ faim.",
              choices: ["sommes", "avons", "ont"],
              answerIndex: 1,
              explanation: "French says avoir faim (to be hungry), and with nous, avoir becomes avons.",
              marks: 1,
            },
          ],
        },
        {
          title: "Partie C : Corrige l'erreur",
          instructions: "Récris la phrase correctement. (Rewrite the sentence correctly.)",
          questions: [
            {
              type: "short-answer",
              prompt: "Il est faim.",
              lines: 1,
              answer: "Il a faim. French uses avoir for hunger: avoir faim.",
              marks: 2,
            },
            {
              type: "short-answer",
              prompt: "Tu es dix ans.",
              lines: 1,
              answer: "Tu as dix ans. French uses avoir for age.",
              marks: 2,
            },
          ],
        },
      ],
    },
  },
  {
    id: "geography",
    meta: { grade: 8, subject: "geography", topicId: "population-growth-and-distribution", kind: "worksheet" },
    worksheet: {
      title: "Population density around the world",
      instructions: "Use the table to answer the questions about where people live.",
      sections: [
        {
          title: "Part A: Reading the data",
          instructions: "Use the table to answer each question.",
          stimulus: {
            kind: "table",
            title: "Population and area of five countries (rounded, around 2021)",
            columns: ["Country", "Population", "Area (km²)", "People per km²"],
            rows: [
              ["Canada", "37.0 million", "8,800,000", "4"],
              ["Japan", "125.7 million", "378,000", "333"],
              ["Australia", "25.7 million", "7,690,000", "3"],
              ["Bangladesh", "169.4 million", "148,000", "1,145"],
              ["Egypt", "109.3 million", "1,002,000", "?"],
            ],
          },
          questions: [
            {
              type: "multiple-choice",
              prompt: "Which country has the highest population density?",
              choices: ["Canada", "Japan", "Bangladesh", "Australia"],
              answerIndex: 2,
              explanation: "Bangladesh has about 1,145 people per km², far more than the others.",
              marks: 1,
            },
            {
              type: "show-your-work",
              prompt: "Calculate Egypt's population density. Round to the nearest whole number.",
              answer: "About 109 people per km²",
              solution: [
                "Population density = population ÷ area",
                "109,300,000 ÷ 1,002,000 ≈ 109",
                "Egypt has about 109 people per km².",
              ],
              marks: 2,
            },
            {
              type: "short-answer",
              prompt: "Japan and Canada have very different areas. How many times larger is Canada's area than Japan's? Round to the nearest whole number.",
              lines: 2,
              answer: "About 23 times larger (8,800,000 ÷ 378,000 ≈ 23).",
              marks: 2,
            },
            {
              type: "true-false",
              statement: "Canada has a high population density.",
              answer: false,
              explanation: "Canada has about 4 people per km², one of the lowest densities in the world.",
              marks: 1,
            },
          ],
        },
        {
          title: "Part B: Thinking about patterns",
          instructions: "Answer in full sentences.",
          questions: [
            {
              type: "matching",
              prompt: "Match each term with its meaning.",
              pairs: [
                { term: "Population density", match: "The average number of people living in each square kilometre" },
                { term: "Population distribution", match: "The pattern of where people live in an area" },
                { term: "Densely populated", match: "Many people living close together" },
                { term: "Sparsely populated", match: "Few people spread far apart" },
              ],
              marks: 4,
            },
            {
              type: "short-answer",
              prompt: "Canada and Australia both have low population densities. Give one physical reason for each country.",
              lines: 4,
              answer:
                "Canada: much of the North has a very cold climate and permafrost, which makes farming and building hard. Australia: much of the interior is hot, dry desert with little fresh water.",
              marks: 4,
            },
            {
              type: "multiple-choice",
              prompt: "Which factor best explains why Bangladesh is so densely populated?",
              choices: [
                "Fertile river delta land that supports farming",
                "A cold climate with long winters",
                "Large deserts in the interior",
                "Very few rivers",
              ],
              answerIndex: 0,
              explanation: "The Ganges–Brahmaputra delta has rich soil and water, so it can support many people.",
              marks: 1,
            },
            {
              type: "long-answer",
              prompt:
                "About 90% of Canadians live within 160 km of the United States border. Explain why population density alone doesn't tell the whole story about where people live in Canada.",
              lines: 6,
              answer:
                "Density is an average over the whole country. Canada's people are unevenly distributed: most live in the south, where the climate is milder, farmland is better and cities and transportation are close, so some places (like Toronto) are densely populated while the North is very sparsely populated. A full answer explains the difference between density and distribution and gives an example.",
              marks: 4,
            },
          ],
        },
      ],
    },
  },
];
