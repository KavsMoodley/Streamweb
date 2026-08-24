import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { tmdb } from "@/lib/tmdb-server";
import CastRow from "../../components/castrow";
import WatchlistButton from "../../components/watchlist-button";

export default async function TvDetail({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  let show;
  try {
    show = await tmdb(`/tv/${id}`, { append_to_response: "credits" });
  } catch {
    notFound();
  }

  const startYear = show.first_air_date
    ? show.first_air_date.slice(0, 4)
    : null;
  const endYear =
    show.status === "Ended" && show.last_air_date
      ? show.last_air_date.slice(0, 4)
      : null;
  const years = endYear && endYear !== startYear ? `${startYear}–${endYear}` : startYear;

  const seasons = (show.seasons ?? []).filter((s) => s.episode_count > 0);
  const firstSeason = seasons.find((s) => s.season_number > 0) ?? seasons[0];

  return (
    <div className="pb-16">
      {/* Backdrop */}
      <div className="absolute inset-x-0 top-0 h-[420px] overflow-hidden md:h-[480px]">
        {show.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
        ) : (
          <div className="h-full w-full bg-[#16131d]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0a10]/50 via-[#0b0a10]/75 to-[#0b0a10]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#948c9e] transition-colors hover:text-[#e8b44d]"
        >
          ← Back to browse
        </Link>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:gap-10">
          {show.poster_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={`${show.name} poster`}
              width={500}
              height={750}
              priority
              className="fade-up w-52 shrink-0 self-start rounded-xl border border-[#2b2436] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] md:w-64"
            />
          )}

          <div className="min-w-0 flex-1 pt-2">
            <span className="chip chip-gold fade-up">Series</span>
            <h1 className="font-marquee mt-2 text-5xl leading-[0.95] text-[#e8b44d] text-balance fade-up md:text-6xl">
              {show.name}
            </h1>

            {show.tagline && (
              <p className="mt-3 text-base italic text-[#948c9e] fade-up fade-up-1">
                “{show.tagline}”
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 fade-up fade-up-1">
              {years && <span className="chip">{years}</span>}
              {show.number_of_seasons > 0 && (
                <span className="chip">
                  {show.number_of_seasons} season{show.number_of_seasons === 1 ? "" : "s"}
                </span>
              )}
              <span className="chip chip-gold">
                ★ {show.vote_average.toFixed(1)} TMDB
              </span>
              {show.genres?.map((genre) => (
                <span key={genre.id} className="chip">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="mt-6 max-w-prose leading-relaxed text-[#f4efe6]/90 fade-up fade-up-2">
              {show.overview || "No overview available."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 fade-up fade-up-3">
              {firstSeason && (
                <Link
                  href={`/watch/${id}?type=tv&season=${firstSeason.season_number}&episode=1`}
                  className="btn btn-primary px-8 py-3"
                >
                  ▶ Watch S{firstSeason.season_number} E1
                </Link>
              )}
              <WatchlistButton
                item={{
                  id: Number(id),
                  type: "tv",
                  title: show.name,
                  poster_path: show.poster_path,
                  subtitle: years,
                }}
              />
              <a
                href={`https://www.themoviedb.org/tv/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                View on TMDB ↗
              </a>
            </div>
          </div>
        </div>

        {/* Cast */}
        <CastRow cast={show.credits?.cast ?? []} />

        {/* Seasons */}
        {seasons.length > 0 && (
          <section className="mt-14">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="font-marquee text-2xl tracking-wide text-[#f4efe6]">
                Seasons
              </h2>
              <span className="h-px max-w-[140px] flex-1 bg-gradient-to-r from-[#e8b44d]/60 to-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
              {seasons.map((season) => (
                <Link
                  key={season.id}
                  href={`/tv/${id}/season/${season.season_number}`}
                  className="group"
                >
                  <div className="ticket-card relative aspect-[2/3] overflow-hidden rounded-lg">
                    {season.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${season.poster_path}`}
                        alt={`${season.name} poster`}
                        fill
                        sizes="(min-width: 640px) 25vw, 50vw"
                        loading="lazy"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      />
                    ) : show.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${show.poster_path}`}
                        alt={`${season.name} poster`}
                        fill
                        sizes="(min-width: 640px) 25vw, 50vw"
                        loading="lazy"
                        className="object-cover opacity-70 transition-transform duration-300 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex aspect-[2/3] w-full items-center justify-center bg-[#231d2e] text-3xl font-bold text-[#6f6879]">
                        {season.season_number}
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 z-10 rounded-md bg-[#0b0a10]/85 px-2 py-1 text-xs font-bold text-[#f4efe6]">
                      {season.episode_count} ep{season.episode_count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-sm font-medium transition-colors group-hover:text-[#e8b44d]">
                    {season.name}
                  </p>
                  {season.air_date && (
                    <p className="text-xs text-[#948c9e]">
                      {season.air_date.slice(0, 4)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
