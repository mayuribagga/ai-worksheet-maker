import { courseFor, subjectNames, type Topic } from "@/data/curriculum";
import { resourceKinds, type ResourceKind } from "@/data/resource-kinds";
import type { SubjectId } from "@/data/subjects";
import { bandProfiles, gradeBand, type GradeBand } from "./grade-bands";
import { pictureNames } from "./pictures";
import { pickBlueprint, pickGenre } from "./worksheet-blueprints";

// The instructions Claude gets for every resource.
//
// The style guide describes what makes a good classroom worksheet, based on
// a review of worksheets Mayuri uses with her students (French geography
// workbooks, history quizzes, grammar practice, picture-based math pages for
// young children, morning work, problem sets and reading packs). It describes
// their qualities in general terms; none of their content is reused.
export const styleGuide = `You write classroom resources for Ontario elementary students that follow the Ontario curriculum. They should read like materials an experienced Ontario teacher designed for one specific grade, not like generic quiz questions. A tutor or teacher should feel comfortable handing it to a student as is.

What good resources do:
- Fit one grade exactly. Every choice (words, sentence length, numbers, how much to read and write, how hard the thinking is, how the page looks) follows the student profile you're given. A Grade 1 page and a Grade 8 page on a similar topic look and read completely differently.
- Open with something to work from when it helps: a picture, a drawing, a short passage, a data table, a rule box or a worked example. Questions then ask students to use it.
- Group questions into clearly titled sections that build from easier to harder.
- Write instructions to the student, specific to the task: say exactly what to do.
- Give students enough context to understand each question without outside help, but nothing they don't need.
- Mix question types. Avoid long runs of the same type, and avoid questions that can be answered without knowing the topic.
- Give each question marks that match the effort it takes.
- Give written answers enough lines for the answer you expect at that grade.
- Use real Canadian and Ontario contexts, names (from many backgrounds) and places, metric units and Canadian spelling.
- Every answer in the key must be correct and complete enough for a parent or tutor to mark with. Check every fact and calculation.

Drawings you can add (the site draws them accurately; set "visual" on a question, or use a "visual" stimulus for a whole section):
- pictures: groups of pictures to count, add (+) or take away (−). One picture with count 1 works as a simple illustration.
- picture-cards: pictures with their words, for vocabulary and sorting. A card without a word leaves a line for students to write it.
- ten-frame: counters in a ten-frame (up to 20).
- number-line: with marked points, or blank labels to fill in.
- fraction: a bar or circle split into equal parts, some shaded.
- bar-graph: categories and values, for reading and comparing data.
- clock: an analog clock showing a time.
- grid-map: a lettered and numbered grid with places, pictures and an optional compass.
- shapes: 2D shapes to name, sort or compare.
Matching pairs can also show a picture beside each term.
Only use a drawing when it helps the student answer. Never mention a drawing, map or picture that you didn't include.

Pictures you can use (use these names exactly): ${pictureNames.join(", ")}.`;

// Number sizes students work with in each grade (Ontario Mathematics, 2020).
const mathNumbers: Record<number, string> = {
  1: "whole numbers to 50, adding and subtracting within 20",
  2: "whole numbers to 200, adding and subtracting to 100",
  3: "whole numbers to 1,000",
  4: "whole numbers to 10,000 and decimal tenths",
  5: "whole numbers to 100,000 and decimals to hundredths",
  6: "whole numbers to 1,000,000, decimals to thousandths and integers",
  7: "rational numbers, including integers, fractions, decimals and percents",
  8: "rational numbers, powers and square roots, and scientific notation",
};

