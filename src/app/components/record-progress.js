"use client";
import { useEffect } from "react";
import { saveProgress } from "./watchlist-store";

export default function RecordProgress({ entry }) {
  useEffect(() => {
    saveProgress(entry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.id, entry.type, entry.season, entry.episode]);

  return null;
}
