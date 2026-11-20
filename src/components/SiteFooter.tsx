import { brand } from "@/lib/brand";
import { Sparkle } from "./Sparkle";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-line bg-white print:hidden">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-2 px-6 py-5 text-sm text-muted">
        <Sparkle className="h-4 w-4 text-blush" />
        <span>
          {brand.name} · {brand.tagline}
        </span>
      </div>
    </footer>
  );
}
