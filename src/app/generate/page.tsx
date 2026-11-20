import { GenerateForm } from "./GenerateForm";

export default function GeneratePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="page-title">Generate a worksheet</h1>
      <p className="text-muted">
        Choose a grade, subject and topic from the Ontario curriculum.
      </p>
      <GenerateForm />
    </main>
  );
}
