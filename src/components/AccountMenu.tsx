"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { signOut } from "@/app/login/actions";
import { useDismiss } from "./useDismiss";

// The round account button in the header, with the signed-in user's links.
export function AccountMenu({ email, name }: { email: string; name: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="account-menu"
        aria-label={`Account menu for ${email}`}
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2 rounded-full p-0.5 pr-1 text-ink transition-colors hover:bg-paper sm:pr-3"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-lilac bg-lilac/60 font-display text-base font-bold uppercase transition-colors group-hover:border-violet group-aria-expanded:border-violet">
          {name[0]}
        </span>
        {/* The email shows beside the circle, except on very narrow phones. */}
        <span className="hidden max-w-56 truncate text-sm sm:inline">{email}</span>
        <span aria-hidden className="hidden text-xs text-muted sm:inline">
          ▾
        </span>
      </button>

      {open && (
        <div
          id="account-menu"
          className="card absolute top-full right-0 z-20 mt-2 flex w-64 origin-top-right animate-pop flex-col p-2 shadow-[0_12px_30px_-12px_rgb(24_0_173/0.3)]"
        >
          <div className="border-b-2 border-line px-3 pt-1 pb-3">
            <p className="truncate text-ink" title={name}>
              {name}
            </p>
            <p className="truncate text-xs text-muted" title={email}>
              {email}
            </p>
          </div>
          <Link
            href="/worksheets"
            onClick={close}
            className="mt-2 rounded-xl px-3 py-2.5 text-text transition-colors hover:bg-paper"
          >
            My worksheets
          </Link>
          <Link href="/generate" onClick={close} className="rounded-xl px-3 py-2.5 text-text transition-colors hover:bg-paper">
            Make a worksheet
          </Link>
          <form action={signOut} className="mt-1 border-t-2 border-line pt-2">
            <button
              type="submit"
              className="w-full rounded-xl px-3 py-2.5 text-left text-text transition-colors hover:bg-paper"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
