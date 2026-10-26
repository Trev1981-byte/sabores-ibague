"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { TikTokIcon } from "@/components/TikTokIcon";

const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@colcocina.ibague";

/**
 * "Síguenos en TikTok" callout. Built for visitors arriving from TikTok ads
 * who aren't ready to contact a restaurant yet — a much lighter ask than
 * ordering, so a curious click isn't a wasted one. Fires a GA4 event on
 * click (tiktok_follow_click) rather than relying on GA4's automatic
 * outbound-link tracking, so this one is unambiguous in reports from day
 * one. `source` tags which page/section sent the click.
 */
export function TikTokFollow({ source }: { source: string }) {
  return (
    <a
      className="tiktok-btn"
      href={TIKTOK_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        sendGAEvent("event", "tiktok_follow_click", { source })
      }
    >
      <TikTokIcon className="tiktok-icon" />
      Síguenos en TikTok
    </a>
  );
}
