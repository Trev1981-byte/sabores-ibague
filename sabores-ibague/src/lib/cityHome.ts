// Hand-written homepage copy for each city's /<ciudad> page: the hero H1 and
// subhead, an intro section, and an FAQ. It's city-specific on purpose
// (tamales tolimenses, "la parrilla del barrio"), so it lives per city slug
// rather than in the page template — a city with no entry here gets a
// generic hero built from its name and no intro/FAQ sections, never another
// city's copy. Same idea as src/lib/blog.ts: static, versioned with the code.
//
// The FAQ is rendered both as visible text and as FAQPage structured data
// from this one list, so the two can never drift apart.

export type FaqItem = { question: string; answer: string };

export type CityHomeContent = {
  h1: string;
  lede: string;
  about: { heading: string; paragraph: string };
  faq: { heading: string; items: FaqItem[] };
};

const CITY_HOME: Record<string, CityHomeContent> = {
  ibague: {
    h1: "Los mejores restaurantes de Ibagué",
    lede:
      "Tamales, salchipapas, almuerzos corrientes, la parrilla del barrio — descubre los mejores restaurantes y fondas de Ibagué, por categoría.",
    about: {
      heading: "Restaurantes en Ibagué para cada antojo",
      paragraph:
        "En Ibagué hay un restaurante para cada ocasión: un almuerzo corriente entre semana, salchipapas después del partido, o la parrilla del barrio los fines de semana. Colcocina reúne los restaurantes, fondas y lugares de comida de Ibagué en un solo lugar, organizados por categoría para que encuentres rápido lo que buscas. Cada lugar incluye su información actualizada y un contacto directo por WhatsApp o por teléfono, para que pidas o reserves sin vueltas.",
    },
    faq: {
      heading: "Preguntas frecuentes",
      items: [
        {
          question: "¿Cuáles son los mejores restaurantes en Ibagué?",
          answer:
            "Depende de lo que se te antoje: para comida rápida, revisa las categorías de hamburguesas, perros y salchipapas; para un almuerzo completo, la categoría de almuerzos reúne las fondas más populares de la ciudad. Cada categoría en Colcocina está organizada para ayudarte a decidir rápido.",
        },
        {
          question: "¿Dónde puedo pedir domicilio en Ibagué?",
          answer:
            "Muchos de los restaurantes en Colcocina ofrecen domicilio o pedidos directos por WhatsApp. Entra a la categoría que te interese y escribe directamente al restaurante para confirmar si hace entregas a tu zona.",
        },
        {
          question: "¿Qué comida típica se consigue en Ibagué?",
          answer:
            "Ibagué tiene una oferta variada: tamales tolimenses, almuerzos corrientes, parrilla de barrio, arepas y mucho más. Puedes explorar cada tipo de comida por categoría en la página principal.",
        },
        {
          question: "¿Cómo funciona Colcocina?",
          answer:
            "Colcocina es un directorio de restaurantes en Ibagué organizado por categoría. Busca por tipo de comida, nombre del restaurante o plato, y contacta directamente al lugar que te interese por WhatsApp o por teléfono.",
        },
      ],
    },
  },
};

export function getCityHomeContent(citySlug: string): CityHomeContent | undefined {
  return CITY_HOME[citySlug];
}
