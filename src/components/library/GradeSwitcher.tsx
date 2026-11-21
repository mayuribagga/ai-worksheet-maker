import Link from "next/link";
import { grades, libraryHref, subjectsForGrade } from "@/data/curriculum";

// A row of grade numbers for jumping between grades. On a subject page, it
// keeps the subject when that grade has it, and goes to the grade otherwise.
export function GradeSwitcher({ current, subject }: { current: number; subject?: string }) {
  return (
    <nav aria-label="Grades" className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-sm text-muted">Grade</span>
      {grades.map((grade) => {
        const keepsSubject = subject && subjectsForGrade(grade, "library").includes(subject as never);
        return (
          <Link
            key={grade}
            href={libraryHref(grade, keepsSubject ? subject : undefined)}
            aria-current={grade === current ? "page" : undefined}
            aria-label={`Grade ${grade}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-line bg-white font-display text-ink transition-[border-color,background-color,transform] hover:-translate-y-px hover:border-lilac aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-white"
          >
            {grade}
          </Link>
        );
      })}
    </nav>
  );
}
