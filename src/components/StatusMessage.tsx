export type StatusSearchParams = Promise<{ error?: string; message?: string }>;

// Shows an error or success message passed in the URL, e.g. /login?error=...
export async function StatusMessage({ searchParams }: { searchParams: StatusSearchParams }) {
  const { error, message } = await searchParams;

  return (
    <>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          {message}
        </p>
      )}
    </>
  );
}
