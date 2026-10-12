// One place that turns a restaurant's stored WhatsApp number into a wa.me
// link with a pre-filled message — used by the restaurant page's contact
// buttons and by the "Consultar disponibilidad" button on category cards.

/** Pre-filled message for every WhatsApp button on the site (category
 *  cards and the restaurant page). Asks about availability only — it must
 *  never imply a deal or promotion. The full https:// URL is included so
 *  WhatsApp turns it into a tappable link, and it names Colcocina so the
 *  restaurant knows where the customer came from. */
export const WHATSAPP_MESSAGE =
  "¡Hola! 👋 Encontré su restaurante en ColCocina.com: https://colcocina.com. Quería preguntar si tienen disponibilidad y qué me recomiendan hoy. ¡Muchas gracias!";

/**
 * https://wa.me/<number>?text=<message>, or null when there's no usable
 * number. Numbers are stored the way vendors type them — a 10-digit
 * Colombian mobile ("300 123 4567") — so Colombia's country code (57) is
 * added in front. A number already entered with the code ("+57 300…",
 * 12 digits) is used as-is instead of becoming 5757….
 *
 * encodeURIComponent percent-encodes the whole message as UTF-8, so
 * accents, ¡ ¿, the emoji and the URL inside it all survive intact.
 */
export function whatsappUrl(
  rawNumber: string | null | undefined,
  message: string
): string | null {
  const digits = (rawNumber ?? "").replace(/\D/g, "");
  if (!digits) return null;
  const international = digits.length === 12 && digits.startsWith("57") ? digits : `57${digits}`;
  return `https://wa.me/${international}?text=${encodeURIComponent(message)}`;
}
