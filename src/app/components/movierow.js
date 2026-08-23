import Link from "next/link";

export default function MovieRow({ title, movies }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-3 px-4 sm:px-6">
        <h2 className="font-marquee text-2xl tracking-wide text-[#f4efe6]">
          {title}
        </h2>
        <span className="h-px max-w-[140px] flex-1 bg-gradient-to-r from-[#e8b44d]/60 to-transparent" />
      </div>

      <div className="scrollbar-thin flex snap-x snap-proximity gap-4 overflow-x-auto px-4 pb-2 sm:px-6">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="group w-36 shrink-0 snap-start md:w-44"
          >
            <div className="ticket-card relative overflow-hidden rounded-lg">
              <span className="rating-badge absolute right-2 top-2 z-10 rounded-md px-2 py-1 text-xs font-bold">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={`${movie.title} poster`}
                loading="lazy"
                className="aspect-[2/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              />
            </div>
            <p className="mt-2 truncate text-sm font-medium text-[#f4efe6] transition-colors group-hover:text-[#e8b44d]">
              {movie.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
