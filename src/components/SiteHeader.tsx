import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { brand } from "@/lib/brand";
import { AuthStatus } from "./AuthStatus";

export function SiteHeader() {
  return (
    <header className="border-b-2 border-line bg-white print:hidden">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <Link href="/" aria-label={`${brand.name} home`}>
          <Image
            src={brand.logoHorizontalSrc}
            alt={brand.name}
            width={737}
            height={200}
            priority
            className="h-12 w-auto"
          />
        </Link>
        {/* Account links depend on who's signed in, so they load separately. */}
        <Suspense fallback={<div className="h-9" />}>
          <AuthStatus />
        </Suspense>
      </div>
    </header>
  );
}
