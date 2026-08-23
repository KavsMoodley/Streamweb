import Link from "next/link";

export default function MediaRow({ title, movies, type = "movie" }) {
  const hrefBase = type === "tv" ? "/tv" : "/movie";

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-3 px-4 sm:px-6">
        <h2 className="font-marquee text-2xl tracking-wide text-[#f4efe6]">
          {title}
        </h2>
        <span className="h-px max-w-[140px] flex-1 bg-gradient-to-r from-[#e8b44d]/60 to-transparent" />
      </div>

      <div className="scrollbar-thin flex snap-x snap-proximity gap-4 overflow-x-auto px-4 pb-2 sm:px-6">
        {movies.map((item) => {
          const name = item.title ?? item.name;
          const date = item.release_date ?? item.first_air_date;
          return (
            <Link
              key={item.id}
              href={`${hrefBase}/${item.id}`}
              className="group w-36 shrink-0 snap-start md:w-44"
            >
              <div className="ticket-card relative overflow-hidden rounded-lg">
                <span className="rating-badge absolute right-2 top-2 z-10 rounded-md px-2 py-1 text-xs font-bold">
                  ★ {item.vote_average.toFixed(1)}
                </span>
                {type === "tv" && (
                  <span className="absolute left-2 top-2 z-10 rounded-md bg-[#16131d]/85 px-2 py-1 text-[10px] font-bold tracking-wide text-[#38BDF8]">
                    SERIES
                  </span>
                )}
                <img
                  src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                  alt={`${name} poster`}
                  loading="lazy"
                  className="aspect-[2/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>
              <p className="mt-2 truncate text-sm font-medium text-[#f4efe6] transition-colors group-hover:text-[#e8b44d]">
                {name}
              </p>
              {date && (
                <p className="text-xs text-[#948c9e]">{date.slice(0, 4)}</p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
