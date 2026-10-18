// Password rules shown on the sign-up page.
// Keep these in sync with the Supabase setting:
// Authentication → Sign In / Providers → Email → Password requirements.
export const passwordRules = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "lower", label: "A lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "upper", label: "An uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "number", label: "A number", test: (p: string) => /[0-9]/.test(p) },
];

export function meetsPasswordRules(password: string) {
  return passwordRules.every((rule) => rule.test(password));
}
