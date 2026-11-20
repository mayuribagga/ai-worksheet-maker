import Image from "next/image";
import type { ReactNode } from "react";
import { brand } from "@/lib/brand";
import type { Worksheet } from "@/lib/worksheet";
import { Sparkle } from "./Sparkle";

const letters = ["A", "B", "C", "D"];

// A worksheet laid out for printing on Letter paper:
// page 1 is the worksheet, page 2 is the answer key.
export function PrintableWorksheet({ worksheet, label }: { worksheet: Worksheet; label: string }) {
  return (
    <div className="flex flex-col items-center gap-8 print:block">
      <Sheet label={label} pageLabel="Worksheet">
        <h1 className="font-display text-3xl font-black tracking-tight text-ink">{worksheet.title}</h1>
        <p className="mt-1">{worksheet.instructions}</p>
        <p className="mt-4 text-sm">
          Name: ______________________________ Date: _______________
        </p>

        <ol className="mt-8 flex flex-col gap-7">
          {worksheet.questions.map((question, i) => (
            <li key={i} className="break-inside-avoid">
              <p className="">
                {i + 1}. {question.prompt}
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5 pl-5">
                {question.choices.map((choice, j) => (
                  <li key={j} className="flex gap-2">
                    <span aria-hidden className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded-full border-2 border-violet" />
                    <span>
                      {letters[j]}. {choice}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Sheet>

      <Sheet label={label} pageLabel="Answer key" newPage>
        <h1 className="font-display text-3xl font-black tracking-tight text-ink">Answer key</h1>
        <p className="mt-1">{worksheet.title}</p>

        <ol className="mt-8 flex flex-col gap-4">
          {worksheet.questions.map((question, i) => (
            <li key={i} className="break-inside-avoid">
              <p>
                <span className="text-ink">
                  {i + 1}. {letters[question.answerIndex]}
                </span>{" "}
                — {question.choices[question.answerIndex]}
              </p>
              <p className="mt-0.5 pl-5 text-sm text-muted">{question.explanation}</p>
            </li>
          ))}
        </ol>
      </Sheet>
    </div>
  );
}

// One printed page with the branded header and footer.
function Sheet({
  label,
  pageLabel,
  newPage = false,
  children,
}: {
  label: string;
  pageLabel: string;
  newPage?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`flex min-h-[11in] w-full max-w-[8.5in] flex-col bg-white p-[0.6in] text-text shadow-lg shadow-violet/10 print:min-h-0 print:max-w-none print:p-0 print:shadow-none ${newPage ?"break-before-page" : ""}`}
    >
      <header className="flex items-center justify-between gap-4 border-b-2 border-ink pb-3">
        <div>
          <Image
            src={brand.logoHorizontalSrc}
            alt={brand.name}
            width={737}
            height={200}
            className="h-12 w-auto"
          />
          <p className="mt-1 text-xs text-muted">{brand.tagline}</p>
        </div>
        <p className="text-right text-xs text-muted">{label}</p>
      </header>

      <div className="flex-1 py-8">{children}</div>

      <footer className="flex justify-between border-t-2 border-line pt-2 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <Sparkle className="h-3 w-3 text-blush" />
          {brand.footer}
        </span>
        <span>{pageLabel}</span>
      </footer>
    </section>
  );
}
