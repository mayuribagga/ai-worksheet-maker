// The four-petal sparkle from the logo, used as decoration.
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <ellipse cx="12" cy="12" rx="3" ry="11" transform="rotate(12 12 12)" />
      <ellipse cx="12" cy="12" rx="11" ry="3" transform="rotate(12 12 12)" />
    </svg>
  );
}
