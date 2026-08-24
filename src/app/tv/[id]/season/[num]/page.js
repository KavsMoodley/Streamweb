import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { tmdb } from "@/lib/tmdb-server";
import SeasonSelect from "../../../../components/season-select";

export default async function SeasonPage({ params }) {
  const { id, num } = await params;
  if (!/^\d+$/.test(id) || !/^\d+$/.test(num)) notFound();

  let show;
  try {
    show = await tmdb(`/tv/${id}`);
  } catch {
    notFound();
  }

  let season;
  try {
    season = await tmdb(`/tv/${id}/season/${num}`);
  } catch {
    notFound();
  }

  const episodes = season.episodes ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
      <Link
        href={`/tv/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-[#948c9e] transition-colors hover:text-[#e8b44d]"
      >
        ← Back to {show.name}
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <h1 className="font-marquee text-4xl tracking-wide text-[#e8b44d] md:text-5xl">
          {season.name}
        </h1>
        <SeasonSelect tvId={id} current={Number(num)} seasons={show.seasons ?? []} />
        <span className="chip mb-1">
          {episodes.length} episode{episodes.length === 1 ? "" : "s"}
        </span>
      </div>
      {show.name && (
        <p className="mt-1 text-sm text-[#948c9e]">
          {show.name}
          {season.air_date ? ` · ${season.air_date.slice(0, 4)}` : ""}
        </p>
      )}

      <div className="mt-8 space-y-4">
        {episodes.map((ep) => (
          <Link
            key={ep.id}
            href={`/watch/${id}?type=tv&season=${num}&episode=${ep.episode_number}`}
            className="group flex gap-4 rounded-xl border border-[#2b2436] bg-[#16131d] p-3 transition-all duration-200 hover:border-[#e8b44d]/50 hover:bg-[#231d2e] sm:gap-5 sm:p-4"
          >
            <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg sm:w-52">
              {ep.still_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                  alt={`Episode ${ep.episode_number} still`}
                  fill
                  sizes="(min-width: 640px) 208px, 144px"
                  loading="lazy"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-[#231d2e] font-marquee text-3xl text-[#6f6879]">
                  E{ep.episode_number}
                </div>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8b44d] text-sm font-bold text-[#0b0a10]">
                  ▶
                </span>
              </span>
            </div>

            <div className="min-w-0 flex-1 py-1">
              <p className="text-xs font-bold tracking-wide text-[#e8b44d]">
                EPISODE {ep.episode_number}
              </p>
              <p className="mt-0.5 truncate text-base font-medium text-[#f4efe6] transition-colors group-hover:text-[#e8b44d]">
                {ep.name || `Episode ${ep.episode_number}`}
              </p>
              <p className="mt-1 line-clamp-2 text-sm leading-snug text-[#948c9e]">
                {ep.overview || "No synopsis available."}
              </p>
              {(ep.air_date || ep.runtime > 0) && (
                <p className="mt-2 text-xs text-[#6f6879]">
                  {ep.air_date && ep.air_date.slice(0, 10)}
                  {ep.runtime > 0 &&
                    ` · ${Math.floor(ep.runtime / 60)}h ${ep.runtime % 60}m`}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
