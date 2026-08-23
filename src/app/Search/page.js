import Link from "next/link";

export default async function SearchResults({ searchParams }) {
  const { query } = await searchParams;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  const movies = data.results ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {movies.length === 0 ? (
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
            {movies.length} title{movies.length === 1 ? "" : "s"} found
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
                <div className="ticket-card relative overflow-hidden rounded-lg">
                  {movie.vote_average > 0 && (
                    <span className="rating-badge absolute right-2 top-2 z-10 rounded-md px-2 py-1 text-xs font-bold">
                      ★ {movie.vote_average.toFixed(1)}
                    </span>
                  )}
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                      loading="lazy"
                      className="aspect-[2/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center bg-[#231d2e] text-3xl font-bold text-[#6f6879]">
                      {movie.title.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="mt-2 truncate text-sm font-medium transition-colors group-hover:text-[#e8b44d]">
                  {movie.title}
                </p>
                <p className="text-xs text-[#948c9e]">
                  {movie.release_date ? movie.release_date.slice(0, 4) : ""}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
