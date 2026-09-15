"use client";

import { useRouter } from "next/navigation";

/**
 * A "back" link that actually goes back — it uses the browser's own
 * history instead of a fixed destination, so someone who tapped in from a
 * category page (or a search result) lands back on that exact page,
 * scroll position and all, instead of always being bounced to the city
 * home page. Only falls through to `fallbackHref` when there's nowhere to
 * go back to — a shared link opened fresh, a new tab, a search-engine
 * click straight into the restaurant page.
 */
export function BackLink({
  fallbackHref,
  label,
}: {
  fallbackHref: string;
  label: string;
}) {
  const router = useRouter();

  return (
    
      href={fallbackHref}
      className="back-link"
      onClick={(e) => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          e.preventDefault();
          router.back();
        }
      }}
    >
      {label}
    </a>
  );
}
