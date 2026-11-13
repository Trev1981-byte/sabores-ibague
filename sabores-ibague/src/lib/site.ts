// One place to update once there's a real domain — swap this and every
// share link, WhatsApp-preview card, and page URL updates with it.
export const SITE_URL = "https://colcocina.com";

// Colcocina's support WhatsApp, shown in the footer so visitors and
// restaurant owners have a real person to contact. Digits only, with the
// Colombian country code (57) first, as wa.me expects.
export const OWNER_WHATSAPP = "573225179542";
export const OWNER_WHATSAPP_URL = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(
  "Hola, vi Colcocina y quería preguntar algo."
)}`;
