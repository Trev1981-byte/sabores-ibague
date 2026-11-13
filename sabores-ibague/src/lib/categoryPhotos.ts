// Photo shown on each homepage category card, by category slug.
//
// Files live in /public/categories (800x600, roughly 40-80 KB each). They
// are free-licence stock photos or photos that restaurant owners uploaded
// to Colcocina's own storage, hosted on this site. Photos taken from other
// sites (Rappi, Tripadvisor, ...) must NOT be added here.
//
// A category with no entry here falls back to its emoji/icon tile, so a
// missing photo never breaks the page. To add one: drop an 800x600 .jpg
// into /public/categories and add a line below.
export const CATEGORY_PHOTOS: Record<string, string> = {
  hamburguesas: "/categories/hamburguesas.jpg",
  perros: "/categories/perros.jpg",
  salchipapas: "/categories/salchipapas.jpg",
  empanadas: "/categories/empanadas.jpg",
  arepas: "/categories/arepas.jpg",
  desayunos: "/categories/desayunos.jpg",
  almuerzos: "/categories/almuerzos.jpg",
  pizza: "/categories/pizza.jpg",
  pollo: "/categories/pollo.jpg",
  parrilla: "/categories/parrilla.jpg",
  postres: "/categories/postres.jpg",
  tamales: "/categories/tamales.jpg",
  internacional: "/categories/internacional.jpg",
  cafe: "/categories/cafe.jpg",
  otros: "/categories/otros.jpg",
};
