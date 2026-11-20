"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useRef, useState } from "react";
import { useDismiss } from "./useDismiss";

const links = [
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

// Main site links: a row on wide screens, a Menu button on narrow ones.
export function SiteNav() {
  // The current page is only known when a request comes in, so the links are
  // first built without the underline, then the underline is added per page.
  return (
    <Suspense fallback={<NavLinks pathname={null} />}>
      <CurrentPageNav />
    </Suspense>
  );
}

function CurrentPageNav() {
  return <NavLinks pathname={usePathname()} />;
}

function NavLinks({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(menuRef, open, close);

  return (
    <>
      <nav aria-label="Main" className="mr-auto hidden items-center gap-1 lg:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
            className="rounded-full px-3.5 py-1.5 text-sm text-text transition-colors hover:bg-paper hover:text-ink aria-[current=page]:bg-lilac/35 aria-[current=page]:text-ink"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div ref={menuRef} className="relative ml-auto sm:order-last sm:ml-0 lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
          className="btn-secondary"
        >
          {open ? "Close" : "Menu"}
        </button>
        {open && (
          <nav
            id="mobile-menu"
            aria-label="Main"
            className="card absolute top-full right-0 z-20 mt-2 flex w-52 origin-top-right animate-pop flex-col p-2 shadow-[0_12px_30px_-12px_rgb(24_0_173/0.3)]"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                aria-current={pathname === link.href ? "page" : undefined}
                className="rounded-xl px-3 py-2.5 text-text transition-colors hover:bg-paper aria-[current=page]:bg-lilac/35 aria-[current=page]:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
