"use client";

import { useState } from "react";

/**
 * On a phone, this opens the native share sheet (WhatsApp, Instagram, SMS,
 * whatever the person actually uses). On a desktop browser without that API,
 * it falls back to copying the link so they can paste it themselves.
 */
export function ShareButton({ name, url }: { name: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Mira ${name} en Colcocina`,
          url,
        });
      } catch {
        // The person closed the share sheet without picking anything —
        // nothing to do.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access blocked — nothing we can do silently here.
    }
  }

  return (
    <button
      type="button"
      className={`share-btn${copied ? " is-copied" : ""}`}
      onClick={handleShare}
    >
      {copied ? "✅ Enlace copiado" : "🔗 Compartir"}
    </button>
  );
}
