import type { Worksheet, WorksheetMeta } from "@/lib/worksheet";

// Example worksheets shown on the home page, so visitors can see what they'll
// get before creating an account. Every marked answer has been checked.
export type Sample = { id: string; meta: WorksheetMeta; worksheet: Worksheet };

export const samples: Sample[] = [
  {
    id: "math",
    meta: { grade: 4, subject: "math", topicId: "fractions" },
    worksheet: {
      title: "Fractions all around us",
      instructions: "Read each question and fill in the circle beside the best answer.",
      questions: [
        { prompt: "Which fraction is equal to one half?", choices: ["2/4", "1/3", "3/5", "1/4"], answerIndex: 0, explanation: "2/4 simplifies to 1/2, because 2 and 4 can both be divided by 2." },
        { prompt: "Maya ate 3 of the 8 slices of a pizza. What fraction of the pizza did she eat?", choices: ["8/3", "3/8", "5/8", "3/5"], answerIndex: 1, explanation: "She ate 3 parts out of 8 equal parts, which is 3/8." },
        { prompt: "Which fraction is the largest?", choices: ["1/8", "1/6", "1/4", "1/2"], answerIndex: 3, explanation: "When the numerators are the same, a smaller denominator means bigger pieces." },
        { prompt: "What fraction of a dozen eggs is 6 eggs?", choices: ["1/6", "1/3", "1/2", "2/3"], answerIndex: 2, explanation: "6 out of 12 is 6/12, which equals 1/2." },
        { prompt: "Which pair of fractions is equivalent?", choices: ["1/3 and 2/6", "1/4 and 2/6", "2/3 and 3/4", "1/5 and 2/5"], answerIndex: 0, explanation: "Multiplying the top and bottom of 1/3 by 2 gives 2/6." },
      ],
    },
  },
  {
    id: "french",
    meta: { grade: 5, subject: "french", topicId: "the-verbs-tre-and-avoir" },
    worksheet: {
      title: "Les verbes être et avoir",
      instructions: "Choisis la bonne forme du verbe pour compléter chaque phrase.",
      questions: [
        { prompt: "Je ___ content aujourd'hui.", choices: ["suis", "ai", "es", "as"], answerIndex: 0, explanation: "With je, être becomes suis: je suis." },
        { prompt: "Nous ___ un chien.", choices: ["sommes", "avons", "êtes", "ont"], answerIndex: 1, explanation: "With nous, avoir becomes avons: nous avons." },
        { prompt: "Elles ___ à l'école.", choices: ["sont", "ont", "est", "a"], answerIndex: 0, explanation: "With elles, être becomes sont: elles sont." },
        { prompt: "Tu ___ dix ans.", choices: ["es", "as", "est", "a"], answerIndex: 1, explanation: "Age uses avoir in French, and with tu it becomes as: tu as dix ans." },
        { prompt: "Vous ___ très gentils.", choices: ["avez", "êtes", "sont", "ont"], answerIndex: 1, explanation: "With vous, être becomes êtes: vous êtes." },
      ],
    },
  },
  {
    id: "science",
    meta: { grade: 4, subject: "science", topicId: "habitats-and-communities" },
    worksheet: {
      title: "Habitats and communities",
      instructions: "Read each question and fill in the circle beside the best answer.",
      questions: [
        { prompt: "What is a habitat?", choices: ["A place where a plant or animal lives", "A type of food", "A kind of weather", "A group of rocks"], answerIndex: 0, explanation: "A habitat is the place where a living thing gets what it needs to survive." },
        { prompt: "Which animal is a carnivore?", choices: ["Deer", "Rabbit", "Wolf", "Cow"], answerIndex: 2, explanation: "Wolves eat other animals, so they are carnivores." },
        { prompt: "Plants make their own food using energy from…", choices: ["other animals", "sunlight", "rocks", "the moon"], answerIndex: 1, explanation: "Plants are producers: they use sunlight to make food." },
        { prompt: "Which is a food chain?", choices: ["Grass → rabbit → fox", "Rock → water → air", "Sun → moon → stars", "Cloud → rain → snow"], answerIndex: 0, explanation: "Energy passes from the grass to the rabbit that eats it, then to the fox." },
        { prompt: "What can happen when a habitat is destroyed?", choices: ["Animals lose their homes", "Nothing changes", "More food appears", "Plants grow faster"], answerIndex: 0, explanation: "Without their habitat, plants and animals lose the food and shelter they need." },
      ],
    },
  },
];
