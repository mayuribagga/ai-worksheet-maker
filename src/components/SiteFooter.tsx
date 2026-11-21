import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

const links = [
  { href: "/library", label: "Library" },
  { href: "/generate", label: "Make a worksheet" },
  { href: "/worksheets", label: "My worksheets" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-line bg-white print:hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Image src={brand.logoSrc} alt="" width={788} height={480} className="h-9 w-auto" />
          <div>
            <p className="font-display font-bold text-ink">{brand.name}</p>
            <p className="text-sm text-muted">{brand.tagline}</p>
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="inline-block py-1.5 text-muted transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
