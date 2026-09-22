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
      {/* WhatsApp first when it's available — it's already attributed
          automatically (the pre-filled message names Colcocina), so it's
          the stronger option for both the visitor and proving the referral
          to the restaurant. Call is always here too, since every
          restaurant has a phone number but WhatsApp is optional. */}
      {whatsappHref && (
        <div className="whatsapp-action">
          <a className="whatsapp-btn" href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => logContactClick(restaurantId, "whatsapp")}>
            💬 Escribir por WhatsApp
          </a>
          <p className="whatsapp-hint">Escríbele al restaurante para más información</p>
        </div>
      )}
      <div className="call-action">
        <a className="call-btn" href={callHref} onClick={() => logContactClick(restaurantId, "call")}>
          📞 Llamar
        </a>
        {/* Only next to Call — WhatsApp already opens with "te escribo desde
            Colcocina.com" pre-filled, so a caller is the only one who needs
            the nudge to say it out loud themselves. */}
        <p className="call-hint">Cuéntale al restaurante que lo encontraste en Colcocina</p>
      </div>
    </div>
  );
}
