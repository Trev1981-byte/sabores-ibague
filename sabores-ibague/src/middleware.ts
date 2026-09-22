import { NextRequest, NextResponse, NextFetchEvent } from "next/server";
import { supabase } from "@/lib/supabase";

// Runs once per real page view and records the visitor's city — this is
// what the admin stats page uses to answer "is my ad actually reaching
// Ibagué" without needing GA4 or UTM tags on every ad.
//
// The city/region/country values come from Vercel's own edge network,
// which stamps every request with x-vercel-ip-* headers based on the
// visitor's IP — the same method GA4 uses under the hood, just read
// directly instead of dug out of a Google dashboard. These headers only
// exist on a real Vercel deployment; locally (`next dev`) they're always
// empty, which is expected, not a bug.
export function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  // Don't log visits to the private admin/internal pages themselves —
  // nobody needs "the admin visited the admin page" cluttering the data.
  if (
    pathname.startsWith("/nuevo-") ||
    pathname.startsWith("/revisar-") ||
    pathname.startsWith("/estadisticas-")
  ) {
    return NextResponse.next();
  }

  const rawCity = request.headers.get("x-vercel-ip-city");
  const rawRegion = request.headers.get("x-vercel-ip-country-region");
  const country = request.headers.get("x-vercel-ip-country");
  const referrer = request.headers.get("referer");

  // Vercel URL-encodes these (accented city names come through as
  // "Ibagu%C3%A9"), so decode before storing.
  const city = rawCity ? decodeURIComponent(rawCity) : null;
  const region = rawRegion ? decodeURIComponent(rawRegion) : null;

  // waitUntil lets this write finish in the background instead of
  // delaying the response the visitor is waiting for — same
  // fire-and-forget spirit as the click/impression logging elsewhere in
  // the app, just done here because middleware doesn't have access to
  // Next's after().
  event.waitUntil(
    (async () => {
      const { error } = await supabase.rpc("log_page_visit", {
        p_path: pathname,
        p_city: city ?? undefined,
        p_region: region ?? undefined,
        p_country: country ?? undefined,
        p_referrer: referrer ?? undefined,
      });
      if (error) {
        console.error("log_page_visit failed:", error.message);
      }
    })()
  );

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Every real page, skipping static assets, images, and Next's own
    // internals — those aren't pages a visitor "arrived" at.
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml)$).*)",
  ],
};
