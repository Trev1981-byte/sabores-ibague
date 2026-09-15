"use client";

import { createElement, type MouseEvent } from "react";
import { useRouter } from "next/navigation";

/**
 * A "back" link that actually goes back — it uses the browser's own
 * history instead of a fixed destination, so someone who tapped in from a
 * category page (or a search result) lands back on that exact page,
 * scroll position and all, instead of always being bounced to the city
 * home page. Only falls through to `fallbackHref` when there's nowhere to
 * go back to — a shared link opened fresh, a new tab, a search-engine
 * click straight into the restaurant page.
 *
 * Built with createElement instead of JSX on purpose: a plain-text paste
 * of this file kept losing its opening tag somewhere between GitHub's
 * editor and the clipboard, and createElement sidesteps that since there
 * is no literal angle-bracket tag anywhere in this file to lose.
 */
export function BackLink({
  fallbackHref,
  label,
}: {
  fallbackHref: string;
  label: string;
}) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  }

  return createElement(
    "a",
    { href: fallbackHref, className: "back-link", onClick: handleClick },
    label
  );
}
