import Link from "next/link";

export default function MovieRow({ title, movies }) {
  return (
    <div className="mb-10">
      <h2 className="font-marquee text-2xl text-[#E8B44D] px-4 mb-3 tracking-wide">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-thin">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="flex-shrink-0 w-36 md:w-44"
          >
            <div className="ticket-card rounded-lg overflow-hidden relative">
              <span className="rating-badge absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
              <p className="p-2 text-center text-sm font-medium truncate">
                {movie.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}