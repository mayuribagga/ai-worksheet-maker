import { describe, expect, it } from "vitest";
import { findTopic, grades, worksheetSubjects, subjectsForGrade } from "@/data/curriculum";
import { resourceKindOrder } from "@/data/resource-kinds";
import { samples } from "@/data/samples";
import { fixtures } from "./__fixtures__/worksheets";
import { drawVisual } from "@/components/worksheet/visual-geometry";
import { bandProfiles, gradeBand } from "./grade-bands";
import { checkGradeFit, checkVisual, parseWorksheet, type Visual, type Worksheet } from "./worksheet";
import { blueprintsFor, pickBlueprint } from "./worksheet-blueprints";
import { buildRequest } from "./worksheet-prompt";

describe("grade bands", () => {
  it("groups the grades the way Ontario classrooms do", () => {
    expect(grades.map(gradeBand)).toEqual(["early", "early", "primary", "junior", "junior", "junior", "intermediate", "intermediate"]);
  });

  it("asks for longer, harder resources as grades go up", () => {
    const order = ["early", "primary", "junior", "intermediate"] as const;
    for (let i = 1; i < order.length; i++) {
      const younger = bandProfiles[order[i - 1]];
      const older = bandProfiles[order[i]];
      expect(older.passageWords[0]).toBeGreaterThan(younger.passageWords[0]);
      expect(older.maxLines).toBeGreaterThan(younger.maxLines);
      expect(older.size.worksheet.marks[1]).toBeGreaterThan(younger.size.worksheet.marks[1]);
    }
  });
});

describe("example worksheets", () => {
  const all = [...samples.map((s) => ({ name: s.id, meta: s.meta, worksheet: s.worksheet })), ...fixtures];

  it.each(all)("$name is valid, fits its grade and uses a real topic", ({ meta, worksheet }) => {
    const result = parseWorksheet(worksheet);
    if (!("worksheet" in result)) throw new Error(result.problem);
    expect(checkGradeFit(result.worksheet, meta.grade, meta.kind)).toBeUndefined();
    expect(findTopic(meta.grade, meta.subject, meta.topicId)).toBeDefined();
  });
});

describe("checkGradeFit", () => {
  const base = (): Worksheet => ({
    title: "T",
    instructions: "I",
    sections: [
      {
        title: "S",
        instructions: "Do it.",
        questions: Array.from({ length: 8 }, () => ({
          type: "short-answer" as const,
          prompt: "Why?",
          lines: 2,
          answer: "Because.",
          marks: 1,
        })),
      },
    ],
  });

  it("refuses long written answers for Grade 1", () => {
    const sheet = base();
    sheet.sections[0].questions[0] = { type: "long-answer", prompt: "Explain.", lines: 6, answer: "…", marks: 3 };
    expect(checkGradeFit(sheet, 1, "worksheet")).toMatch(/lines|long answers/);
    expect(checkGradeFit(sheet, 7, "worksheet")).toBeUndefined();
  });

  it("refuses a worksheet that's far too long for young students", () => {
    const sheet = base();
    sheet.sections[0].questions = Array.from({ length: 20 }, () => sheet.sections[0].questions[0]);
    expect(checkGradeFit(sheet, 2, "worksheet")).toMatch(/20 questions/);
  });

  it("checks the passage length for the grade", () => {
    const sheet = base();
    const long = Array.from({ length: 450 }, () => "word").join(" ");
    sheet.sections[0].stimulus = { kind: "passage", title: "P", paragraphs: [long] };
    expect(checkGradeFit(sheet, 1, "worksheet")).toMatch(/passage has 450 words/);
    expect(checkGradeFit(sheet, 8, "worksheet")).toBeUndefined();
  });
});

