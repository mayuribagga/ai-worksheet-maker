import Image from "next/image";
import { Suspense } from "react";
import { HeroActions } from "@/components/HeroActions";
import { Sparkle } from "@/components/Sparkle";
import { brand } from "@/lib/brand";

const steps = [
  { title: "Pick a topic", text: "Choose a grade, subject and topic from the Ontario curriculum." },
  { title: "Generate", text: "Get a worksheet with questions written for that grade." },
  { title: "Print", text: "Print it or save it as a PDF, with the answer key on its own page." },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16">
      <section className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-6">
          <p className="flex w-fit items-center gap-2 rounded-full bg-lilac/40 px-3 py-1 text-sm text-ink">
            <Sparkle className="h-4 w-4 text-orchid" />
            Kindergarten to Grade 8 · Ontario curriculum
          </p>
          <h1 className="font-display text-5xl font-black leading-tight tracking-tight text-ink">
            Custom worksheets for every lesson
          </h1>
          <p className="text-lg text-muted">
            Math, French, Science and Social Studies worksheets, made in seconds and matched
            to the topic you&apos;re teaching, with an answer key every time.
          </p>
          {/* Buttons depend on who's signed in, so they load separately. */}
          <Suspense fallback={<div className="h-14" />}>
            <HeroActions />
          </Suspense>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <Image
            src={brand.logoSrc}
            alt=""
            width={768}
            height={480}
            priority
            className="h-auto w-full"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="card flex flex-col gap-2 p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet text-white">
              {i + 1}
            </span>
            <h2 className="font-display text-xl font-bold text-ink">{step.title}</h2>
            <p className="text-sm text-muted">{step.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
