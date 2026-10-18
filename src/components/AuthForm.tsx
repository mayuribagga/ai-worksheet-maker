import { SubmitButton } from "./SubmitButton";

type AuthFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  pendingLabel: string;
  passwordAutoComplete: "current-password" | "new-password";
};

// Email and password form shared by the sign-in and sign-up pages.
export function AuthForm({ action, submitLabel, pendingLabel, passwordAutoComplete }: AuthFormProps) {
  const inputClass =
    "rounded-md border border-zinc-300 px-3 py-2 text-base font-normal dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Email
        <input name="email" type="email" autoComplete="email" required className={inputClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          autoComplete={passwordAutoComplete}
          minLength={6}
          required
          className={inputClass}
        />
      </label>
      <SubmitButton label={submitLabel} pendingLabel={pendingLabel} />
    </form>
  );
}
