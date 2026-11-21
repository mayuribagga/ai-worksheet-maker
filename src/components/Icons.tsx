import type { ResourceKind } from "@/data/resource-kinds";
import type { SubjectId } from "@/data/subjects";

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
    case "french-immersion":
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
    case "history":
      // An hourglass.
      return (
        <Svg className={className}>
          <path d="M6.5 3.5h11M6.5 20.5h11M8 3.5v2.8a4 4 0 0 0 1.6 3.2L12 12l2.4-2.5A4 4 0 0 0 16 6.3V3.5M8 20.5v-2.8a4 4 0 0 1 1.6-3.2L12 12l2.4 2.5a4 4 0 0 1 1.6 3.2v2.8" />
        </Svg>
      );
    case "social-studies":
      // Two people side by side: community.
      return (
        <Svg className={className}>
          <circle cx="8.5" cy="8" r="2.75" />
          <circle cx="16" cy="9" r="2.25" />
          <path d="M3.5 19a5 5 0 0 1 10 0M13.5 15.2a4.2 4.2 0 0 1 7 3.3" />
        </Svg>
      );
    default:
      // A globe, for Geography.
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5Z" />
        </Svg>
      );
  }
}

// One icon per kind of resource, for the library's resource cards.
export function KindIcon({ kind, className }: IconProps & { kind: ResourceKind }) {
  switch (kind) {
    case "worksheet":
      return (
        <Svg className={className}>
          <path d="M6.5 3.5h8l3 3v14h-11z" />
          <path d="M9 10h6M9 13.5h6M9 17h4" />
        </Svg>
      );
    case "practice":
      return (
        <Svg className={className}>
          <path d="m14.5 5.5 4 4L9 19H5v-4z" />
          <path d="m12.5 7.5 4 4" />
        </Svg>
      );
    case "quiz":
      return (
        <Svg className={className}>
          <path d="m4.5 7 1.5 1.5 3-3M4.5 15l1.5 1.5 3-3" />
          <path d="M12 7.5h7.5M12 15.5h7.5" />
        </Svg>
      );
    case "test":
      return (
        <Svg className={className}>
          <path d="M9 4.5H6.5v16h11v-16H15" />
          <path d="M9 3.5h6v2.5H9zM9.5 11.5l1.75 1.75 3.25-3.5M9.5 17h5" />
        </Svg>
      );
    case "notes":
      return (
        <Svg className={className}>
          <path d="M6 3.5h11.5v17H6a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 6 3.5z" />
          <path d="M8.5 8h6M8.5 11.5h6M8 3.5v17" />
        </Svg>
      );
    case "reading":
      return (
        <Svg className={className}>
          <path d="M12 6.5c-1.8-1.4-4.5-2-8-2v13c3.5 0 6.2.6 8 2 1.8-1.4 4.5-2 8-2v-13c-3.5 0-6.2.6-8 2z" />
          <path d="M12 6.5v13" />
        </Svg>
      );
  }
}

export function DownloadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" />
    </Svg>
  );
}
