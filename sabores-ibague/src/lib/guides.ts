// Long-form SEO guides for /<ciudad>/guias/<slug>, plus the /<ciudad>/guias
// index. Static content versioned with the code, like src/lib/blog.ts —
// but where blog posts are a fixed "intro + list of picks", these are full
// articles with H2 sections and links inside the text.
//
// Markup inside paragraph strings: [link text](/path) becomes a real link.
// A body entry made of lines starting with "- " renders as a bulleted list.
//
// Accuracy rules every guide follows (checked against the listings in
// Supabase when written — see `checkedOn`):
// - WhatsApp is only mentioned for restaurants whose listing actually has a
//   WhatsApp number; delivery only where the listing has has_delivery.
//   Free-text blurbs sometimes say otherwise — the structured fields win.
// - Prices and hours come from each listing's own menu items / hours field.
// - No restaurant is described as pet-friendly, vegetarian, etc. unless its
//   own listing says so. Where the directory has no data, the guide says so.
// - No claims that the Colcocina team personally ate somewhere.

export type GuideSection = {
  heading: string;
  body: string[];
};

export type Guide = {
  slug: string;
  citySlug: string;
  /** The page's one <h1>. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** One or two sentences for the /guias index card. */
  summary: string;
  /** Opening paragraph — the target keyword is in its first sentence. The
   *  byline renders right after it. */
  intro: string;
  sections: GuideSection[];
  /** When the facts in this guide were last checked against the listings. */
  checkedOn: string;
};

const C = "/ibague/categoria";
const G = "/ibague/guias";

