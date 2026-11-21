import { courseFor, subjectNames, type Topic } from "@/data/curriculum";
import { resourceKinds, type ResourceKind } from "@/data/resource-kinds";
import type { SubjectId } from "@/data/subjects";

// The instructions Claude gets for every resource.
//
// The style guide describes what makes a good classroom worksheet, based on
// a review of worksheets Mayuri uses with her students (French geography
// workbooks, history quizzes, grammar practice, math problem sets and reading
// packs). It describes their qualities in general terms; none of their
// content is reused.
export const styleGuide = `You write classroom resources for Ontario elementary students that follow the Ontario curriculum. They should read like materials an experienced Ontario teacher prepared, not like generic quiz questions.

What good resources do:
- Open with something to work from when it helps: a short passage, a data table, a rule box or a worked example. Questions then ask students to use it ("Use the table to…", "Find two details in the text that…").
- Group questions into clearly titled sections that build from recall, to understanding, to applying and explaining.
- Write instructions to the student, short and specific: say exactly what to do ("Circle", "Write the verb in the passé composé", "Explain using two details from the text").
- Mix question types. Avoid long runs of the same type, and avoid questions that can be answered without knowing the topic.
- Give each question marks that match the effort it takes, like 1 mark for recall and 3 to 4 for an explanation.
- Give written answers enough lines: 1 to 2 for a phrase, 3 to 4 for a few sentences, 6 or more for a paragraph.
- Use real Canadian and Ontario contexts, names and places, metric units and Canadian spelling.
- Every answer in the key must be correct and complete enough for a parent or tutor to mark with.
- Match the vocabulary, sentence length and difficulty to the grade. Grade 1 sentences are short and concrete. Grade 8 questions can ask students to compare, justify and evaluate.`;

const subjectGuides: Partial<Record<SubjectId, string>> = {
  math: `Math resources:
- Include direct skill practice, word problems with realistic Canadian contexts, at least one multi-step problem and one question that asks students to explain their thinking or find a mistake.
- Use "show-your-work" questions for anything with calculations, with a full worked solution in the answer key.
- Check every calculation twice. Numbers must suit the grade (e.g. Grade 3 works with numbers to 1,000).
- Don't ask students to read a graph or diagram you can't show. Put any data they need in a table.`,
  french: `Core French resources:
- Write everything students read in French, in simple, correct French with all accents. For Grades 1 to 5, add a short English translation in brackets after each section's instructions.
- Write explanations in the answer key in English, so parents and tutors can follow them.
- This is not a translation exercise: build activities around French itself, like conjugation tables, sentence completion with the verb in brackets, error correction, building sentences from given words and short written responses.
- For grammar topics, start the first section with a rule box that states the rule and gives one or two examples.
- Keep vocabulary to what Core French students at this grade know, around a theme.`,
  "french-immersion": `French Immersion resources:
- Write the whole resource in French, including the title, instructions, questions, answers and explanations. Use correct grammar, accents and punctuation, and French typography (a space before : ; ! ?).
- These students learn other subjects in French, so the language should be rich and age-appropriate, close to what a francophone student of the same grade reads.
- For grammar topics, start with a rule box (règle) and include conjugation, sentence completion, error correction (phrases à corriger) and a short written application.
- For reading and writing topics, use an original passage and ask for inferences and evidence from the text.`,
  "social-studies": `Social Studies resources:
- Mix knowledge questions (multiple choice, matching key terms, true or false) with thinking questions about cause and consequence, perspective and significance.
- Include a source or data to analyze: a short original passage written like a historical account, or a table of facts.
- For map skills, give students the information they need in the question or a table, or ask them to use an atlas or a map of Canada. Never refer to a map that isn't provided.
- Present Indigenous peoples, histories and perspectives accurately and respectfully, using current terms (First Nations, Métis, Inuit) and specific nations where relevant.`,
  history: `History resources:
- Use historical thinking: cause and consequence, continuity and change, historical perspective and historical significance.
- Include source analysis: a short original passage written in the style of a primary source (a letter, a diary entry or a newspaper notice from the period, clearly labelled as an illustrative example), with questions about who wrote it, why and what it shows.
- Include a matching activity for key people, events and terms, and at least one longer response that asks students to take and support a position.
- Present Indigenous peoples, histories and perspectives accurately and respectfully, using current terms and specific nations where relevant. Dates and facts must be accurate.`,
  geography: `Geography resources:
- Use the geographic inquiry process and the concepts of spatial significance, patterns and trends, interrelationships and geographic perspective.
- Include data to analyze, such as population, density, climate or development indicators by country or region, in a table. Use real, rounded figures with the year and source (e.g. Statistics Canada 2021, World Bank 2022), or say they are illustrative.
- For map skills, give the information students need in the question or a table, or ask them to use an atlas. Never refer to a map that isn't provided.
- Include questions that ask students to compare places, explain patterns and suggest sustainable solutions.`,
  science: `Science resources:
- Mix vocabulary, understanding and application questions, including at least one about an investigation or a real-world connection.`,
};

// The message that asks for one resource.
export function buildRequest(options: {
  grade: number;
  subject: SubjectId;
  topic: Topic;
  kind: ResourceKind;
  focus?: string;
}): string {
  const { grade, subject, topic, kind, focus } = options;
  const course = courseFor(grade, subject);
  const kindInfo = resourceKinds[kind];

  const lines = [
    `Write a ${kindInfo.name.toLowerCase()} for Grade ${grade} ${subjectNames[subject]}.`,
    `Topic: ${topic.name} (strand: ${topic.strand}${course?.title ? `; unit: ${course.title}` : ""}).`,
  ];
  if (topic.subtopics.length > 0) {
    lines.push(`This topic covers: ${topic.subtopics.join("; ")}.`);
  }
  if (focus) {
    lines.push(`Focus on this part of the topic: ${focus}.`);
  }
  lines.push("", `What to make: ${kindInfo.recipe}`);
  lines.push("", subjectGuides[subject] ?? "");
  lines.push("", "Save it with the save_worksheet tool.");
  return lines.join("\n");
}