describe("checkVisual", () => {
  it.each<[Visual, RegExp]>([
    [{ kind: "fraction", model: "bar", parts: 4, shaded: 5 }, /more parts/],
    [{ kind: "number-line", start: 0, end: 10, step: 3 }, /divide evenly/],
    [{ kind: "number-line", start: 0, end: 100, step: 1 }, /at most 20 steps/],
    [{ kind: "number-line", start: 0, end: 10, step: 1, marked: [12] }, /on the number line/],
    [{ kind: "bar-graph", title: "G", categories: ["A", "B"], values: [1], valueLabel: "n" }, /one value per category/],
    [{ kind: "grid-map", title: "M", columns: 3, rows: 3, places: [{ label: "Far", column: 5, row: 1 }] }, /outside the grid/],
    [
      { kind: "pictures", groups: [{ picture: "apple", count: 2 }, { picture: "apple", count: 5 }], operator: "-" },
      /take away more/,
    ],
  ])("rejects an impossible %s", (visual, problem) => {
    expect(checkVisual(visual)).toMatch(problem);
  });

  it("accepts sensible drawings and draws them", () => {
    const visuals: Visual[] = [
      { kind: "ten-frame", filled: 13 },
      { kind: "number-line", start: 0, end: 1, step: 0.25, marked: [0.75] },
      { kind: "fraction", model: "circle", parts: 6, shaded: 2 },
      { kind: "bar-graph", title: "Pets", categories: ["Cats", "Dogs"], values: [4, 7], valueLabel: "Students" },
      { kind: "clock", hour: 9, minute: 45 },
      { kind: "grid-map", title: "Town", columns: 4, rows: 4, places: [{ label: "School", picture: "school", column: 2, row: 3 }], compass: true },
      { kind: "shapes", shapes: ["triangle", "hexagon"], labelled: true },
    ];
    for (const visual of visuals) {
      expect(checkVisual(visual)).toBeUndefined();
      const drawing = drawVisual(visual as Exclude<Visual, { kind: "pictures" } | { kind: "picture-cards" }>);
      expect(drawing.prims.length).toBeGreaterThan(0);
      expect(drawing.description).not.toBe("");
    }
  });

  it("describes a clock's time for screen readers", () => {
    expect(drawVisual({ kind: "clock", hour: 9, minute: 5 }).description).toBe("Analog clock showing 9:05");
  });
});

describe("worksheet designs", () => {
  it("has a design for every grade and library subject", () => {
    for (const grade of grades) {
      for (const subject of subjectsForGrade(grade, "library")) {
        expect(blueprintsFor(subject, gradeBand(grade), "worksheet").length, `Grade ${grade} ${subject}`).toBeGreaterThan(0);
      }
    }
  });

  it("offers several designs, so worksheets don't all look the same", () => {
    expect(blueprintsFor("math", "junior", "worksheet").length).toBeGreaterThanOrEqual(4);
    expect(blueprintsFor("french", "junior", "worksheet").length).toBeGreaterThanOrEqual(3);
    const picks = new Set(Array.from({ length: 10 }, (_, i) => pickBlueprint("math", "junior", "worksheet", () => i / 10)?.name));
    expect(picks.size).toBeGreaterThanOrEqual(4);
  });

  it("only uses young-children designs for young children", () => {
    expect(blueprintsFor("math", "intermediate", "worksheet").map((b) => b.name)).not.toContain("Picture math");
    expect(blueprintsFor("math", "early", "worksheet").map((b) => b.name)).not.toContain("Challenge ladder");
  });
});

describe("buildRequest for different grades", () => {
  const request = (grade: number, subject: (typeof worksheetSubjects)[number], topicId: string, kind = "worksheet" as const) =>
    buildRequest({ grade, subject, topic: findTopic(grade, subject, topicId)!, kind, random: () => 0 });

  it("describes a young child for Grade 1 and asks for pictures", () => {
    const text = request(1, "math", "adding-and-subtracting-to-20");
    expect(text).toContain("6- or 7-year-old");
    expect(text).toContain("whole numbers to 50");
    expect(text).toContain('Design for this one ("Picture math")');
  });

  it("describes a teenager for Grade 8 and asks for analysis", () => {
    const text = request(8, "history", "confederation");
    expect(text).toContain("12- or 13-year-old");
    expect(text).toMatch(/analysis and evaluation/);
    expect(text).not.toContain("Picture math");
  });

  it("changes Core French instruction language by grade", () => {
    expect(request(2, "french", "food-and-drinks")).toContain("simple English");
    expect(request(4, "french", "present-tense-of-er-verbs")).toContain("English translation in brackets");
    expect(request(8, "french", "passe-compose")).toContain("Write everything students read in French.");
  });

  it("sizes reading passages for the grade", () => {
    expect(request(2, "social-studies", "family-histories-and-traditions", "reading" as never)).toContain("60 to 130 words");
    expect(request(8, "geography", "global-settlement-patterns", "reading" as never)).toContain("400 to 550 words");
  });

  it("lists every resource kind's length for each band", () => {
    for (const band of ["early", "primary", "junior", "intermediate"] as const) {
      for (const kind of resourceKindOrder) {
        const { questions, marks } = bandProfiles[band].size[kind];
        expect(questions[0]).toBeLessThanOrEqual(questions[1]);
        expect(marks[0]).toBeLessThanOrEqual(marks[1]);
      }
    }
  });
});
