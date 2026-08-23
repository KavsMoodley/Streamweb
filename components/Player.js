"use client";

import { useCallback, useEffect, useRef, useState } from "react";

let webTorrentPromise = null;
function loadWebTorrent() {
  if (typeof window === "undefined") return Promise.reject(new Error("Client-only"));
  if (window.WebTorrent) return Promise.resolve();
  if (!webTorrentPromise) {
    webTorrentPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/webtorrent@2/dist/webtorrent.min.js";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load WebTorrent engine."));
      document.head.appendChild(s);
    });
  }
  return webTorrentPromise;
}

export default function Player({ source, poster, title }) {
  const videoRef = useRef(null);
  const clientRef = useRef(null);
  const instantAvailable = Boolean(source.archiveId && source.file);
  const [mode, setMode] = useState(source.p2pOnly ? "idle" : "instant");
  const [status, setStatus] = useState("");

  useEffect(() => () => clientRef.current?.destroy(), []);

  const destroyClient = () => {
    clientRef.current?.destroy();
    clientRef.current = null;
  };

  const startP2P = useCallback(async () => {
    setMode("p2p");
    try {
      setStatus("Loading torrent engine…");
      await loadWebTorrent();
      setStatus("Connecting to peers…");
      let input = source.magnet || null;
      if (!input && source.archiveId) {
        const t = await fetch(
          `https://archive.org/download/${source.archiveId}/${source.archiveId}_archive.torrent`
        );
        if (!t.ok) throw new Error("Torrent file unavailable.");
        input = new Uint8Array(await t.arrayBuffer());
      }
      destroyClient();
      const client = new window.WebTorrent();
      clientRef.current = client;
      client.on?.("error", (e) => setStatus(`Error: ${e.message}`));
      client.add(input, (torrent) => {
        const file =
          torrent.files.find((f) => /\.(mp4|m4v|webm)$/i.test(f.name)) || torrent.files[0];
        setStatus(`Streaming “${file.name}” over peer-to-peer`);
        file
          .streamTo(videoRef.current)
          .catch(() => setStatus("Playback failed — try the instant stream instead."));
      });
    } catch (e) {
      setStatus(e.message || "Could not start P2P playback.");
    }
  }, [source]);

  const switchToInstant = () => {
    destroyClient();
    setStatus("");
    setMode("instant");
  };

  const instantUrl =
    instantAvailable && mode === "instant"
      ? `https://archive.org/download/${source.archiveId}/${encodeURIComponent(source.file)}`
      : undefined;

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
        <video
          ref={videoRef}
          src={instantUrl}
          controls
          playsInline
          preload="metadata"
          poster={poster || undefined}
          aria-label={`Video player: ${title}`}
          className="aspect-video w-full"
        />
        {mode === "idle" && (
          <button
            onClick={startP2P}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-red-600"
            aria-label={`Play ${title} via peer-to-peer`}
          >
            <span className="rounded-full bg-red-600 px-7 py-2.5 text-sm font-semibold text-white">
              ▶ Play
            </span>
            <span className="text-xs text-zinc-300">Creative Commons film · community-seeded</span>
          </button>
        )}
      </div>

      {instantAvailable && (
        <div role="group" aria-label="Stream mode" className="flex flex-wrap items-center gap-2">
          <button
            onClick={switchToInstant}
            aria-pressed={mode === "instant"}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              mode === "instant"
                ? "bg-red-600 font-medium text-white"
                : "bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >
            Instant stream
          </button>
          <button
            onClick={startP2P}
            aria-pressed={mode === "p2p"}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              mode === "p2p"
                ? "bg-red-600 font-medium text-white"
                : "bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >
            P2P (WebTorrent)
          </button>
          {status && (
            <span className="text-xs text-zinc-400" aria-live="polite">
              {status}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