export const GUIDES: Guide[] = [
  // -------------------------------------------------------------------------
  {
    slug: "comer-barato",
    citySlug: "ibague",
    title: "Dónde comer barato en Ibagué: los mejores precios",
    metaTitle: "Dónde comer barato en Ibagué: precios reales | Colcocina",
    metaDescription:
      "Perros desde $5.500, arepas desde $6.000 y almuerzo corriente desde $13.000: dónde comer barato en Ibagué, con precios tomados de cada restaurante.",
    summary:
      "Comida callejera, almuerzo corriente y combos para compartir: dónde rinde más la plata en Ibagué, con precios reales.",
    intro:
      "Comer barato en Ibagué es bastante más fácil de lo que parece, siempre que sepas dónde mirar: la comida de esquina y el almuerzo corriente siguen siendo los dos grandes aliados del bolsillo. En esta guía juntamos los precios más bajos que aparecen hoy en las fichas de los restaurantes de Colcocina, para que sepas cuánto vas a gastar antes de salir de la casa.",
    sections: [
      {
        heading: "Comida callejera: lo más barato de la ciudad",
        body: [
          "Si lo que buscas es llenarte con poca plata, empieza por los [perros calientes](" + C + "/perros). En Don Choriperro, sobre la Carrera 4A con Calle 33, el perro caliente sale en $5.500 y el choripán en $7.500. Es un negocio para llevar, de martes a domingo en las tardes y noches, y no tiene WhatsApp en su ficha, así que lo mejor es pasar directamente.",
          "Las [salchipapas](" + C + "/salchipapas) son la otra apuesta segura. Mr Food Gourmet vende la salchipapa en $6.500 y la hamburguesa con papas en $7.000, para llevar o a domicilio; según su ficha se pide por teléfono. Si quieres algo un poco más elaborado, en el Jordán está Mr. Patata, con su salchipapa en cono a $15.200.",
          "Para el antojo de media tarde, las [empanadas](" + C + "/empanadas) no fallan. Yel Cóctel, en el centro, lleva más de cincuenta años sirviendo avena helada con empanada: el vaso de 12 onzas cuesta $2.900. Muy cerca, La Casa de la Empanada atiende de lunes a sábado de 8:00 a.m. a 7:00 p.m., solo para llevar.",
          "Y si eres más de [arepas](" + C + "/arepas), Arepas Doña Estella, en la tercera etapa del Jordán, tiene la arepa de chicharrón en $6.000, la mixta en $6.500 y la ranchera en $7.500. Abre todos los días de 2:00 a 9:00 p.m. y recibe mensajes por WhatsApp.",
        ],
      },
      {
        heading: "El almuerzo corriente: la comida completa que más rinde",
        body: [
          "Cuando se trata de sentarse a comer de verdad, nada le gana al almuerzo corriente: sopa, seco, jugo y a veces postre por lo que en otro lado cuesta un plato solo. En la [categoría de almuerzos](" + C + "/almuerzos) hay varias opciones con precio publicado:",
          "- Restaurante Hondano donde rojitas (Praderas de Santa Rita): plato corriente a $13.000, de lunes a domingo de 8:00 a.m. a 4:00 p.m., con domicilio y WhatsApp.\n- Pachito Parrilla (El Limonar): corrientazo a $14.000, con WhatsApp.\n- Sabor Tropical (La Pola): corrientazo del día a $18.000; no tiene WhatsApp en su ficha, así que toca llamar.\n- Sipote Cazuela (centro, frente al Palacio de Justicia): cazuela de fríjoles o almuerzo con sopa a $18.000, con domicilio.",
          "La diferencia de cinco mil pesos entre uno y otro suele estar en el tamaño de la porción y en si el jugo es natural, así que vale la pena preguntar qué incluye antes de pedir.",
        ],
      },
      {
        heading: "Combos y compartir: el truco para que rinda más",
        body: [
          "Si van en grupo, compartir casi siempre sale más barato que pedir cada uno lo suyo. Drive Pizza, en la Macarena Alta, tiene la pizza margarita grande en $15.600; en Prazzata Pizza Club hay una oferta de dos pizzas medianas por $30.000. En Barak Asadero Parrilla, en Picaleña, el medio pollo asado cuesta $11.000, y en MACH'S BBQ la hamburguesa tradicional con combo sale en $21.500.",
          "Otra forma de ahorrar es pedir directo al restaurante en vez de usar una app de domicilios, que suele sumar tarifas de servicio y de envío. Lo explicamos con más detalle en nuestra [guía para pedir domicilio en Ibagué](" + G + "/pedir-domicilio). Y si estás organizando algo más grande, la [guía de restaurantes para grupos](" + G + "/restaurantes-grupos-celebraciones) te puede servir.",
        ],
      },
      {
        heading: "Antes de salir",
        body: [
          "Los precios de esta guía son los que cada restaurante tiene publicados en su ficha, y pueden cambiar sin aviso. Si vas a hacer un viaje largo, escribe o llama antes. En la [página principal de Colcocina](/ibague) puedes buscar por plato, por ejemplo «empanada» o «corrientazo», y ver todos los lugares que lo tienen.",
        ],
      },
    ],
    checkedOn: "octubre de 2026",
  },

  // -------------------------------------------------------------------------
  {
    slug: "restaurantes-abiertos-tarde-noche",
    citySlug: "ibague",
    title: "Restaurantes abiertos tarde en la noche en Ibagué",
    metaTitle: "Restaurantes abiertos hasta tarde en Ibagué | Colcocina",
    metaDescription:
      "Qué sigue abierto después de las 10 p.m. en Ibagué: salchipapas hasta medianoche, hamburguesas hasta las 11:30 y buñuelos hasta las 2 a.m. los fines de semana.",
    summary:
      "Qué cocinas siguen abiertas después de las 10 de la noche en Ibagué, con los horarios que cada lugar publica.",
    intro:
      "Encontrar restaurantes abiertos tarde en la noche en Ibagué no es imposible, pero sí conviene saber de antemano a dónde ir, porque buena parte de la ciudad cierra cocina antes de las 10. Revisamos los horarios que cada restaurante tiene publicados en Colcocina y estos son los que aguantan hasta más tarde.",
    sections: [
      {
        heading: "Lo que de verdad sigue abierto después de las 10",
        body: [
          "La comida rápida es la que más trasnocha. Pottatoēss, sobre la Calle 64 a la altura de la Avenida Guabinal, atiende todos los días de 4:00 p.m. a 12:00 a.m., para llevar o a domicilio, y recibe pedidos por WhatsApp. Mr Potato Head, en San Francisco, abre de lunes a domingo de 4:00 p.m. a 11:45 p.m., con mesas, para llevar y a domicilio.",
          "Entre las [hamburguesas](" + C + "/hamburguesas), Hamburguesas Dooglas es de las que más tarde cierran: de lunes a jueves hasta las 11:00 p.m., viernes y sábado hasta las 11:30 p.m., y domingos y festivos hasta las 11:00 p.m. Tiene domicilio y WhatsApp. La Central Cuatro, una cocina oculta de hamburguesas de autor, trabaja solo a domicilio de 3:00 a 10:30 p.m. todos los días.",
          "Y para los fines de semana hay un dato que vale oro: La Casa del Buñuelo, en la Avenida Ambalá, abre sábados y domingos de 6:00 a.m. a 2:00 a.m. No tiene WhatsApp en su ficha, así que si quieres confirmar, llama.",
        ],
      },
      {
        heading: "Perros, alitas y antojos de noche",
        body: [
          "En los [perros calientes](" + C + "/perros), Mi Perro Classic Hot Dogs, dentro del Centro Comercial La Estación, atiende de lunes a jueves de 1:00 a 9:00 p.m. y de viernes a domingo hasta las 10:00 p.m., con domicilio y WhatsApp. Don Choriperro trabaja de martes a domingo en las tardes y noches, aunque no publica una hora exacta de cierre.",
          "Si lo tuyo es el [pollo](" + C + "/pollo), Mr Alitas Ibagué, en Belalcázar, abre de martes a domingo de 4:00 a 10:00 p.m. y tiene 17 salsas artesanales para acompañar las alitas. En la misma franja, MACH'S BBQ, en la primera etapa del Jordán, atiende de lunes a sábado de 5:30 a 10:00 p.m. y los domingos de 6:30 a 10:30 p.m.",
          "Las arepas también trasnochan un poco: La Carbonera Arepas, en Piedra Pintada, atiende de 4:00 a 10:00 p.m. con arepas asadas al carbón, domicilio y WhatsApp. Su arepa de pollo y queso cuesta $9.000.",
        ],
      },
      {
        heading: "Una comida tranquila hasta las 10",
        body: [
          "No todo tiene que ser comida rápida. Si quieres sentarte a comer algo más pausado después del trabajo, L'Italiano, en La Pola, sirve pizza y pasta de 5:30 a 10:00 p.m., y Prazzata Pizza Club, en el barrio Centenario, abre de domingo a jueves hasta las 10:00 p.m. y los viernes y sábados hasta las 10:30 p.m. Para un café de noche, Café con Alma, también en La Pola, atiende entre semana hasta las 9:30 o las 10:00 p.m., según el día.",
          "Un consejo práctico: muchas cocinas dejan de recibir pedidos entre media hora y una hora antes de cerrar, sobre todo a domicilio. Si vas a pedir tarde, hazlo con margen, y ten en cuenta que de noche algunos lugares reducen las zonas a las que llevan.",
        ],
      },
      {
        heading: "¿Y los asaderos y la parrilla?",
        body: [
          "Aquí hay que ser honestos: en los horarios que tenemos, los asaderos cierran más temprano que la comida rápida. Asadero Coma Carne atiende aproximadamente de 11:00 a.m. a 9:00 p.m., y El Carnaval del Pollo, en Mirolindo, de 10:00 a.m. a 9:00 p.m. Si se te antoja una [parrilla](" + C + "/parrilla) para la comida, lo mejor es llegar antes de las 8:30, porque muchas cocinas dejan de tomar pedidos un rato antes de cerrar.",
        ],
      },
      {
        heading: "Confirma antes de salir",
        body: [
          "Los horarios cambian con los festivos, las temporadas y hasta con la lluvia, así que tómate un minuto para confirmar. Pottatoēss, Mr Potato Head y Hamburguesas Dooglas tienen WhatsApp en su ficha; La Casa del Buñuelo, Asadero Coma Carne y El Carnaval del Pollo, solo teléfono.",
          "Si prefieres no salir, muchos de estos lugares tienen domicilio: lo contamos en la [guía para pedir domicilio en Ibagué](" + G + "/pedir-domicilio). Y en la [página principal de Colcocina](/ibague) puedes buscar por plato y ver todas las opciones de la ciudad.",
        ],
      },
    ],
    checkedOn: "octubre de 2026",
  },

  // -------------------------------------------------------------------------
  {
    slug: "pedir-domicilio",
    citySlug: "ibague",
    title: "Mejores lugares para pedir domicilio en Ibagué",
    metaTitle: "Dónde pedir domicilio en Ibagué | Colcocina",
    metaDescription:
      "Hamburguesas, pollo, pizza y comida mexicana a domicilio en Ibagué, y por qué pedir directo por WhatsApp o teléfono suele salir mejor que por una app.",
    summary:
      "Qué categorías funcionan mejor a domicilio, qué lugares lo ofrecen de verdad y por qué conviene pedir directo.",
    intro:
      "Pedir domicilio en Ibagué es cada vez más fácil, pero no todos los restaurantes llevan a la casa, y no todos lo hacen igual. En esta guía juntamos los lugares que tienen el domicilio marcado en su ficha de Colcocina, organizados por tipo de comida, y te contamos cuándo conviene pedir directo en vez de usar una app.",
    sections: [
      {
        heading: "Hamburguesas: la categoría con más opciones",
        body: [
          "Si hay una comida pensada para el domicilio, son las [hamburguesas](" + C + "/hamburguesas). Hamburguesas Dooglas tiene la Ancestral en $11.800 y la Especial en $12.900, y recibe pedidos por WhatsApp. La Central Cuatro es una cocina oculta que trabaja solo a domicilio, de 3:00 a 10:30 p.m.: su Basic Burger cuesta $24.900 y la Colby Jack doble, $32.900.",
          "MACH'S BBQ, en el Jordán, también lleva a la casa y tiene la hamburguesa tradicional con combo en $21.500. Y Mr Potato Head, aunque es más conocido por sus salchipapas, tiene hamburguesas y domicilio de 4:00 p.m. a 11:45 p.m. Todos ellos tienen WhatsApp en su ficha.",
        ],
      },
      {
        heading: "Pollo y asaderos",
        body: [
          "Entre los lugares de [pollo](" + C + "/pollo) con domicilio está Mr Alitas Ibagué: seis alitas con papas y dos salsas por $23.900, de martes a domingo de 4:00 a 10:00 p.m., con WhatsApp. El Carnaval del Pollo, en Mirolindo, lleva a la casa todos los días de 10:00 a.m. a 9:00 p.m., pero en su ficha solo aparece teléfono.",
          "Barak Asadero Parrilla, en Picaleña, es de los más económicos: medio pollo asado a $11.000, costillas BBQ a $16.500 y domicilio con WhatsApp. Ojo: varios asaderos de la ciudad solo atienden en el local o para llevar, así que si vives cerca, recogerlo tú mismo también es una opción.",
        ],
      },
      {
        heading: "Pizza y comida internacional: pocas, pero buenas",
        body: [
          "En [pizza](" + C + "/pizza), la única que tiene domicilio en su ficha por ahora es L'Italiano, en La Pola, que atiende de 5:30 a 10:00 p.m., con pizza, pasta y postres, y recibe pedidos por WhatsApp. Drive Pizza, Prazzata Pizza Club, D'Napoli y Picazzo atienden para llevar, así que puedes pedir por teléfono o WhatsApp y pasar a recoger.",
          "En [comida internacional](" + C + "/internacional), Guadalupe Cocina Mexicana, en Santa Helena, es la que más se presta para pedir a la casa: nachos con carne desmechada por $25.900, dúo de burritos por $25.900, combos familiares e incluso kits de tacos para armar en la mesa. Tiene domicilio y WhatsApp.",
        ],
      },
      {
        heading: "Desayuno y almuerzo a domicilio",
        body: [
          "El domicilio no es solo para la noche. Para el almuerzo, el Restaurante Hondano donde rojitas lleva su plato corriente de $13.000 de 8:00 a.m. a 4:00 p.m., y Aderezos, en el Jordán, reparte sus almuerzos caseros de 11:30 a.m. a 3:30 p.m.; los dos tienen WhatsApp. Sipote Cazuela, en el centro, también hace domicilio, aunque en su ficha solo aparece teléfono.",
          "Los domingos, el tamal a domicilio es casi una institución: Tamales de la Pola, Tamales de la Gobernación y Tamales de Saldaña Don Floro llevan a la casa, todos por teléfono. Y para un desayuno sin salir, Barzal Café, en San Jerónimo, también tiene domicilio.",
          "Al pedir, da la dirección con un punto de referencia, pregunta cuánto cuesta el envío y confirma si reciben transferencia o solo efectivo. Te ahorra más de una llamada.",
        ],
      },
      {
        heading: "WhatsApp directo o app: por qué conviene pedir directo",
        body: [
          "Las apps de domicilios son cómodas, pero suelen cobrarte tarifa de servicio y de envío, y al restaurante le cobran una comisión por cada pedido. Por eso no es raro que un mismo plato cueste más en la app que pidiéndolo directo. Escribir al restaurante, además, te deja preguntar por promociones, pedir algo fuera de la carta o confirmar cuánto se va a demorar.",
          "Eso sí, no todos los lugares tienen WhatsApp: algunos atienden solo por teléfono, y en Colcocina lo indicamos en cada ficha. Si estás cuidando el presupuesto, mira también nuestra guía de [dónde comer barato en Ibagué](" + G + "/comer-barato), y si el antojo te da de madrugada, la de [restaurantes abiertos tarde en la noche](" + G + "/restaurantes-abiertos-tarde-noche).",
          "En la [página principal de Colcocina](/ibague) puedes buscar cualquier plato y ver qué restaurantes lo tienen.",
        ],
      },
    ],
    checkedOn: "octubre de 2026",
  },

  // -------------------------------------------------------------------------
  {
    slug: "cita-economica",
    citySlug: "ibague",
    title: "Planes para una cita económica en Ibagué",
    metaTitle: "Planes para una cita económica en Ibagué | Colcocina",
    metaDescription:
      "Cafés, postres y restaurantes para una cita económica en Ibagué, desde una primera salida tranquila hasta una comida especial sin gastar de más.",
    summary:
      "Café, postre o una comida especial: ideas para una cita en Ibagué que no te dejen la billetera vacía.",
    intro:
      "Una cita económica en Ibagué puede ser tan buena como una cara, siempre que elijas bien el lugar: lo que importa es poder conversar tranquilos y comer algo rico, no el tamaño de la cuenta. Aquí van algunas ideas, de menos a más formales, con lugares reales del directorio de Colcocina.",
    sections: [
      {
        heading: "Primera cita: un café y algo dulce",
        body: [
          "Para una primera salida, un café es casi imposible de fallar: es corto si no fluye y se puede alargar si sí. En la [categoría de cafés](" + C + "/cafe) hay varios con personalidad. Avellana Pastelería y Café, en La Macarena, combina café de especialidad con cheesecakes y croissants. Jus'so Café, en La Pola, lleva desde 2014 sirviendo café de origen del Tolima y tiene terraza, ideal para tomarse su tiempo.",
          "Si a alguno de los dos le gusta el café en serio, Osmosis Kafe, en el Jordán, prepara variedades como Bourbon Rosado y Caturra en V60, Chemex o prensa francesa: un buen tema de conversación. Y si buscan algo con más ambiente, Palmeto Café Galería Bar, en Belén-Centenario, mezcla café y sándwiches con una galería de arte.",
        ],
      },
      {
        heading: "Postres para alargar la tarde",
        body: [
          "Si la cita va bien y quieren seguir, un [postre](" + C + "/postres) es la excusa perfecta. Cruton Artesanalmente Oblea, en Torres de Barlovento, tiene la oblea tradicional en $8.150 y malteadas para compartir. Juana Dulce Gracia, en Interlaken, vende tortas por libra en sabores como arequipe o chocolate: un detalle bonito si quieren llevar algo para la casa.",
          "Para un plan más sencillo, Cholado Salsero, en El Vergel, prepara cholados y jugos naturales para llevar; el cholado cuesta $16.000. No tiene mesas, pero un cholado en un parque cercano también cuenta como plan.",
        ],
      },
      {
        heading: "Algo más especial sin gastar de más",
        body: [
          "Para una comida un poco más formal, la [comida internacional](" + C + "/internacional) da para mucho. En Guadalupe Cocina Mexicana, en Santa Helena, unos nachos con carne desmechada de $25.900 alcanzan para compartir. Sakana Sushi Fusión, en Prados del Norte, ganó el concurso Sushi Master de la ciudad; es de los más caros de esta lista, pero un futomaki de salmón de cinco piezas cuesta $25.000 y se puede compartir.",
          "Si prefieren pizza, Prazzata Pizza Club, en el barrio Centenario cerca del Panóptico, hace pizzas de masa madurada al horno de piedra en un espacio con galería de arte, y tiene una oferta de dos pizzas medianas por $30.000. L'Italiano, en La Pola, sirve pizza y pasta de 5:30 a 10:00 p.m.",
        ],
      },
      {
        heading: "Una tarde completa para dos",
        body: [
          "Si quieren armar un plan entero sin carro, el centro se presta. Empiecen con un café en Palmeto, en Belén-Centenario, caminen hasta el Parque Centenario, y cuando caiga la tarde pasen a Prazzata, que queda cerca del Panóptico. Todo se hace a pie, y el único gasto fuerte es la comida.",
          "Otra opción es quedarse en La Pola: café en Jus'so o en Café con Alma, una vuelta por las calles del barrio histórico y comida en L'Italiano. Para algo más sencillo todavía, una oblea de Cruton y una caminata ya son una cita.",
        ],
      },
      {
        heading: "El truco del horario",
        body: [
          "Un consejo que casi nadie aplica: salgan entre semana. De lunes a jueves los lugares están más tranquilos, se puede conversar sin gritar y es más fácil conseguir mesa. Prazzata, por ejemplo, abre de domingo a jueves de 5:00 a 10:00 p.m. Para el fin de semana, nuestra guía de [qué hacer en Ibagué un fin de semana](" + G + "/que-hacer-fin-semana) tiene más ideas.",
          "Antes de ir, confirma el horario por WhatsApp o teléfono según lo que aparezca en la ficha de cada lugar. Y si quieren explorar más opciones, en la [página principal de Colcocina](/ibague) están todas las categorías.",
        ],
      },
    ],
    checkedOn: "octubre de 2026",
  },

  // -------------------------------------------------------------------------
  {
    slug: "comida-tipica-tolimense",
    citySlug: "ibague",
    title: "Guía de comida típica tolimense: qué probar en Ibagué",
    metaTitle: "Comida típica tolimense: qué probar en Ibagué | Colcocina",
    metaDescription:
      "Tamal tolimense, lechona, calentado y avena con empanada: los sabores típicos del Tolima y dónde probarlos en Ibagué.",
    summary:
      "Del tamal tolimense a la lechona: qué comer si quieres probar la cocina de la región, y dónde encontrarlo en la ciudad.",
    intro:
      "La comida típica tolimense es una de las mejores razones para visitar Ibagué, y casi toda se puede probar sin salir del casco urbano. Esta guía es para quien llega de afuera, pero también para el ibaguereño que quiere recordar por qué el tamal de aquí no se parece al de ningún otro lado.",
    sections: [
      {
        heading: "El tamal tolimense, la estrella de la mesa",
        body: [
          "Si vas a probar una sola cosa, que sea un tamal. El tamal tolimense se envuelve en hoja de plátano y lleva una masa de arroz con carne de cerdo y pollo; dependiendo de la casa puede llevar también garbanzo, arveja, huevo o tocino. Lo tradicional es comerlo de desayuno, sobre todo los domingos, con chocolate caliente y arepa.",
          "En la [categoría de tamales](" + C + "/tamales) hay varias casas con trayectoria:",
          "- Tamales de la Pola, en el barrio La Pola: tamal tradicional a $15.000, con costilla ahumada a $23.000 y copeteado a $26.000, con domicilio.\n- Tamales de la Gobernación, en la Carrera 5 #7-81: tamal individual a $12.000, para llevar o a domicilio.\n- Tamales de Saldaña Don Floro, en La Francia: la receta de la familia Don Floro, todos los días de 6:30 a.m. a 8:00 p.m.\n- Tamales Tolimenses El Boga, en el barrio Gaitán: por porciones, para llevar.",
          "Ninguno de los cuatro tiene WhatsApp en su ficha, así que para pedir toca llamar. Y un consejo de ibaguereño: los fines de semana el tamal se acaba temprano en muchos lugares, así que si lo quieres para el desayuno del domingo, pídelo con tiempo o ve temprano.",
          "Cada casa tiene su receta y su punto de sal, y en Ibagué todo el mundo defiende la suya. Si tienes la oportunidad, prueba dos o tres antes de decidir cuál es tu favorito.",
        ],
      },
      {
        heading: "La lechona tolimense",
        body: [
          "La otra gran insignia de la región es la lechona: un cerdo entero relleno y horneado durante horas, hasta que la piel queda crocante. La versión tolimense tradicional se rellena con carne de cerdo y arveja amarilla, y muchos tolimenses insisten en que la de verdad no lleva arroz.",
          "Por ahora no tenemos en Colcocina ningún restaurante que publique lechona en su carta, y preferimos decírtelo antes que inventarnos una recomendación. Si conoces un buen lugar, o si vendes lechona, puedes [agregarlo gratis](/agregar).",
        ],
      },
      {
        heading: "Más sabores de la región",
        body: [
          "El desayuno tolimense no termina en el tamal. En Barzal Café, en San Jerónimo, el calentado tolimense cuesta $33.500 y es una buena forma de arrancar un sábado. La Casa del Buñuelo, en la Avenida Ambalá, mantiene viva la costumbre del buñuelo, y Yel Cóctel, en el centro, lleva más de cincuenta años sirviendo avena helada con empanada a los oficinistas del sector.",
          "Para el día a día, el almuerzo corriente es la comida que más ibaguereños comen entre semana. En la [categoría de almuerzos](" + C + "/almuerzos) encuentras desde la comida criolla de Aderezos, en el Jordán, hasta el corrientazo de Sabor Tropical, en La Pola. Y si ves achiras o insulso en una tienda, cómpralos: son dos clásicos del Tolima que todavía no aparecen en nuestro directorio.",
          "Si tu viaje te lleva hacia Honda o la ribera del Magdalena, pregunta por el viudo de pescado, otro plato de la región. En Ibagué, para algo parecido, El Fogón Antioqueño tiene mojarra frita en su carta.",
        ],
      },
      {
        heading: "Comida, música y fiesta",
        body: [
          "En Ibagué la comida va de la mano con la música: no por nada le dicen la capital musical de Colombia. En junio, durante el Festival Folclórico Colombiano y las fiestas de San Juan y San Pedro, el tamal y la lechona son protagonistas de casi cualquier reunión.",
          "Si vas a pasar unos días en la ciudad, en nuestra guía de [qué hacer en Ibagué un fin de semana](" + G + "/que-hacer-fin-semana) armamos un plan completo, con desayuno incluido. Y en la [página principal de Colcocina](/ibague) puedes explorar el resto de categorías.",
        ],
      },
    ],
    checkedOn: "octubre de 2026",
  },

  // -------------------------------------------------------------------------
  {
    slug: "donde-comer-barrios",
    citySlug: "ibague",
    title: "Dónde comer en cada barrio de Ibagué",
    metaTitle: "Dónde comer en Ibagué, barrio por barrio | Colcocina",
    metaDescription:
      "El centro y La Pola, La Macarena, el Jordán y el corredor de Ambalá: qué comer en cada barrio de Ibagué, con restaurantes reales de cada zona.",
    summary:
      "Un recorrido por zonas: qué tipo de comida se concentra en el centro, La Macarena, el Jordán y el norte de la ciudad.",
    intro:
      "Saber dónde comer en Ibagué depende mucho del barrio en el que estés, porque cada zona tiene su propio carácter: el centro vive del almuerzo y la empanada, La Macarena de la hamburguesa de autor y el norte de la comida rápida. Armamos este mapa con las direcciones que los propios restaurantes registraron en Colcocina.",
    sections: [
      {
        heading: "Centro y La Pola: almuerzo, empanada y café",
        body: [
          "El centro es territorio de [almuerzos](" + C + "/almuerzos). Sipote Cazuela, frente al Palacio de Justicia, sirve cazuelas y almuerzos caseros; El Fogón Antioqueño tiene bandeja paisa y mojarra frita. Para el antojo rápido están La Casa de la Empanada, cerca de la Alcaldía, y Yel Cóctel, con su avena helada de hace más de cincuenta años. También aquí quedan Factory Hot Dogs Gourmet, la pizzería D'Napoli y el asadero Coma Pollo.",
          "A pocas cuadras, La Pola, el barrio histórico, es el mejor sector de la ciudad para tomarse un [café](" + C + "/cafe): Jus'so Café y Café con Alma están aquí. El barrio completa el plan con el corrientazo de Sabor Tropical, el tamal de Tamales de la Pola y la pizza y pasta de L'Italiano.",
        ],
      },
      {
        heading: "La Macarena: hamburguesa de autor y repostería",
        body: [
          "La Macarena, sobre todo la parte alta, se volvió uno de los sectores de [hamburguesas](" + C + "/hamburguesas) más interesantes. La Burguesa Hamburguesería Artesanal, participante del Burger Master de Ibagué, está en la Carrera 5 con Calle 41. Muy cerca quedan Avellana Pastelería y Café, para el café con cheesecake, y Drive Pizza, en la Macarena Alta.",
          "En la Macarena Baja está Empanadas Gourmet Toro Rojo, y bajando hacia el Estadio, en el barrio Boyacá, Real Burger tiene hamburguesas y perros a precio económico. Guadalupe Cocina Mexicana, en Santa Helena, queda a un paso.",
        ],
      },
      {
        heading: "El Jordán: un barrio de antojos",
        body: [
          "El Jordán es enorme y, etapa por etapa, tiene un poco de todo. En la primera etapa está Aderezos, con almuerzos caseros de 11:30 a.m. a 3:30 p.m., y MACH'S BBQ, que abre en la noche con hamburguesas, alitas y cortes. En la tercera, Arepas Doña Estella lleva más de veinte años haciendo arepas rellenas. En la octava, Mr. Patata sirve [salchipapas](" + C + "/salchipapas) en cono.",
          "Para los amantes del café de especialidad, Osmosis Kafe, en la Carrera 4I, trabaja cafés de origen Ibagué y Tolima en métodos como V60 y Chemex.",
        ],
      },
      {
        heading: "Ambalá, Guabinal y El Vergel: el corredor del norte",
        body: [
          "La Avenida Ambalá y la Guabinal forman uno de los corredores de comida más movidos de la ciudad. Sobre la Ambalá están Papitas & Compañía, con papas y toppings, y La Casa del Buñuelo. Por la Calle 64, a la altura de la Guabinal, quedan Arepiz, con arepas grandes para compartir, y Pottatoēss, que vende salchipapas hasta la medianoche. Angus Burger, subcampeona del Burger Master Ibagué 2024, está en la Guabinal con Calle 65.",
          "Más al norte, en El Vergel, están Cholado Salsero y Picazzo Pizzería, dentro del Mall Portal del Vergel; en Entrerríos, La Tostadora Grilled Sandwich, y en Torres de Barlovento, las obleas de Cruton.",
        ],
      },
      {
        heading: "Piedra Pintada y Prados del Norte",
        body: [
          "En Piedra Pintada están La Carbonera Arepas, con arepas asadas al carbón de 4:00 a 10:00 p.m., y La Carnicería Parrilla, con cortes madurados y parrilladas para compartir. En Prados del Norte, Sakana Sushi Fusión y Bulldog Hotdog, famoso por sus perros gigantes.",
          "Hacia el sur y el oriente, la oferta es más de asadero: Barak Asadero Parrilla en Picaleña, El Carnaval del Pollo en Mirolindo y Asadero Delipollo en el Topacio. Sobre la vía a Picaleña también está Paz Restaurante, con su carta de desayunos.",
          "Si lo que te importa es el precio y no tanto la zona, mira nuestra guía de [dónde comer barato en Ibagué](" + G + "/comer-barato). Y si no conoces el barrio, en la [página principal de Colcocina](/ibague) puedes buscar por plato y ver la dirección de cada lugar.",
        ],
      },
    ],
    checkedOn: "octubre de 2026",
  },

  // -------------------------------------------------------------------------
  {
    slug: "restaurantes-pet-friendly",
    citySlug: "ibague",
    title: "Restaurantes pet-friendly en Ibagué",
    metaTitle: "Restaurantes pet-friendly en Ibagué: cómo elegir | Colcocina",
    metaDescription:
      "Cómo encontrar restaurantes pet-friendly en Ibagué, qué preguntar antes de ir con tu perro y qué lugares conviene consultar primero.",
    summary:
      "Qué significa pet-friendly en la práctica, qué preguntar antes de ir y cómo salir a comer con tu mascota sin sorpresas.",
    intro:
      "Encontrar restaurantes pet-friendly en Ibagué es cada vez más común, pero la política cambia mucho de un lugar a otro, y a veces depende hasta del mesero de turno. Por eso, más que una lista cerrada, esta guía te ayuda a saber qué buscar, qué preguntar y por dónde empezar, para que tu salida con tu mascota no termine en la puerta.",
    sections: [
      {
        heading: "Qué significa pet-friendly en la práctica",
        body: [
          "Cuando un restaurante dice que acepta mascotas, casi siempre se refiere a zonas al aire libre: la terraza, el andén o un patio. Que tu perro pueda entrar al salón es mucho menos común, y que le traigan un plato de agua sin pedirlo, todavía más.",
          "Hay que decirlo claro: en Colcocina todavía no registramos la política de mascotas de cada restaurante, así que no vamos a afirmar que un lugar es pet-friendly si no lo hemos confirmado. Lo que sí podemos hacer es indicarte dónde es más probable que te digan que sí y cómo preguntar.",
        ],
      },
      {
        heading: "Dónde suele ser más fácil: cafés y espacios abiertos",
        body: [
          "Los [cafés](" + C + "/cafe) suelen ser los más flexibles, porque el ambiente es tranquilo y muchos tienen mesas afuera. Jus'so Café, en La Pola, menciona en su ficha que tiene terraza, un buen lugar para preguntar primero. Avellana, en La Macarena, y Osmosis Kafe, en el Jordán, tienen WhatsApp, así que puedes escribirles antes de ir.",
          "Los restaurantes de [parrilla](" + C + "/parrilla) y los asaderos grandes a veces tienen zonas abiertas o parqueadero con mesas, sobre todo en las afueras. De nuevo, es algo para confirmar caso por caso: un asadero puede tener una terraza enorme y aun así no recibir perros.",
        ],
      },
      {
        heading: "Pregunta antes de ir (y qué preguntar)",
        body: [
          "Un mensaje de un minuto te ahorra el viaje. Si el restaurante tiene WhatsApp en su ficha, escríbele; si no, llama. Estas son las preguntas que más sirven:",
          "- ¿Reciben mascotas en la terraza, adentro o en ninguna parte?\n- ¿Hay un límite de tamaño o de raza?\n- ¿La zona de afuera tiene sombra? En Ibagué el sol del mediodía pega fuerte.\n- ¿Hay días u horas en que no se puede, por ejemplo los fines de semana?",
          "Si te dicen que sí, guarda la conversación: si cambia el mesero o el administrador, te sirve como respaldo.",
          "Y si te dicen que no, no lo tomes personal: muchos lugares tienen poco espacio o clientes con alergias. Un buen plan B es pedir para llevar y comer en un parque, o pedir a domicilio y quedarse en la casa con tu mascota.",
        ],
      },
      {
        heading: "Buenas prácticas para salir a comer con tu mascota",
        body: [
          "Lleva siempre la correa, agua y una bolsa. Elige una hora fresca, como el desayuno o el final de la tarde, y una mesa en una esquina donde tu perro no quede en el paso de los meseros. Si es la primera vez que lo llevas a un restaurante, empieza por un café corto antes de intentar un almuerzo largo.",
          "Evita dejarlo amarrado solo en la entrada mientras comes, y nunca lo dejes esperando en el carro: con el calor de Ibagué, un carro cerrado se vuelve peligroso en pocos minutos. Y si tu mascota se pone nerviosa con el ruido, mejor elige un lugar pequeño antes que uno lleno un sábado en la noche.",
          "Para planes tranquilos que se prestan a ir con tu mascota, nuestra guía de [planes para una cita económica](" + G + "/cita-economica) tiene varios cafés con buen ambiente, y la de [qué hacer en Ibagué un fin de semana](" + G + "/que-hacer-fin-semana) incluye planes al aire libre.",
          "¿Tienes un restaurante que recibe mascotas? Puedes [agregarlo gratis](/agregar) y contarlo en tu descripción. Y en la [página principal de Colcocina](/ibague) encuentras todos los lugares de la ciudad.",
        ],
      },
    ],
    checkedOn: "octubre de 2026",
  },

  // -------------------------------------------------------------------------
  {
    slug: "opciones-vegetarianas-veganas",
    citySlug: "ibague",
    title: "Opciones vegetarianas y veganas en Ibagué: dónde comer sin carne",
    metaTitle: "Opciones vegetarianas y veganas en Ibagué | Colcocina",
    metaDescription:
      "Dónde encontrar opciones vegetarianas y veganas en Ibagué: comida internacional, hamburguesas veggie, jugos naturales y cómo pedir un almuerzo sin carne.",
    summary:
      "Las opciones sin carne todavía son pocas en Ibagué. Aquí te decimos dónde buscar y cómo pedir para no quedarte con hambre.",
    intro:
      "Encontrar opciones vegetarianas y veganas en Ibagué todavía requiere algo de paciencia: es una ciudad muy de carne, de asadero y de tamal, y los restaurantes cien por ciento vegetarianos son escasos. Justamente por eso armamos esta guía, para mostrarte dónde es más fácil comer sin carne y cómo pedir en los lugares que no son especializados.",
    sections: [
      {
        heading: "La verdad: todavía son pocas",
        body: [
          "En el directorio de Colcocina, hoy no hay ningún restaurante exclusivamente vegetariano o vegano. Lo que sí hay son lugares con opciones sin carne en la carta, o que pueden adaptar un plato si se lo pides. No es lo ideal, pero con un poco de criterio se come bien.",
        ],
      },
      {
        heading: "Comida internacional: la apuesta más segura",
        body: [
          "La [comida internacional](" + C + "/internacional) es donde más fácil se consigue algo sin carne. En Guadalupe Cocina Mexicana, en Santa Helena, las quesadillas y los burritos se pueden pedir con vegetales; pregunta si los fríjoles llevan tocino o manteca de cerdo. En Sakana Sushi Fusión, en Prados del Norte, vale la pena preguntar por rolls de vegetales.",
          "En Nuevo Éxito Chino, en el Hipódromo, el chop suey y el arroz suelen poder pedirse solo con verduras, aunque conviene confirmar que no les agreguen caldo de pollo. Guadalupe y Sakana tienen WhatsApp en su ficha, así que puedes preguntar antes de ir.",
        ],
      },
      {
        heading: "Hamburguesas veggie, pizza y otras opciones",
        body: [
          "La Burguesa Hamburguesería Artesanal, en La Macarena, es de las pocas que menciona opciones veggie en su propia descripción. En pizza, la margarita grande de Drive Pizza cuesta $15.600 y es vegetariana, aunque no vegana, porque lleva queso.",
          "En la [categoría Otros](" + C + "/otros) hay dos lugares que vale la pena conocer. La Tostadora Grilled Sandwich, en Entrerríos, trabaja con verduras de productores locales: pregunta por una versión sin carne. Cholado Salsero, en El Vergel, tiene jugos naturales de mora, mango, lulo o maracuyá por $7.000; en agua son aptos para veganos, mientras que el cholado normalmente lleva leche condensada.",
        ],
      },
      {
        heading: "Desayunos, antojos y postres sin carne",
        body: [
          "El desayuno es el momento más fácil del día para comer sin carne. Unos huevos con arepa, que tienen tanto Jus'so Café como Barzal Café, son vegetarianos; en Jus'so también hay bowls, aunque conviene preguntar qué llevan. Las arepas de queso y de chocolo son otra opción segura: en Arepas Diany, en La Francia, la de chocolo viene con mantequilla y longaniza, así que pregunta si te la pueden preparar sin la longaniza.",
          "Para el antojo de la tarde, el buñuelo tradicional de La Casa del Buñuelo es vegetariano, y en los postres hay de dónde escoger: las obleas con arequipe de Cruton o las tortas por libra de Juana Dulce Gracia. Ojo, que llevan lácteos y huevo, así que sirven para vegetarianos, no para veganos. Con las empanadas, en cambio, hay que preguntar, porque la mayoría lleva carne o pollo.",
        ],
      },
      {
        heading: "Almuerzo corriente sin carne: cómo pedirlo",
        body: [
          "El almuerzo corriente parece pensado para carnívoros, pero se puede adaptar. La clave es pedir el plato sin proteína y con doble principio, o cambiar la carne por huevo si comes huevo. Pregunta también por la sopa: muchas veces está hecha con caldo de hueso o de pollo.",
          "En la [categoría de almuerzos](" + C + "/almuerzos), lugares como Aderezos, en el Jordán, el Restaurante Hondano donde rojitas o Pachito Parrilla tienen WhatsApp, así que puedes preguntar antes de ir qué pueden hacer por ti. Si quieres pedir a la casa, nuestra [guía para pedir domicilio en Ibagué](" + G + "/pedir-domicilio) te ayuda a ver quién lleva.",
          "En la [página principal de Colcocina](/ibague) puedes buscar platos como «queso» o «vegetales» y ver qué restaurantes los tienen en su carta.",
        ],
      },
    ],
    checkedOn: "octubre de 2026",
  },

  // -------------------------------------------------------------------------
  {
    slug: "restaurantes-grupos-celebraciones",
    citySlug: "ibague",
    title: "Mejores restaurantes para grupos grandes o celebraciones en Ibagué",
    metaTitle: "Restaurantes para grupos y fiestas en Ibagué | Colcocina",
    metaDescription:
      "Parrillas, asaderos, pizzerías y comida mexicana para grupos grandes y celebraciones en Ibagué, con precios reales y consejos para reservar.",
    summary:
      "Dónde celebrar un cumpleaños, una reunión familiar o la comida de la oficina en Ibagué, y cómo organizarlo sin estrés.",
    intro:
      "Elegir restaurantes para grupos grandes o celebraciones en Ibagué tiene su ciencia: no basta con que la comida sea buena, también tiene que haber espacio, platos para compartir y alguien al otro lado del teléfono dispuesto a organizar. Aquí van las opciones del directorio de Colcocina que mejor se prestan para una mesa grande.",
    sections: [
      {
        heading: "Parrilla y asaderos: hechos para compartir",
        body: [
          "Si hay una comida pensada para grupos, es la [parrilla](" + C + "/parrilla). La Carnicería Parrilla, en Piedra Pintada, se describe como un lugar popular para planes en grupo por su ambiente informal y sus raciones abundantes: la parrillada para dos cuesta $100.000 y el tomahawk de 400 gramos, $60.000. Tiene WhatsApp, lo que facilita organizar.",
          "Asadero Coma Carne, una churrasquería al estilo brasileño, atiende todos los días aproximadamente de 11:00 a.m. a 9:00 p.m.; en su ficha solo aparece teléfono. Para un grupo con presupuesto ajustado, Barak Asadero Parrilla, en Picaleña, tiene medio pollo asado a $11.000, costillas BBQ a $16.500 y churrasco a $17.500.",
        ],
      },
      {
        heading: "Pollo asado para la mesa grande",
        body: [
          "El [pollo](" + C + "/pollo) asado es el plan familiar por excelencia. Asadero Delipollo, en el barrio Topacio, menciona en su ficha que atiende eventos familiares y banquetes; el pollo asado con papa, maduro y arepa cuesta $17.000. Asadero ToliPollo, en El Jardín, es un clásico del norte para el almuerzo en familia y tiene WhatsApp.",
          "Si prefieren celebrar en la casa, El Carnaval del Pollo, en Mirolindo, lleva a domicilio todos los días de 10:00 a.m. a 9:00 p.m.",
        ],
      },
      {
        heading: "Pizza para cumpleaños y fiestas infantiles",
        body: [
          "Con niños, la [pizza](" + C + "/pizza) casi nunca falla. Drive Pizza, en la Macarena Alta, tiene la margarita grande en $15.600 y una carta amplia con pastas, calzones y hamburguesas, para que cada quien encuentre algo. Prazzata Pizza Club ofrece dos pizzas medianas por $30.000, y Picazzo Pizzería, dentro del Mall Portal del Vergel, es práctica si quieren combinar la comida con un paseo por el centro comercial.",
          "Para los más exigentes, D'Napoli, en el centro, ganó el concurso Pizza Máster 2023 con su masa madre fermentada durante 72 horas.",
        ],
      },
      {
        heading: "Comida internacional y otras ideas para celebrar",
        body: [
          "En [comida internacional](" + C + "/internacional), Guadalupe Cocina Mexicana tiene combos familiares y kits de tacos para armar en la mesa, una idea divertida para una reunión en la casa; lleva a domicilio y tiene WhatsApp. Para una celebración más especial, Sakana Sushi Fusión, en Prados del Norte, permite pedir varios rolls al centro de la mesa.",
          "Y para el resto de la fiesta: Arepiz, en Ambalá, prepara arepas grandes para compartir y atiende eventos y catering; Juana Dulce Gracia hace tortas personalizadas para celebraciones, y MYOS Repostería trabaja tortas y postres por encargo con 48 horas de anticipación.",
        ],
      },
      {
        heading: "Llama antes: el truco para grupos grandes",
        body: [
          "Para un grupo de más de ocho personas, avisa con tiempo. Un sábado en la noche, llegar sin avisar con quince personas es casi garantía de espera. Cuando escribas o llames, ten a mano esta lista:",
          "- La fecha, la hora y el número aproximado de personas.\n- Si pueden juntar mesas o reservar una zona.\n- Si manejan un menú cerrado o platos para compartir, y a qué precio por persona.\n- Si piden anticipo y hasta cuándo se puede cancelar.\n- Si se puede llevar torta propia, y si cobran algo por partirla.",
          "Con esas respuestas puedes comparar dos o tres lugares en una tarde y decidir sin sorpresas el día de la celebración.",
          "Si el plan es celebrar en la casa, nuestra [guía para pedir domicilio en Ibagué](" + G + "/pedir-domicilio) te dice quién lleva, y la de [dónde comer barato](" + G + "/comer-barato) te ayuda a cuidar el presupuesto. En la [página principal de Colcocina](/ibague) están todas las categorías.",
        ],
      },
    ],
    checkedOn: "octubre de 2026",
  },

  // -------------------------------------------------------------------------
  {
    slug: "que-hacer-fin-semana",
    citySlug: "ibague",
    title: "Qué hacer en Ibagué un fin de semana: planes y dónde comer",
    metaTitle: "Qué hacer en Ibagué un fin de semana | Colcocina",
    metaDescription:
      "Plan de fin de semana en Ibagué: desayuno tolimense, el centro, el Jardín Botánico o el Cañón del Combeima, y café y postre para cerrar el día.",
    summary:
      "Un fin de semana completo en Ibagué: dónde desayunar, qué recorrer en la tarde y dónde cerrar el día con café y postre.",
    intro:
      "Si te preguntas qué hacer en Ibagué un fin de semana, la respuesta corta es: comer bien, caminar el centro y, si el tiempo da, salir hacia la montaña. La ciudad es pequeña y se recorre fácil, así que con un poco de orden te alcanza para todo. Este es el plan que le armaríamos a un amigo que viene de visita.",
    sections: [
      {
        heading: "Sábado por la mañana: desayuno sin afán",
        body: [
          "Arranca con un buen desayuno. En la [categoría de desayunos](" + C + "/desayunos), Barzal Café, en San Jerónimo, abre de lunes a sábado desde las 7:30 a.m. y tiene calentado tolimense a $33.500 o huevos fritos con arepa a $12.800; en su ficha solo aparece teléfono. Jus'so Café, en La Pola, sirve brunch, bowls y huevos con arepa, tiene terraza y recibe mensajes por WhatsApp.",
          "Si vas hacia el sur, Paz Restaurante, sobre la vía a Picaleña, tiene carta de desayunos propia. Y si quieres ir a lo tradicional, Tamales de Saldaña Don Floro, en La Francia, abre todos los días desde las 6:30 a.m. Si te interesa la cocina de la región, nuestra [guía de comida típica tolimense](" + G + "/comida-tipica-tolimense) te cuenta qué pedir.",
        ],
      },
      {
        heading: "Mediodía y tarde: caminar la ciudad o salir a la montaña",
        body: [
          "Después del desayuno, el centro se recorre a pie. Empieza en la Plaza de Bolívar, pasa por el Conservatorio del Tolima, que tiene mucho que ver con que a Ibagué la llamen la capital musical de Colombia, y sigue hasta el Parque Centenario, donde está la Concha Acústica Garzón y Collazos. Muy cerca queda el antiguo Panóptico, hoy recuperado como espacio cultural.",
          "Si prefieres naturaleza, el Jardín Botánico San Jorge es una buena caminata sin salir de la ciudad. Y si tienes carro o ganas de madrugar, el Cañón del Combeima, hacia Juntas y Villarestrepo, es el paseo clásico de fin de semana: río, montaña y, para los más aventureros, la ruta hacia el Nevado del Tolima. Antes de ir, revisa horarios y el estado de la vía.",
          "Para el almuerzo, si estás en el centro, lo más ibaguereño es un corrientazo: Sipote Cazuela, frente al Palacio de Justicia, o El Fogón Antioqueño, con bandeja paisa y mojarra frita. Si vas al Combeima, lleva algo de comer para el camino y agua, porque arriba la oferta es más limitada y los horarios dependen del día.",
          "Y si llueve, que en Ibagué pasa más de lo que uno quisiera, el plan se puede mover a un café largo en La Pola o a una tarde en el Panóptico, que funciona bajo techo.",
        ],
      },
      {
        heading: "Al caer la tarde: café y postre para cerrar el día",
        body: [
          "Para cerrar, nada como un [café](" + C + "/cafe). Palmeto Café Galería Bar, en Belén-Centenario, queda cerca del Parque Centenario y mezcla café con galería de arte. Si estás por La Macarena, Avellana Pastelería y Café tiene café de especialidad y cheesecake.",
          "Para el [postre](" + C + "/postres), Juana Dulce Gracia, en Interlaken, vende tortas por libra, y Cruton Artesanalmente Oblea, en Torres de Barlovento, tiene obleas desde $8.150 y malteadas. Si quieres cenar, Prazzata Pizza Club, cerca del Panóptico, abre los viernes y sábados hasta las 10:30 p.m.",
        ],
      },
      {
        heading: "Domingo: tamal y plan tranquilo",
        body: [
          "El domingo en Ibagué empieza con tamal. Tamales de la Pola tiene el tradicional a $15.000 y lleva a domicilio, por si prefieres desayunar en la casa. Barzal Café también abre los domingos, pero solo hasta el mediodía, así que no lo dejes para tarde.",
          "Para la tarde del domingo, un café largo o una película en casa con domicilio es plan suficiente. Si vas con pareja, nuestra guía de [planes para una cita económica](" + G + "/cita-economica) tiene más ideas, y en la [página principal de Colcocina](/ibague) puedes explorar todas las categorías de la ciudad.",
        ],
      },
    ],
    checkedOn: "octubre de 2026",
  },
];

export function getGuidesForCity(citySlug: string): Guide[] {
  return GUIDES.filter((g) => g.citySlug === citySlug);
}

export function getGuide(citySlug: string, slug: string): Guide | undefined {
  return GUIDES.find((g) => g.citySlug === citySlug && g.slug === slug);
}
