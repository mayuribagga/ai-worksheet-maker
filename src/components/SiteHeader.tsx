import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { brand } from "@/lib/brand";
import { AuthStatus } from "./AuthStatus";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-line bg-white/90 backdrop-blur-md print:hidden">
      {/* Wide screens: logo, links, then account on the right, in one row.
          Tablets: logo, then account and Menu on the right.
          Phones: logo and Menu on top, account underneath. */}
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-2.5 sm:px-6">
        <Link href="/" aria-label={`${brand.name} home`}>
          <Image
            src={brand.logoHorizontalSrc}
            alt={brand.name}
            width={737}
            height={200}
            priority
            className="h-11 w-auto"
          />
        </Link>
        <SiteNav />
        {/* Account links depend on who's signed in, so they load separately. */}
        <div className="flex w-full sm:ml-auto sm:w-auto lg:ml-0">
          <Suspense fallback={<div className="h-9" />}>
            <AuthStatus />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
