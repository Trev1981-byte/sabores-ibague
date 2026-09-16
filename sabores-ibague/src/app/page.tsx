import { permanentRedirect } from "next/navigation";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";

// The site's actual home page now lives at /[ciudad] (e.g. /ibague), so
// every city can have its own. This just sends a bare visit to "/" to
// today's only city. Once there's more than one, this is the one spot
// that would start guessing a visitor's city instead of always picking
// Ibagué.
//
// Uses permanentRedirect (a 308) rather than redirect (a 307) — this isn't
// a temporary reroute, "/" is never going to render its own content, so
// search engines should permanently consolidate it into /ibague instead of
// treating both as live pages to weigh against each other.
export default function RootPage() {
  permanentRedirect(`/${DEFAULT_CITY_SLUG}`);
}
