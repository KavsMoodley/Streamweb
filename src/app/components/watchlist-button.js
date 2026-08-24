"use client";
import { useEffect, useState } from "react";
import {
  isInWatchlist,
  toggleWatchlist,
  WATCHLIST_EVENT,
} from "./watchlist-store";

export default function WatchlistButton({ item }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(isInWatchlist(item.id, item.type));
    sync();
    window.addEventListener(WATCHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WATCHLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [item.id, item.type]);

  return (
    <button
      type="button"
      onClick={() => setSaved(toggleWatchlist(item))}
      aria-pressed={saved}
      aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
      className={`btn ${saved ? "btn-primary" : "btn-ghost"}`}
    >
      {saved ? "♥ In watchlist" : "♡ Watchlist"}
    </button>
  );
}
