"use client";

import { useState } from "react";
import { meetsPasswordRules, passwordRules } from "@/lib/password";
import { CheckIcon } from "./Icons";
import { SubmitButton } from "./SubmitButton";

type AuthFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  pendingLabel: string;
  // true on the sign-up page: shows the password rules and checks them
  isNewPassword?: boolean;
};

// Email and password form shared by the sign-in and sign-up pages.
export function AuthForm({ action, submitLabel, pendingLabel, isNewPassword = false }: AuthFormProps) {
  const [password, setPassword] = useState("");
  const inputClass =
    "input";

  return (
    <form action={action} className="flex flex-col gap-4">
      {isNewPassword && (
        <label className="flex flex-col gap-1 text-sm text-ink">
          Name
          <input name="name" autoComplete="name" required maxLength={60} className={inputClass} />
        </label>
      )}

      <label className="flex flex-col gap-1 text-sm text-ink">
        Email
        <input name="email" type="email" autoComplete="email" required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        Password
        <input
          name="password"
          type="password"
          autoComplete={isNewPassword ? "new-password" : "current-password"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </label>

      {isNewPassword && password.length > 0 && (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm" aria-live="polite">
          {passwordRules.map((rule) => {
            const met = rule.test(password);
            return (
              <li
                key={rule.id}
                className={`flex items-center gap-2 transition-colors ${met ? "text-ink" : "text-muted"}`}
              >
                <span
                  aria-hidden
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${met ? "border-violet bg-violet text-white" : "border-lilac"}`}
                >
                  {met && <CheckIcon className="h-2.5 w-2.5" />}
                </span>
                {rule.label}
                <span className="sr-only">{met ? "(done)" : "(not yet)"}</span>
              </li>
            );
          })}
        </ul>
      )}

      <SubmitButton
        label={submitLabel}
        pendingLabel={pendingLabel}
        disabled={isNewPassword && !meetsPasswordRules(password)}
      />
    </form>
  );
}
