import { GenerateForm } from "./GenerateForm";

export default function GeneratePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Generate a worksheet</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Grade 4 Math · Fractions · Multiple choice
      </p>
      <GenerateForm />
    </main>
  );
}
