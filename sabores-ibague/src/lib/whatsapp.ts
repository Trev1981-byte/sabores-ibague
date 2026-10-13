// One place that turns a restaurant's stored WhatsApp number into a wa.me
// link with a pre-filled message — used by the restaurant page's contact
// buttons and by the "Consultar disponibilidad" button on category cards.

/** Pre-filled message for every WhatsApp button on the site (category
 *  cards and the restaurant page). Asks about availability only — it must
 *  never imply a deal or promotion — and names ColCocina.com so the
 *  restaurant knows where the customer came from. The https:// makes
 *  WhatsApp reliably turn it into a tappable link (the capitals are only
 *  for readability; domains are case-insensitive). Kept short on purpose:
 *  on some phones WhatsApp opens with the cursor at the start of the
 *  pre-filled text, and a short, complete message is easy to send as-is. */
export const WHATSAPP_MESSAGE =
  "¡Hola! 👋 Vi su restaurante en https://ColCocina.com ¿Tienen disponibilidad hoy? ¡Gracias!";

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
