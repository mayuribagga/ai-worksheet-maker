export type StatusSearchParams = Promise<{ error?: string; message?: string }>;

// Shows an error or success message passed in the URL, e.g. /login?error=...
export async function StatusMessage({ searchParams }: { searchParams: StatusSearchParams }) {
  const { error, message } = await searchParams;

  return (
    <>
      {error && (
        <p className="alert alert-error">
          {error}
        </p>
      )}
      {message && (
        <p className="alert alert-success">
          {message}
        </p>
      )}
    </>
  );
}
