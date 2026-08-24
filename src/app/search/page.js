import Link from "next/link";
import Image from "next/image";
import { tmdb } from "@/lib/tmdb-server";
import RatingBadge from "../components/rating-badge";

export default async function SearchResults({ searchParams }) {
  const query = ((await searchParams).query ?? "")
    .trim()
    .slice(0, 80);

  if (!query) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mx-auto mt-12 max-w-md rounded-xl border border-[#2b2436] bg-[#16131d] p-8 text-center">
          <p className="font-marquee text-3xl text-[#e8b44d]">What are we watching?</p>
          <p className="mt-2 text-sm text-[#948c9e]">
            Type a movie title in the search bar to find something to watch.
          </p>
          <Link href="/" className="btn btn-ghost mt-6">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  let results = [];
  try {
    const data = await tmdb("/search/multi", { query });
    results = (data.results ?? []).filter(
      (r) => r.media_type === "movie" || r.media_type === "tv"
    );
  } catch {
    results = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {results.length === 0 ? (
        <div className="mx-auto mt-12 max-w-md rounded-xl border border-[#2b2436] bg-[#16131d] p-8 text-center">
          <p className="font-marquee text-3xl text-[#e8b44d]">No showtimes found</p>
          <p className="mt-2 text-sm text-[#948c9e]">
            We couldn&apos;t find anything for “{query}”. Try a different
            title or check the spelling.
          </p>
          <Link href="/" className="btn btn-ghost mt-6">
            ← Back to home
          </Link>
        </div>
      ) : (
        <>
          <h1 className="font-marquee text-4xl text-[#f4efe6]">
            Results for <span className="text-[#e8b44d]">“{query}”</span>
          </h1>
          <p className="mt-1 text-sm text-[#948c9e]">
            {results.length} title{results.length === 1 ? "" : "s"} found
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {results.map((item) => {
              const isTv = item.media_type === "tv";
              const name = item.title ?? item.name;
              const date = item.release_date ?? item.first_air_date;
              return (
                <Link
                  key={`${item.media_type}-${item.id}`}
                  href={isTv ? `/tv/${item.id}` : `/movie/${item.id}`}
                  className="group"
                >
                  <div className="ticket-card relative aspect-[2/3] overflow-hidden rounded-lg">
                    <RatingBadge score={item.vote_average} />
                    <span
                      className={`absolute left-2 top-2 z-10 rounded-md px-2 py-1 text-[10px] font-bold tracking-wide ${
                        isTv
                          ? "bg-sky-500/20 text-sky-400"
                          : "bg-[#0b0a10]/85 text-[#e8b44d]"
                      }`}
                    >
                      {isTv ? "SERIES" : "MOVIE"}
                    </span>
                    {item.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                        alt={`${name} poster`}
                        fill
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                        loading="lazy"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex aspect-[2/3] w-full items-center justify-center bg-[#231d2e] text-3xl font-bold text-[#6f6879]">
                        {name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 truncate text-sm font-medium transition-colors group-hover:text-[#e8b44d]">
                    {name}
                  </p>
                  <p className="text-xs text-[#948c9e]">
                    {date ? date.slice(0, 4) : ""}
                  </p>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
