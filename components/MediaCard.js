import Link from "next/link";

const posterUrl = (path) => `https://image.tmdb.org/t/p/w342${path}`;

export default function MediaCard({ item, fluid = false }) {
  const type = item.media_type === "tv" ? "tv" : "movie";
  const title = item.title || item.name || "Untitled";
  const date = item.release_date || item.first_air_date || "";
  const year = date ? date.slice(0, 4) : "";
  const rating =
    typeof item.vote_average === "number" && item.vote_average > 0
      ? item.vote_average.toFixed(1)
      : null;

  return (
    <Link
      href={`/title/${type}/${item.id}`}
      className={`group block shrink-0 snap-start rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${
        fluid ? "w-full" : "w-36 sm:w-44"
      }`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-white/5 transition duration-200 group-hover:scale-[1.03] group-hover:ring-white/20">
        {item.poster_path ? (
          <img src={posterUrl(item.poster_path)} alt={`${title} poster`} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl font-bold text-zinc-600" aria-hidden="true">
            {title.charAt(0)}
          </div>
        )}
        {rating && (
          <span className="absolute right-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-amber-400">
            ★ {rating}
          </span>
        )}
      </div>
      <h3 className="mt-2 truncate text-sm font-medium text-zinc-100">{title}</h3>
      <p className="text-xs text-zinc-500">{[year, year && type === "tv" ? "TV" : null].filter(Boolean).join(" · ")}</p>
    </Link>
  );
}
