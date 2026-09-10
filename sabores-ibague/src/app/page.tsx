import { redirect } from "next/navigation";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";

// The site's actual home page now lives at /[ciudad] (e.g. /ibague), so
// every city can have its own. This just sends a bare visit to "/" to
// today's only city. Once there's more than one, this is the one spot
// that would start guessing a visitor's city instead of always picking
// Ibagué.
export default function RootPage() {
  redirect(`/${DEFAULT_CITY_SLUG}`);
}
