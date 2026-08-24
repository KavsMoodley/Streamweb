"use client";
import { useEffect, useState } from "react";

export default function TrailerModal({ videoKey, title }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!videoKey) return null;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn btn-ghost">
        🎬 Trailer
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} trailer`}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close trailer"
              className="absolute -top-10 right-0 text-2xl text-[#948c9e] transition-colors hover:text-[#f4efe6]"
            >
              ✕
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-[#2b2436] bg-black shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)]">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
                title={`${title} trailer`}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
