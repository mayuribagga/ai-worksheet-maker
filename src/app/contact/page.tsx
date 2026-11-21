import type { Metadata } from "next";
import { SparkleWandIcon, SubjectIcon } from "@/components/Icons";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact" };

const reasons = [
  {
    icon: <SubjectIcon subject="math" className="h-5 w-5" />,
    title: "A question about a resource",
    text: "Something unclear in a lesson or activity you bought.",
  },
  {
    icon: <SparkleWandIcon className="h-5 w-5" />,
    title: "A topic or worksheet style",
    text: "Something you'd like the worksheet maker to cover.",
  },
  {
    icon: <SubjectIcon subject="french" className="h-5 w-5" />,
    title: "Feedback or a problem",
    text: "Something that didn't work, or that could work better.",
  },
];

export default function ContactPage() {
  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 items-start gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:py-16">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="page-title">Get in touch</h1>
          <p className="max-w-md text-lg text-muted">
            Hi, I&apos;m Mayuri Bagga. I create the lessons and worksheets on Mayuri Teaches. Send me a
            message and I&apos;ll reply by email.
          </p>
        </div>
        <ul className="flex flex-col gap-4">
          {reasons.map((reason) => (
            <li key={reason.title} className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lilac/35 text-ink">
                {reason.icon}
              </span>
              <div>
                <p className="font-display font-bold text-ink">{reason.title}</p>
                <p className="text-sm text-muted">{reason.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card relative p-6 shadow-[0_10px_30px_-14px_rgb(0_74_173/0.25)] sm:p-8">
        <ContactForm />
      </div>
    </main>
  );
}