function subjectGuide(subject: SubjectId, grade: number, band: GradeBand): string {
  switch (subject) {
    case "math":
      return [
        "Math resources:",
        `- Use numbers that suit Grade ${grade}: ${mathNumbers[grade]}. Never go beyond the grade.`,
        band === "early"
          ? "- Make most questions concrete with drawings: pictures to count, ten-frames, number lines and shapes. Story problems are one sentence about familiar things. Answers go in boxes (fill-in-the-blank) or short show-your-work."
          : band === "primary"
            ? "- Mix direct practice, drawings (number lines, fraction models, bar graphs, clocks) and short story problems. Include one question that asks students to explain their thinking in a sentence."
            : band === "junior"
              ? "- Include skill practice, multi-step word problems in Canadian contexts, a question that uses a table or graph, and one that asks students to explain their reasoning or find a mistake."
              : "- Include multi-step and non-routine problems, data or algebraic reasoning, and questions that ask students to justify, generalize or evaluate a strategy.",
        "- Use show-your-work questions for calculations, with a step-by-step solution in the answer key.",
        "- Check every calculation twice.",
      ].join("\n");

    case "french": {
      const instructionLanguage =
        grade <= 3
          ? "Write instructions in simple English with the key French words; students at this level are just starting French."
          : grade <= 5
            ? "Write instructions in simple French, each followed by a short English translation in brackets."
            : grade === 6
              ? "Write instructions in simple French; add an English hint in brackets only for new words."
              : "Write everything students read in French.";
      return [
        "Core French resources:",
        `- ${instructionLanguage}`,
        "- Use correct French with all accents and French punctuation spacing (a space before : ; ! ?).",
        "- Write explanations in the answer key in English, so parents and tutors can follow them.",
        "- Stay within what Core French students at this grade know: vocabulary around one theme and the grammar of this topic, in short sentences. Core French students have about 40 minutes of French a day.",
        band === "early" || band === "primary"
          ? "- Use picture cards and matching with pictures for vocabulary, a word bank for fill-ins, and very short sentences."
          : "- Use conjugation, fill-ins with the word in brackets, error correction, building sentences from given words and a short written response, not translation drills.",
        "- For grammar topics, start the first section with a rule box that states the rule and gives one or two examples.",
      ].join("\n");
    }

    case "french-immersion":
      return [
        "French Immersion resources:",
        "- Write the whole resource in French, including the title, instructions, questions, answers and explanations. Use correct grammar, accents and French punctuation spacing (a space before : ; ! ?).",
        "- Immersion students learn other subjects in French, so the French should be close to what a francophone student of the same grade reads.",
        band === "early"
          ? "- Keep sentences very short and concrete. Use pictures with words, sounds and syllables, and word banks. Instructions use simple verbs: Colorie, Encercle, Relie, Écris, Dessine, Compte."
          : band === "primary"
            ? "- Use short texts, word families, simple grammar practice (déterminants, accord, présent) and short written answers."
            : band === "junior"
              ? "- Use a rule box for grammar, then conjugation, error correction (phrases à corriger) and a written application. For reading, ask for inferences and evidence from the text."
              : "- Use rich texts and expect structured written responses (paragraphs with arguments and evidence), precise grammar terms and complex sentences.",
      ].join("\n");

    case "social-studies":
      return [
        "Social Studies resources:",
        band === "early"
          ? "- Start from the child's own world (family, school, neighbourhood). Use picture cards and simple grid maps with pictures; questions ask children to look, sort, match and say one thing about themselves."
          : "- Mix knowledge questions (matching key terms, true or false) with thinking questions about cause and consequence, perspective and significance.",
        band === "early" ? "" : "- Include something to analyze: a short original passage, a table of facts, or a grid map.",
        "- For maps beyond a grid map, give students the information in the question or a table, or ask them to use an atlas.",
        "- Present Indigenous peoples, histories and perspectives accurately and respectfully, using current terms (First Nations, Métis, Inuit) and specific nations where relevant.",
      ]
        .filter(Boolean)
        .join("\n");

    case "history":
      return [
        "History resources:",
        "- Use historical thinking: cause and consequence, continuity and change, historical perspective and historical significance.",
        "- Include source analysis: an original passage written in the style of a primary source from the period (a letter, diary entry, petition or newspaper notice), clearly labelled as an illustrative example, with questions about who wrote it, why and what it shows.",
        "- Include a matching activity for key people, events and terms, and at least one longer response that asks students to take and support a position.",
        "- Present Indigenous peoples, histories and perspectives accurately and respectfully, using current terms and specific nations where relevant. Dates and facts must be accurate.",
      ].join("\n");

    case "geography":
      return [
        "Geography resources:",
        "- Use the geographic inquiry process and the concepts of spatial significance, patterns and trends, interrelationships and geographic perspective.",
        "- Include data to analyze, such as population, density, climate or development indicators by country or region, in a table or bar graph. Use real, rounded figures with the year and source (e.g. Statistics Canada 2021, World Bank 2022), or say they are illustrative.",
        "- For real-world maps, give the information students need in a table or ask them to use an atlas. A grid map works for location and direction skills.",
        "- Include questions that compare places, explain patterns and suggest sustainable solutions.",
      ].join("\n");

    case "science":
      return "Science resources:\n- Mix vocabulary, understanding and application questions, including one about an investigation or a real-world connection.";

    default:
      return "";
  }
}

function range([low, high]: [number, number]): string {
  return `${low} to ${high}`;
}

// The message that asks for one resource. `random` picks the design and,
// for reading, the kind of passage; tests pass a fixed one.
export function buildRequest(options: {
  grade: number;
  subject: SubjectId;
  topic: Topic;
  kind: ResourceKind;
  focus?: string;
  random?: () => number;
}): string {
  const { grade, subject, topic, kind, focus, random = Math.random } = options;
  const course = courseFor(grade, subject);
  const kindInfo = resourceKinds[kind];
  const band = gradeBand(grade);
  const profile = bandProfiles[band];
  const size = profile.size[kind];

  const lines = [
    `Write a ${kindInfo.name.toLowerCase()} for Grade ${grade} ${subjectNames[subject]}.`,
    `Topic: ${topic.name} (strand: ${topic.strand}${course?.title ? `; unit: ${course.title}` : ""}).`,
  ];
  if (topic.subtopics.length > 0) lines.push(`This topic covers: ${topic.subtopics.join("; ")}.`);
  if (focus) lines.push(`Focus on this part of the topic: ${focus}.`);

  lines.push(
    "",
    `The student (${profile.label}): ${profile.reader}.`,
    `- Language: ${profile.language}`,
    `- Instructions: ${profile.instructions}`,
    `- Thinking: ${profile.thinking}`,
    `- Design: ${profile.design}`,
    `- Question types that suit this age: ${profile.questionTypes}.`,
    `- Length: ${range(size.questions)} questions worth ${range(size.marks)} marks in total. Written answers get at most ${profile.maxLines} lines.`,
  );

  lines.push("", `What to make: ${kindInfo.recipe}`);

  if (kind === "reading") {
    lines.push(
      `The passage is ${pickGenre(band, random)}, ${range(profile.passageWords)} words long, original and about the topic.`,
    );
  }
  const blueprint = pickBlueprint(subject, band, kind, random);
  if (blueprint) {
    lines.push(`Design for this one ("${blueprint.name}"): ${blueprint.plan}`);
  }

  lines.push("", subjectGuide(subject, grade, band));
  lines.push("", "Save it with the save_worksheet tool.");
  return lines.join("\n");
}
