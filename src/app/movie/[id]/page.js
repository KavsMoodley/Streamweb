import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { tmdb } from "@/lib/tmdb-server";
import CastRow from "../../components/castrow";
import WatchlistButton from "../../components/watchlist-button";
import RecordProgress from "../../components/record-progress";
import TrailerModal from "../../components/trailer-modal";
import MovieRow from "../../components/movierow";

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return { title: "streamWeb" };
  try {
    const movie = await tmdb(`/movie/${id}`);
    return {
      title: `${movie.title} — streamWeb`,
      description: (movie.overview ?? "").slice(0, 160),
      openGraph: movie.poster_path
        ? { images: [`https://image.tmdb.org/t/p/w780${movie.poster_path}`] }
        : undefined,
    };
  } catch {
    return { title: "streamWeb" };
  }
}

export default async function MovieDetail({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  let movie;
  try {
    movie = await tmdb(`/movie/${id}`, {
      append_to_response: "credits,videos,recommendations",
    });
  } catch {
    notFound();
  }

  const trailer = (movie.videos?.results ?? []).find(
    (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
  ) ?? (movie.videos?.results ?? []).find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;
  const runtime =
    movie.runtime > 0
      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
      : null;

  return (
    <div className="pb-16">
      {/* Backdrop */}
      <div className="absolute inset-x-0 top-0 h-[420px] overflow-hidden md:h-[480px]">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
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
          {movie.poster_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
              width={500}
              height={750}
              priority
              className="fade-up w-52 shrink-0 self-start rounded-xl border border-[#2b2436] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] md:w-64"
            />
          )}

          <div className="min-w-0 flex-1 pt-2">
            <h1 className="font-marquee text-5xl leading-[0.95] text-[#e8b44d] text-balance fade-up md:text-6xl">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="mt-3 text-base italic text-[#948c9e] fade-up fade-up-1">
                “{movie.tagline}”
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 fade-up fade-up-1">
              {year && <span className="chip">{year}</span>}
              {runtime && <span className="chip">{runtime}</span>}
              <span className="chip chip-gold">
                ★ {movie.vote_average.toFixed(1)} TMDB
              </span>
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="chip">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="mt-6 max-w-prose leading-relaxed text-[#f4efe6]/90 fade-up fade-up-2">
              {movie.overview || "No overview available."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 fade-up fade-up-3">
              <Link href={`/watch/${id}`} className="btn btn-primary px-8 py-3">
                ▶ Watch now
              </Link>
              <WatchlistButton
                item={{
                  id: Number(id),
                  type: "movie",
                  title: movie.title,
                  poster_path: movie.poster_path,
                  subtitle: movie.release_date
                    ? movie.release_date.slice(0, 4)
                    : null,
                }}
              />
              <TrailerModal videoKey={trailer?.key} title={movie.title} />
              <a
                href={`https://www.themoviedb.org/movie/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                View on TMDB ↗
              </a>
            </div>
          </div>
        </div>

        <CastRow cast={movie.credits?.cast ?? []} />

        {(movie.recommendations?.results?.length ?? 0) > 0 && (
          <div className="mt-6">
            <MovieRow
              title="More Like This"
              movies={movie.recommendations.results.slice(0, 14)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
