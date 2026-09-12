"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { getRestaurantLikeInfo, toggleRestaurantLike } from "@/lib/queries";

// Below this, the heart shows with no number at all — just filled or
// empty. A brand-new restaurant's first couple of likes shouldn't have to
// sit there in public reading as "barely anyone uses this site." Once a
// listing has earned enough real likes to look genuinely popular, the
// count shows itself.
const SHOW_COUNT_FROM = 5;

const DEVICE_ID_KEY = "colcocina_device_id";

// One made-up id per browser, remembered in localStorage — not an account,
// just enough to stop the same visitor tapping the same heart over and
// over and inflating the count. Falls back to a one-off id (works for this
// visit, just doesn't persist) if storage is blocked, e.g. private mode.
function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function LikeButton({ restaurantId }: { restaurantId: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const info = await getRestaurantLikeInfo(restaurantId, getDeviceId());
      if (!cancelled) {
        setLiked(info.likedByMe);
        setCount(info.likeCount);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    // This button sits on top of the card's own link to the restaurant
    // page — stop that click from also navigating away.
    event.preventDefault();
    event.stopPropagation();
    if (busy) return;

    setBusy(true);
    const nextLiked = !liked;
    // Optimistic update so it feels instant; if the request fails the next
    // page load just shows the real count instead — nothing breaks either way.
    setLiked(nextLiked);
    setCount((current) => Math.max(0, current + (nextLiked ? 1 : -1)));

    const actuallyLiked = await toggleRestaurantLike(restaurantId, getDeviceId());
    setLiked(actuallyLiked);
    setBusy(false);
  }

  return (
    <button type="button" className={`like-btn${liked ? " is-liked" : ""}`} onClick={handleClick} aria-pressed={liked} aria-label={liked ? "Quitar me gusta" : "Dar me gusta"}>
      <span aria-hidden="true">{liked ? "❤️" : "🤍"}</span>
      {count >= SHOW_COUNT_FROM && <span className="like-count">{count}</span>}
    </button>
  );
}
