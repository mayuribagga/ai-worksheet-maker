import { renderToBuffer } from "@react-pdf/renderer";
import { describe, expect, it } from "vitest";
import { samples } from "@/data/samples";
import { pdfFileName, WorksheetPdf } from "./WorksheetPdf";

describe("WorksheetPdf", () => {
  it.each(samples)("renders the $id sample as a PDF with an answer key", async (sample) => {
    const pdf = await renderToBuffer(<WorksheetPdf worksheet={sample.worksheet} meta={sample.meta} />);
    const text = pdf.toString("latin1");
    expect(text.startsWith("%PDF-")).toBe(true);
    // At least the worksheet page and the answer key page.
    const pages = Number(/\/Type \/Pages[\s\S]*?\/Count (\d+)/.exec(text)?.[1]);
    expect(pages).toBeGreaterThanOrEqual(2);
    // The brand fonts are embedded, so accents print the same everywhere.
    expect(text).toMatch(/Sniglet/);
    expect(text).toMatch(/Fraunces/);
  });

  it("names the file after the grade, subject, topic and kind", () => {
    const math = samples.find((s) => s.id === "math")!;
    const french = samples.find((s) => s.id === "french")!;
    expect(pdfFileName(math.worksheet, math.meta)).toBe("grade-4-mathematics-fractions-worksheet.pdf");
    expect(pdfFileName(french.worksheet, { ...french.meta, kind: "quiz" })).toBe(
      "grade-5-core-french-common-irregular-verbs-quiz.pdf",
    );
  });
});
