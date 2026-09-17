// SEO landing-page content for Colcocina's blog — one article per category,
// written by hand from real listings already in the database. This is
// static content (not fetched from Supabase), so adding a new article later
// is just: add one more object here, in the same shape, and it goes live at
// /<ciudad>/blog/<slug> and gets automatically cross-linked from its
// matching category page.
//
// A note on honesty: `note` for each pick is written from what's already in
// that restaurant's own listing (blurb, neighborhood, service options) —
// never a claim that the Colcocina team personally ate there unless that's
// actually true. Don't add tried/tasted claims here without confirming them
// first.

export type BlogPick = {
  name: string;
  /** Must match that restaurant's slug in Supabase — used to link to its page. */
  slug: string;
  neighborhood: string;
  priceLevel: string;
  note: string;
};

export type BlogPost = {
  slug: string;
  citySlug: string;
  categorySlug: string;
  categoryLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  introBefore: string;
  introLinkText: string;
  introAfter: string;
  picks: BlogPick[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "almuerzo-ejecutivo-economico-ibague",
    citySlug: "ibague",
    categorySlug: "almuerzos",
    categoryLabel: "Almuerzos",
    title: "Almuerzo ejecutivo económico en Ibagué: dónde comer barato y bien",
    metaTitle: "Almuerzo Ejecutivo Económico en Ibagué | Colcocina",
    metaDescription:
      "Dónde comer un buen corrientazo en Ibagué sin gastar de más — restaurantes reales, precios claros y contacto directo por WhatsApp.",
    introBefore:
      "Si trabajas en el centro de Ibagué y ya te cansaste de comer lo mismo todos los días, en el ",
    introLinkText: "directorio de almuerzos de Colcocina",
    introAfter:
      " puedes ver, en un solo lugar, los restaurantes de la ciudad que sirven un corrientazo decente sin que te toque adivinar el precio hasta que llega la cuenta. Aquí te contamos cuáles hemos ido revisando y qué los hace distintos.",
    picks: [
      {
        name: "Sipote Cazuela",
        slug: "sipote-cazuela-a957",
        neighborhood: "Centro",
        priceLevel: "$$",
        note: "En pleno centro, frente al Palacio de Justicia. El menú cambia cada día y las porciones no se quedan cortas — de los pocos en esta lista que además de atender en salón, reparte a domicilio.",
      },
      {
        name: "El Fogón Antioqueño",
        slug: "el-fogon-antioqueno-r2x7",
        neighborhood: "Centro",
        priceLevel: "$$",
        note: "También en el centro, con más peso en comida típica colombiana: fuerte en platos antioqueños, y con menú de cuaresma cuando llega la temporada.",
      },
      {
        name: "Sabor Tropical",
        slug: "sabor-tropical-70c1",
        neighborhood: "La Pola",
        priceLevel: "$$",
        note: "Un corrientazo con trayectoria en el barrio La Pola — de los que la gente del centro reconoce desde hace años, no un local recién llegado.",
      },
      {
        name: "Pachito Parrilla",
        slug: "pachito-parrilla-f600",
        neighborhood: "El Limonar",
        priceLevel: "$",
        note: "El más económico de los cuatro. Restaurante de barrio en El Limonar que medios locales han destacado por su buena presentación a precio bajo.",
      },
    ],
  },
  {
    slug: "mejores-perros-calientes-ibague",
    citySlug: "ibague",
    categorySlug: "perros",
    categoryLabel: "Perros",
    title: "Los mejores perros calientes de Ibagué",
    metaTitle: "Los Mejores Perros Calientes de Ibagué | Colcocina",
    metaDescription:
      "Los perros calientes más recomendados de Ibagué: dirección, barrio y qué los hace diferentes. Sin pauta, sin ranking pagado.",
    introBefore: "Ibagué tiene su propia cultura de perro caliente de esquina, y en el ",
    introLinkText: "directorio de perros calientes de Colcocina",
    introAfter:
      " reunimos los puntos que la gente de la ciudad más menciona — desde el clásico armado hasta las versiones gigantes que ya son casi una atracción.",
    picks: [
      {
        name: "Bulldog Hotdog",
        slug: "bulldog-hotdog-222b",
        neighborhood: "Prados del Norte",
        priceLevel: "$$",
        note: "Especializados en perros calientes gigantes — hasta el nombre del menú juega con razas de perro para marcar el tamaño. Medios locales los mencionan entre los perros más grandes de la ciudad.",
      },
      {
        name: "Factory Hot Dogs Gourmet",
        slug: "factory-hot-dogs-3c6e",
        neighborhood: "Centro",
        priceLevel: "$$",
        note: "En pleno centro, con perros calientes gourmet armables. El Nuevo Día los incluyó entre los mejores locales de comida rápida de Ibagué.",
      },
      {
        name: "Perriquísimo",
        slug: "perriquisimo-0b20",
        neighborhood: "Valparaíso",
        priceLevel: "$",
        note: "Un negocio pequeño en Valparaíso conocido por su perro caliente insignia, cargado de ingredientes. También aparece en el listado de El Nuevo Día de los mejores de comida rápida.",
      },
      {
        name: "Don Choriperro",
        slug: "don-choriperro-b7aa",
        neighborhood: "Sector Calle 33",
        priceLevel: "$",
        note: "Especializado en perros calientes y choripanes, con carta compacta. Atiende en las tardes-noches, de martes a domingo.",
      },
      {
        name: "Mi Perro Classic Hot Dogs",
        slug: "mi-perro-classic-hot-dogs-p7w2",
        neighborhood: "Centro Comercial La Estación",
        priceLevel: "$",
        note: "Dentro del Centro Comercial La Estación, con el formato clásico donde tú eliges tus propios toppings. De los pocos en esta categoría con domicilio propio.",
      },
    ],
  },
  {
    slug: "mejores-salchipapas-ibague",
    citySlug: "ibague",
    categorySlug: "salchipapas",
    categoryLabel: "Salchipapas",
    title: "Las mejores salchipapas de Ibagué",
    metaTitle: "Las Mejores Salchipapas de Ibagué | Colcocina",
    metaDescription:
      "Dónde comer las mejores salchipapas de Ibagué por barrio, con pedidos directos por WhatsApp y sin comisión de por medio.",
    introBefore: "La salchipapa es casi un deporte nacional en Ibagué, y en el ",
    introLinkText: "directorio de salchipapas de Colcocina",
    introAfter:
      " puedes ver quién las prepara en cada sector de la ciudad, con pedido directo por WhatsApp cuando el negocio lo ofrece.",
    picks: [
      {
        name: "Pottatoēss",
        slug: "pottatoess-5d9f",
        neighborhood: "Av. Guabinal (Calle 64)",
        priceLevel: "$$",
        note: "Sobre la Avenida Guabinal, atiende en horario nocturno y es de los puestos de comida callejera más mencionados en redes sociales locales. Recibe pedidos por WhatsApp y por Rappi.",
      },
      {
        name: "Papitas & Compañía",
        slug: "papitas-compania-25c0",
        neighborhood: "Ambalá",
        priceLevel: "$$",
        note: "Sobre la Avenida Ambalá, uno de los corredores gastronómicos más transitados de la ciudad. Especializado en papas con toppings.",
      },
      {
        name: "Mr. Patata",
        slug: "mr-patata-4fd8",
        neighborhood: "Jordán",
        priceLevel: "$$",
        note: "En el barrio Jordán, con papas preparadas de forma artesanal y servidas en cono. Suele aparecer en ferias gastronómicas locales.",
      },
      {
        name: "Mr Food Gourmet",
        slug: "mr-food-gourmet-t4n8",
        neighborhood: "Calle 67 #19A Bis-21",
        priceLevel: "$",
        note: "Salchipapas y hamburguesas caseras, con pedidos directos por WhatsApp — el más orientado a domicilio de los cuatro.",
      },
    ],
  },
  {
    slug: "mejores-asaderos-pollo-ibague",
    citySlug: "ibague",
    categorySlug: "pollo",
    categoryLabel: "Pollo",
    title: "Los mejores asaderos de pollo en Ibagué",
    metaTitle: "Los Mejores Asaderos de Pollo en Ibagué | Colcocina",
    metaDescription:
      "Los asaderos de pollo asado y broaster mejor calificados de Ibagué, con dirección, barrio y contacto directo por WhatsApp o teléfono.",
    introBefore:
      "El pollo asado de barrio sigue siendo el almuerzo familiar por excelencia en Ibagué. En el ",
    introLinkText: "directorio de asaderos de Colcocina",
    introAfter: " están los que la ciudad reconoce, con su barrio y forma de contacto directo.",
    picks: [
      {
        name: "Asadero ToliPollo",
        slug: "asadero-tolipollo-31f7",
        neighborhood: "El Jardín",
        priceLevel: "$$",
        note: "En el norte de la ciudad, un punto clásico de barrio para almuerzo familiar o para llevar — conocido por su pollo a la brasa y su pollo broaster.",
      },
      {
        name: "Coma Pollo",
        slug: "coma-pollo-c2b1",
        neighborhood: "Centro",
        priceLevel: "$$",
        note: "En el centro, con pollo asado y a la broaster, más opciones de churrasco y trucha. Buena rotación de domicilios.",
      },
      {
        name: "El Carnaval del Pollo",
        slug: "el-carnaval-del-pollo-fe39",
        neighborhood: "Mirolindo",
        priceLevel: "$$",
        note: "En Mirolindo, uno de los pocos con domicilio propio activo en esta categoría.",
      },
      {
        name: "Asadero Delipollo",
        slug: "asadero-delipollo-j8f0",
        neighborhood: "Topacio",
        priceLevel: "$",
        note: "En el barrio Topacio, con servicio para eventos familiares y banquetes además del pollo asado y broaster del día a día.",
      },
    ],
  },
  {
    slug: "tamal-tolimense-domicilio-ibague",
    citySlug: "ibague",
    categorySlug: "tamales",
    categoryLabel: "Tamales",
    title: "Dónde comprar tamal tolimense a domicilio en Ibagué",
    metaTitle: "Tamal Tolimense a Domicilio en Ibagué | Colcocina",
    metaDescription:
      "Dónde comprar tamal tolimense en Ibagué con domicilio real — y cuáles negocios son solo para recoger. Contacto directo, sin intermediarios.",
    introBefore:
      "El tamal tolimense es una de las cosas que Ibagué hace mejor que nadie, y varios negocios de la ciudad ya lo reparten a domicilio. En el ",
    introLinkText: "directorio de tamales de Colcocina",
    introAfter: " puedes ver cuáles sí entregan a tu casa y cuáles son solo para recoger.",
    picks: [
      {
        name: "Tamales de la Gobernación",
        slug: "tamales-de-la-gobernacion-0443",
        neighborhood: "Jordán",
        priceLevel: "$",
        note: "En la comuna Jordán, cerca de la Gobernación del Tolima. Tamal envuelto en hoja de plátano con arroz, garbanzo, carne de cerdo y pollo, al estilo clásico de la región — domicilio disponible por Rappi.",
      },
      {
        name: "Tamales de la Pola",
        slug: "tamales-de-la-pola-w4v8",
        neighborhood: "La Pola",
        priceLevel: "$",
        note: "Un clásico del barrio La Pola en el centro, muy bien calificado, con domicilio propio.",
      },
      {
        name: "Tamales de Saldaña Don Floro",
        slug: "tamales-de-saldana-don-floro-t4k9",
        neighborhood: "La Francia",
        priceLevel: "$",
        note: "De la familia Don Floro — un tamal tolimense tradicional, documentado como uno de los clásicos de la ciudad. Reparte a domicilio.",
      },
      {
        name: "Tamales Tolimenses El Boga",
        slug: "tamales-tolimenses-el-boga-b7r2",
        neighborhood: "Gaitán",
        priceLevel: "$",
        note: "En el barrio Gaitán, por porciones. A diferencia de los otros tres, este es solo para recoger — no hace domicilios.",
      },
    ],
  },
  {
    slug: "mejores-empanadas-ibague",
    citySlug: "ibague",
    categorySlug: "empanadas",
    categoryLabel: "Empanadas",
    title: "Las mejores empanadas de Ibagué",
    metaTitle: "Las Mejores Empanadas de Ibagué | Colcocina",
    metaDescription:
      "Las empanadas mejor recomendadas de Ibagué, con barrio, precio aproximado y contacto directo del negocio.",
    introBefore:
      "En cada esquina de Ibagué hay una empanada distinta, pero algunas se han ganado fama propia en la ciudad. En el ",
    introLinkText: "directorio de empanadas de Colcocina",
    introAfter: " reunimos las que más se repiten en recomendaciones locales.",
    picks: [
      {
        name: "Yel Cóctel",
        slug: "yel-coctel-155d",
        neighborhood: "Centro",
        priceLevel: "$",
        note: "Con más de cincuenta años en el centro de Ibagué, célebre por su avena helada acompañada de empanadas y limón — toda una costumbre entre oficinistas y abogados del sector.",
      },
      {
        name: "Empanadas Gourmet Toro Rojo",
        slug: "toro-rojo-empanadas-647c",
        neighborhood: "Macarena Baja",
        priceLevel: "$",
        note: "En Macarena Baja, con una propuesta más elaborada que el clásico piquete de esquina. Se ganó un puesto entre los favoritos locales en un ranking de El Nuevo Día.",
      },
      {
        name: "La Casa de la Empanada",
        slug: "la-casa-de-la-empanada-67a0",
        neighborhood: "Centro",
        priceLevel: "$",
        note: "Un local pequeño cerca de la Alcaldía, especializado en empanadas y otras frituras típicas como arepa de huevo y chicharrón. Solo para llevar, no tiene mesas.",
      },
      {
        name: "Empanadas Ricas",
        slug: "empanadas-ricas-q1z5",
        neighborhood: "Carrera 3 #8-04",
        priceLevel: "$",
        note: "Empanadas caseras muy bien calificadas por los propios ibaguereños, con jugos naturales de acompañamiento.",
      },
    ],
  },
  {
    slug: "mejores-arepas-ibague",
    citySlug: "ibague",
    categorySlug: "arepas",
    categoryLabel: "Arepas",
    title: "Las mejores arepas de Ibagué",
    metaTitle: "Las Mejores Arepas de Ibagué | Colcocina",
    metaDescription:
      "Dónde comer arepas en Ibagué: rellenas, asadas al carbón o de chocolo dulce. Barrio, especialidad y contacto directo de cada negocio.",
    introBefore:
      "La arepa en Ibagué va mucho más allá del desayuno — hay negocios de barrio con años de tradición y otros que la llevan a versiones más grandes para compartir. En el ",
    introLinkText: "directorio de arepas de Colcocina",
    introAfter: " puedes ver las opciones de la ciudad, con su especialidad y su barrio.",
    picks: [
      {
        name: "Arepas Doña Estella",
        slug: "arepas-dona-estella-h6c3",
        neighborhood: "Jordán 3 Etapa",
        priceLevel: "$",
        note: "Más de 20 años de tradición familiar en el barrio Jordán — arepas 100% naturales, rellenas de pollo, carne o queso.",
      },
      {
        name: "La Carbonera Arepas",
        slug: "la-carbonera-arepas-807e",
        neighborhood: "Piedra Pintada",
        priceLevel: "$$",
        note: "Arepas de maíz asadas al carbón, rellenas de carne, pollo, chicharrón o queso. Funciona desde 2018, con muy buena calificación en Rappi, domicilios y combos familiares.",
      },
      {
        name: "Arepas Diany",
        slug: "arepas-diany-e6ff",
        neighborhood: "La Francia Parte Alta",
        priceLevel: "$",
        note: "En la parte alta de La Francia, con más de cien reseñas y buena calificación — la arepa de chocolo dulce con mantequilla y longaniza es la que más se repite en los comentarios.",
      },
      {
        name: "Arepiz",
        slug: "arepiz-9790",
        neighborhood: "Ambalá",
        priceLevel: "$$",
        note: "La opción para compartir: arepas rellenas grandes, con combinaciones que van desde pollo y champiñones hasta mariscos. También atiende eventos y catering.",
      },
    ],
  },
  {
    slug: "cafeterias-especialidad-ibague",
    citySlug: "ibague",
    categorySlug: "cafe",
    categoryLabel: "Café",
    title: "Cafeterías de especialidad en Ibagué",
    metaTitle: "Cafeterías de Especialidad en Ibagué | Colcocina",
    metaDescription:
      "Las mejores cafeterías de especialidad de Ibagué: café de origen del Tolima, métodos de preparación y ambiente. Barrio y contacto directo.",
    introBefore:
      "El café de especialidad ya tiene su propia escena en Ibagué, con negocios que trabajan directamente con caficultores del Tolima. En el ",
    introLinkText: "directorio de cafés de Colcocina",
    introAfter: " reunimos las cafeterías de la ciudad que se toman el café en serio.",
    picks: [
      {
        name: "Jus'so Café",
        slug: "jusso-cafe-a246",
        neighborhood: "La Pola",
        priceLevel: "$$",
        note: "Pionera del café de especialidad en La Pola desde 2014 — café de origen del Tolima en métodos filtrados y espresso, con brunch, bowls, desayunos y terraza para tomarse su tiempo.",
      },
      {
        name: "Osmosis Kafe",
        slug: "osmosis-kafe-aba1",
        neighborhood: "Jordán",
        priceLevel: "$$",
        note: "Trabaja variedades como Bourbon Rosado y Caturra Lavado, con métodos V60, Chemex y prensa francesa. También vende café en grano de origen Ibagué-Tolima.",
      },
      {
        name: "Avellana Pastelería y Café",
        slug: "avellana-pasteleria-y-cafe-fddb",
        neighborhood: "La Macarena",
        priceLevel: "$$",
        note: "Combina café de especialidad con repostería artesanal — tortas, cheesecakes, croissants. Un emprendimiento reciente que medios locales ya mencionan entre los mejores cafés de la ciudad.",
      },
      {
        name: "Palmeto Café Galería Bar",
        slug: "palmeto-cafe-209a",
        neighborhood: "Belén-Centenario",
        priceLevel: "$$",
        note: "Cafetería-galería en el sector tradicional de Belén-Centenario, con carta sencilla de sándwiches y snacks en ambiente cultural. Punto de encuentro con buena actividad en redes.",
      },
    ],
  },
];

/** Looks up a post by its own slug — used by the blog page route itself. */
export function getBlogPostBySlug(citySlug: string, slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.citySlug === citySlug && post.slug === slug);
}

/** Looks up the one post (if any) written for a given category — used by
 *  the category page to show its "related guide" link. */
export function getBlogPostByCategorySlug(
  citySlug: string,
  categorySlug: string
): BlogPost | undefined {
  return BLOG_POSTS.find(
    (post) => post.citySlug === citySlug && post.categorySlug === categorySlug
  );
}
