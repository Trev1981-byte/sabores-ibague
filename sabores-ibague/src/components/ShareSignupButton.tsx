"use client";

import { useState } from "react";

/**
 * Big share button for the signup page, aimed at owners who know other
 * food sellers. On a phone it opens the native share sheet (WhatsApp is
 * what most people will pick); on desktop it copies the link.
 */
export function ShareSignupButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const text = "¿Vendes comida en Ibagué? Publica tu restaurante gratis en Colcocina.";

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Colcocina", text, url });
      } catch {
        // Share sheet closed without choosing anything.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked — nothing to do silently.
    }
  }

  return (
    <button
      type="button"
      className={`signup-share-btn${copied ? " is-copied" : ""}`}
      onClick={handleShare}
    >
      {copied ? "✅ Enlace copiado" : "📲 Compartir con otros que venden comida"}
    </button>
  );
}
