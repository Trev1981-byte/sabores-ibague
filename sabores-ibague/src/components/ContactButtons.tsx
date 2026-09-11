"use client";

import { logContactClick } from "@/lib/queries";

/**
 * The "Llamar" / "Escribir por WhatsApp" buttons on a restaurant's public
 * page. A tap logs a quiet +1 for that restaurant so the vendor has real
 * proof Colcocina is sending them customers.
 */
export function ContactButtons({
  restaurantId,
  callHref,
  whatsappHref,
}: {
  restaurantId: string;
  callHref: string;
  whatsappHref: string | null;
}) {
  return (
    <div className="contact-actions">
      <a className="call-btn" href={callHref} onClick={() => logContactClick(restaurantId, "call")}>
        📞 Llamar
      </a>
      {whatsappHref && (
        <a className="whatsapp-btn" href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => logContactClick(restaurantId, "whatsapp")}>
          Escribir por WhatsApp
        </a>
      )}
    </div>
  );
}
