"use client";

import { logContactClick } from "@/lib/queries";

/**
 * "Consultar disponibilidad" on a category-page restaurant card, so a
 * visitor can message the restaurant without opening its page first.
 * Rendered outside the card's main link, so a tap opens WhatsApp only —
 * never the detail page too. Logs the same single "whatsapp" contact
 * click as the button on the restaurant page (one tap, one +1).
 */
export function CardWhatsApp({
  restaurantId,
  restaurantName,
  href,
}: {
  restaurantId: string;
  restaurantName: string;
  href: string;
}) {
  return (
    <div className="card-whatsapp">
      <p className="card-whatsapp-text">¿Tienes hambre? Escríbeles y consulta disponibilidad.</p>
      <a
        className="whatsapp-btn card-whatsapp-btn"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Consultar disponibilidad por WhatsApp con ${restaurantName}`}
        onClick={() => logContactClick(restaurantId, "whatsapp")}
      >
        💬 Consultar disponibilidad
      </a>
    </div>
  );
}
