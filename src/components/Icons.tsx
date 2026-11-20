import type { SubjectId } from "@/data/curriculum";

// Small hand-drawn-style line icons, sized and coloured by their parent.
type IconProps = { className?: string };

function Svg({ className = "h-5 w-5", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

export function ChooseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="3.5" width="16" height="17" rx="3" />
      <path d="m8 9 1.6 1.6L12.5 7.7M8 15.5h8M14.5 10h1.5" />
    </Svg>
  );
}

export function SparkleWandIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m4 20 10-10M13 7l4 4" />
      <path d="M18 3v3M16.5 4.5h3M20 9v2M19 10h2M9 3.5v2M8 4.5h2" />
    </Svg>
  );
}

export function PrinterIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 8V3.5h10V8" />
      <rect x="3.5" y="8" width="17" height="8.5" rx="2.5" />
      <path d="M7 14h10v6.5H7z" />
      <path d="M17 11h.01" />
    </Svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </Svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function SubjectIcon({ subject, className }: IconProps & { subject: SubjectId }) {
  switch (subject) {
    case "math":
      return (
        <Svg className={className}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
          <path d="M8 8.5h3M9.5 7v3M13.5 8.5h3M8 15l3 0M13.5 14l3 3M16.5 14l-3 3" />
        </Svg>
      );
    case "french":
      return (
        <Svg className={className}>
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z" />
          <path d="M8.5 9.5h7M8.5 12.5h4" />
        </Svg>
      );
    case "science":
      return (
        <Svg className={className}>
          <path d="M9.5 3.5h5M10.5 3.5v6L5 18.5a1.5 1.5 0 0 0 1.3 2.2h11.4a1.5 1.5 0 0 0 1.3-2.2L13.5 9.5v-6" />
          <path d="M7.5 15h9" />
        </Svg>
      );
    default:
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5Z" />
        </Svg>
      );
  }
}
