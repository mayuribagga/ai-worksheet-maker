"use client";

import { useState } from "react";
import { meetsPasswordRules, passwordRules } from "@/lib/password";
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
        <ul className="flex flex-col gap-1 text-sm" aria-live="polite">
          {passwordRules.map((rule) => {
            const met = rule.test(password);
            return (
              <li
                key={rule.id}
                className={met ? "text-green-700" : "text-muted"}
              >
                {met ? "✓" : "○"} {rule.label}
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
