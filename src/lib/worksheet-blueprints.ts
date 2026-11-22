import type { ResourceKind } from "@/data/resource-kinds";
import type { SubjectId } from "@/data/subjects";
import type { GradeBand } from "./grade-bands";

// Different ways to design a worksheet, so worksheets don't all follow the
// same template. Each request picks one of the designs that suits the grade,
// subject and kind of resource. The designs come from the kinds of pages in
// Mayuri's reference folder: picture-based counting pages, morning-work task
// cards, rule-then-practice grammar sheets, source and data analysis, and
// story-based reading packs.

export type Blueprint = {
  name: string;
  subjects: SubjectId[] | "all";
  bands: GradeBand[];
  kinds: ResourceKind[];
  plan: string;
};

const math: SubjectId[] = ["math"];
const french: SubjectId[] = ["french", "french-immersion"];
const social: SubjectId[] = ["social-studies", "history", "geography"];
const practiceKinds: ResourceKind[] = ["worksheet", "practice"];

export const blueprints: Blueprint[] = [
  // Mathematics
  {
    name: "Picture math",
    subjects: math,
    bands: ["early"],
    kinds: practiceKinds,
    plan:
      "Section 1 uses the cards layout: 4 to 6 small tasks, each with a drawing (picture groups to count, ten-frames, a number line or shapes) and a box to write the answer. Section 2 is a short picture story problem about something a child knows (snack time, the playground), with a drawing. Section 3 asks the child to draw or show their thinking in one simple way.",
  },
  {
    name: "Number line adventure",
    subjects: math,
    bands: ["early", "primary"],
    kinds: practiceKinds,
    plan:
      "Build the worksheet around number lines: reading marked points, filling in missing numbers (hideLabels), counting on or back by jumps, then a story problem solved on a number line. Finish with one question asking the student to explain how the number line helped.",
  },
  {
    name: "Morning-work task cards",
    subjects: math,
    bands: ["primary", "junior"],
    kinds: practiceKinds,
    plan:
      "Two sections in the cards layout, each with 4 to 6 short, different tasks that mix skills from the topic (one with a drawing or table, one fill-in, one multiple choice, one quick word problem…). Then a final list section with one problem-solving question that needs working space.",
  },
  {
    name: "Learn, practise, apply",
    subjects: math,
    bands: ["primary", "junior", "intermediate"],
    kinds: practiceKinds,
    plan:
      "Section 1 opens with a rule box that explains the skill with one fully worked example, then a few warm-up questions. Section 2 is focused skill practice that gets gradually harder. Section 3 applies the skill to two or three real-life Canadian word problems with working space, including one multi-step problem.",
  },
  {
    name: "One real-life story",
    subjects: math,
    bands: ["junior", "intermediate"],
    kinds: practiceKinds,
    plan:
      "Choose one realistic Canadian situation (planning a class trip to a provincial park, running a school bake sale, a hockey tournament, a community garden…) and use it for the whole worksheet. Section 1 gives the facts in a table or graph. Later sections ask questions that use those facts, ending with a multi-step decision the student must justify.",
  },
  {
    name: "Error detective",
    subjects: math,
    bands: ["junior", "intermediate"],
    kinds: practiceKinds,
    plan:
      "Section 1 is quick practice. Section 2 shows a fictional student's worked solutions (as the question prompts), some with a common mistake: students decide if each is correct, find the error and fix it. Section 3 asks students to solve a similar problem themselves and explain the mistake to avoid.",
  },
  {
    name: "Data investigation",
    subjects: math,
    bands: ["primary", "junior", "intermediate"],
    kinds: practiceKinds,
    plan:
      "Section 1 presents real-looking data about Canadian students or communities in a bar graph or table. Section 2 asks students to read and compare values. Section 3 asks them to calculate (totals, differences, mean or other measures that fit the grade) and draw a conclusion they support with the data.",
  },
  {
    name: "Challenge ladder",
    subjects: math,
    bands: ["intermediate"],
    kinds: practiceKinds,
    plan:
      "Three sections titled as levels of challenge (for example Level 1: Warm-up, Level 2: On track, Level 3: Challenge). Each level is noticeably harder: Level 1 is routine practice, Level 2 has multi-step problems, Level 3 has one or two non-routine problems that need reasoning and a written justification.",
  },

  // Core French and French Immersion
  {
    name: "Picture vocabulary",
    subjects: french,
    bands: ["early", "primary"],
    kinds: practiceKinds,
    plan:
      "Section 1 shows picture cards with the French words for the theme. Section 2 matches pictures to words (matching with pictures). Section 3 uses the words in very short sentences with a word bank. Section 4 asks the child to draw and label one thing, or answer one simple question about themselves.",
  },
  {
    name: "Rule, practise, write",
    subjects: french,
    bands: ["primary", "junior", "intermediate"],
    kinds: practiceKinds,
    plan:
      "Section 1 opens with a rule box (the rule, a conjugation or pattern, and two examples), then fill-in practice with the verb or word in brackets. Section 2 is error correction: sentences with one mistake each to rewrite correctly. Section 3 is a short writing task that must use the structure, with clear success criteria.",
  },
  {
    name: "Petite histoire",
    subjects: french,
    bands: ["primary", "junior", "intermediate"],
    kinds: practiceKinds,
    plan:
      "Section 1 is a short original story or message in French that uses the topic's structures many times. Section 2 has true or false and comprehension questions. Section 3 asks students to find examples of the grammar point in the text and change them (another person, tense or number). Section 4 is a short personal response.",
  },
  {
    name: "Dialogue",
    subjects: french,
    bands: ["junior", "intermediate"],
    kinds: practiceKinds,
    plan:
      "Section 1 is a realistic dialogue (at a café, planning a weekend, a phone call) as a passage. Section 2 asks comprehension questions. Section 3 completes a second dialogue with missing words or lines. Section 4 asks students to write their own short dialogue using the target vocabulary or grammar.",
  },
  {
    name: "Mission",
    subjects: french,
    bands: ["junior", "intermediate"],
    kinds: practiceKinds,
    plan:
      "Give the worksheet a real task in French (plan a class party, prepare a trip to Québec, design a healthy menu…). Each section is a step of the mission that practises the topic's vocabulary or grammar, ending with a short written product (an invitation, an itinerary, a message).",
  },

  // Social Studies, History and Geography
  {
    name: "Community walk",
    subjects: ["social-studies"],
    bands: ["early", "primary"],
    kinds: practiceKinds,
    plan:
      "Section 1 shows a grid map of a small community with pictures (school, park, store, house…) and a compass if it fits the grade; questions ask where things are and how to get there. Section 2 uses picture cards to sort or match (needs and wants, community helpers, then and now). Section 3 asks the child to draw or write one or two sentences about their own life.",
  },
  {
    name: "Then and now",
    subjects: ["social-studies", "history"],
    bands: ["early", "primary", "junior"],
    kinds: practiceKinds,
    plan:
      "Compare life in the past with life today for the topic. Section 1 gives short facts about the past (passage or table). Section 2 sorts or compares past and present (matching, true or false). Section 3 asks what changed, what stayed the same and why, in a short written answer.",
  },
  {
    name: "Source detective",
    subjects: social,
    bands: ["junior", "intermediate"],
    kinds: practiceKinds,
    plan:
      "Section 1 is an original passage written like a primary source from the period or place (a letter, diary entry, newspaper notice or speech), clearly labelled as an illustrative example. Section 2 asks sourcing questions: who wrote it, when, why and for whom. Section 3 asks what the source shows and what it leaves out. Section 4 is a longer response about perspective or significance.",
  },
  {
    name: "Data and map analysis",
    subjects: ["geography", "social-studies"],
    bands: ["junior", "intermediate"],
    kinds: practiceKinds,
    plan:
      "Section 1 presents real, rounded data (with year and source) in a table or bar graph, or a grid map. Section 2 asks students to read and compare values. Section 3 asks them to identify a pattern and explain the reasons for it. Section 4 asks them to suggest and justify a sustainable solution or prediction.",
  },
  {
    name: "Cause and consequence",
    subjects: ["history", "social-studies"],
    bands: ["junior", "intermediate"],
    kinds: practiceKinds,
    plan:
      "Section 1 gives a short account of the event or change. Section 2 matches causes, events and consequences and puts events in order. Section 3 asks which cause was most important and which consequence lasted longest, with evidence. Include different groups' perspectives, including Indigenous perspectives where relevant.",
  },
  {
    name: "Inquiry",
    subjects: social,
    bands: ["intermediate"],
    kinds: practiceKinds,
    plan:
      "Start from an inquiry question about the topic, stated in the instructions. Section 1 gives two short sources or data sets that point in different directions. Section 2 asks students to analyze each one. Section 3 asks them to weigh the evidence and answer the inquiry question in a structured paragraph.",
  },

  // Any subject
  {
    name: "Knowledge, understanding, thinking",
    subjects: "all",
    bands: ["primary", "junior", "intermediate"],
    kinds: practiceKinds,
    plan:
      "Section 1 checks key vocabulary and facts. Section 2 checks understanding with explanations and examples. Section 3 asks students to apply or think about the topic in a new situation.",
  },
];

