"use client";

import { logContactClick } from "@/lib/queries";

/**
 * The "Llamar" / "Escribir por WhatsApp" buttons on a restaurant's public
 * page. Pulled into their own small client component so a tap can log a
 * quiet +1 for that restaurant — neither link actually unloads this tab
 * (tel: opens the phone dialer, WhatsApp opens in a new tab), so there's
 * no risk of the click getting cut off mid-request.
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
      
        className="call-btn"
        href={callHref}
        onClick={() => logContactClick(restaurantId, "call")}
      >
        📞 Llamar
      </a>
      {whatsappHref && (
        
          className="whatsapp-btn"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logContactClick(restaurantId, "whatsapp")}
        >
          Escribir por WhatsApp
        </a>
      )}
    </div>
  );
}
