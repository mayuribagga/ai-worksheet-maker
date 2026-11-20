import Image from "next/image";
import type { ReactNode } from "react";
import { subjectSummaries } from "@/data/curriculum";
import { brand } from "@/lib/brand";
import { CheckIcon } from "./Icons";
import { Sparkle } from "./Sparkle";

const topicCount = subjectSummaries().reduce((sum, s) => sum + s.topicCount, 0);

const perks = [
  `Worksheets for ${topicCount} Ontario curriculum topics`,
  "Every worksheet saved to your account",
  "Print-ready, with an answer key",
];

// Sign in and sign up: the form beside a panel about what an account gives you.
export function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 items-stretch gap-0 px-5 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
      <aside className="dotted relative hidden flex-col justify-center gap-8 overflow-hidden rounded-l-3xl border-2 border-r-0 border-line bg-paper p-10 lg:flex">
        <Sparkle className="absolute top-8 right-10 h-7 w-7 text-blush" />
        <Image src={brand.logoSrc} alt="" width={768} height={480} className="h-20 w-auto self-start" />
        <div className="flex flex-col gap-4">
          <p className="font-display text-2xl leading-snug font-bold text-ink">
            Your worksheets, ready whenever you are.
          </p>
          <ul className="flex flex-col gap-2.5">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5 text-muted">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="card flex flex-col gap-6 p-7 sm:p-10 lg:rounded-l-none">
        <h1 className="page-title">{title}</h1>
        {children}
      </div>
    </main>
  );
}
