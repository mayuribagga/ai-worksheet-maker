import Link from "next/link";

// Shown for pages that don't exist, like a mistyped address.
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-5 py-20 text-center">
      <p aria-hidden className="font-display text-6xl font-black text-violet">
        404
      </p>
      <h1 className="page-title">This page isn&apos;t here</h1>
      <p className="text-muted">The link may be mistyped, or the page may have moved.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/library" className="btn-primary">
          Browse the library
        </Link>
        <Link href="/" className="btn-secondary">
          Go to the home page
        </Link>
      </div>
    </main>
  );
}