// Kinds of passage for reading comprehension, so passages aren't all the same.
export const passageGenres: Record<GradeBand, string[]> = {
  early: ["a short story about a child", "a simple fact page", "a friendly letter", "a short poem with rhyme"],
  primary: ["a short story", "an informational article", "a letter or postcard", "a how-to text"],
  junior: ["an informational article", "a short story", "a diary entry", "an interview", "a news report"],
  intermediate: ["a feature article", "a short story", "an opinion piece", "a diary or letter from the period", "a news report", "a speech"],
};

export function blueprintsFor(subject: SubjectId, band: GradeBand, kind: ResourceKind): Blueprint[] {
  return blueprints.filter(
    (b) =>
      (b.subjects === "all" || b.subjects.includes(subject)) && b.bands.includes(band) && b.kinds.includes(kind),
  );
}

// Picks one design at random, so two worksheets on the same topic differ.
export function pickBlueprint(
  subject: SubjectId,
  band: GradeBand,
  kind: ResourceKind,
  random: () => number = Math.random,
): Blueprint | undefined {
  const options = blueprintsFor(subject, band, kind);
  // The general design is a fallback, used only when nothing more specific fits.
  const specific = options.filter((b) => b.subjects !== "all");
  const pool = specific.length > 0 ? specific : options;
  return pool.length ? pool[Math.floor(random() * pool.length)] : undefined;
}

export function pickGenre(band: GradeBand, random: () => number = Math.random): string {
  const list = passageGenres[band];
  return list[Math.floor(random() * list.length)];
}
