"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getWatchlist,
  toggleWatchlist,
  getProgress,
  WATCHLIST_EVENT,
  PROGRESS_EVENT,
} from "./watchlist-store";

function PosterCard({ item, href, onRemove }) {
  const name = item.title;
  const sub = item.subtitle;
  return (
    <div className="group relative w-36 shrink-0 md:w-44">
      <Link href={href} className="block">
        <div className="ticket-card relative aspect-[2/3] overflow-hidden rounded-lg">
          {item.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
              alt={`${name} poster`}
              fill
              sizes="(min-width: 768px) 176px, 144px"
              loading="lazy"
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#231d2e] font-marquee text-3xl text-[#6f6879]">
              {name?.charAt(0)}
            </div>
          )}
        </div>
        <p className="mt-2 truncate text-sm font-medium text-[#f4efe6] transition-colors group-hover:text-[#e8b44d]">
          {name}
        </p>
        {sub && <p className="truncate text-xs text-[#948c9e]">{sub}</p>}
      </Link>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name} from watchlist`}
          className="absolute right-1.5 top-1.5 z-10 hidden h-7 w-7 items-center justify-center rounded-full bg-[#0b0a10]/90 text-sm text-[#948c9e] transition-colors hover:text-[#b32530] group-hover:flex"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default function SavedRows() {
  const [watchlist, setWatchlist] = useState([]);
  const [progress, setProgress] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setWatchlist(getWatchlist());
      setProgress(getProgress());
    };
    sync();
    setReady(true);
    window.addEventListener(WATCHLIST_EVENT, sync);
    window.addEventListener(PROGRESS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WATCHLIST_EVENT, sync);
      window.removeEventListener(PROGRESS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!ready || (watchlist.length === 0 && progress.length === 0)) return null;

  return (
    <>
      {progress.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-3 px-4 sm:px-6">
            <h2 className="font-marquee text-2xl tracking-wide text-[#f4efe6]">
              Continue Watching
            </h2>
            <span className="h-px max-w-[140px] flex-1 bg-gradient-to-r from-[#e8b44d]/60 to-transparent" />
          </div>
          <div className="scrollbar-thin flex gap-4 overflow-x-auto px-4 pb-2 sm:px-6">
            {progress.map((item) => (
              <PosterCard
                key={`${item.type}-${item.id}`}
                item={item}
                href={
                  item.type === "tv"
                    ? `/watch/${item.id}?type=tv&season=${item.season}&episode=${item.episode}`
                    : `/watch/${item.id}`
                }
                sub={item.subtitle}
              />
            ))}
          </div>
        </section>
      )}

      {watchlist.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-3 px-4 sm:px-6">
            <h2 className="font-marquee text-2xl tracking-wide text-[#f4efe6]">
              My Watchlist
            </h2>
            <span className="h-px max-w-[140px] flex-1 bg-gradient-to-r from-[#e8b44d]/60 to-transparent" />
          </div>
          <div className="scrollbar-thin flex gap-4 overflow-x-auto px-4 pb-2 sm:px-6">
            {watchlist.map((item) => (
              <PosterCard
                key={`${item.type}-${item.id}`}
                item={item}
                href={item.type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`}
                onRemove={() => toggleWatchlist(item)}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
