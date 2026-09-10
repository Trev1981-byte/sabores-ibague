// The list of cities Colcocina covers. Ibagué is the only one live today —
// adding a new city later is just one more line here, plus giving it some
// approved restaurants in Supabase whose `city` column matches `name`
// exactly. Nothing about the routing, the queries, or the page code needs
// to change when that day comes.
export type CityInfo = {
  /** Used in the URL — lowercase, no accents/spaces (e.g. "ibague"). */
  slug: string;
  /** The real name, as stored in Supabase's `restaurants.city` column and
   *  shown to people (e.g. "Ibagué"). */
  name: string;
  department: string;
};

export const CITIES: CityInfo[] = [
  { slug: "ibague", name: "Ibagué", department: "Tolima" },
];

// Where "/" sends people for now, since there's only one city. Once a
// second city exists, this is the one line that would change to make
// visitor's-IP-based detection choose between them instead of always
// landing on Ibagué.
export const DEFAULT_CITY_SLUG = "ibague";

export function getCityBySlug(slug: string): CityInfo | undefined {
  return CITIES.find((c) => c.slug === slug);
}
