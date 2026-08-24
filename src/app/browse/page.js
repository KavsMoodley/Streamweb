import Link from "next/link";
import Image from "next/image";
import { tmdb } from "@/lib/tmdb-server";
import BrowseFilters from "../components/browse-filters";
import RatingBadge from "../components/rating-badge";

const SORTS = [
  { key: "popular", label: "Popular" },
  { key: "rating", label: "Top Rated" },
  { key: "newest", label: "Newest" },
];

function buildHref(params, overrides) {
  const merged = { ...params, ...overrides };
  const qs = new URLSearchParams();
  if (merged.type) qs.set("type", merged.type);
  if (merged.genre) qs.set("genre", String(merged.genre));
  if (merged.sort && merged.sort !== "popular") qs.set("sort", merged.sort);
  if (merged.page && merged.page > 1) qs.set("page", String(merged.page));
  const s = qs.toString();
  return s ? `/browse?${s}` : "/browse";
}

export default async function Browse({ searchParams }) {
  const sp = await searchParams;
  const params = {
    type: sp.type === "tv" ? "tv" : "movie",
    genre: /^\d+$/.test(sp.genre ?? "") ? Number(sp.genre) : null,
    sort: SORTS.some((s) => s.key === sp.sort) ? sp.sort : "popular",
    page: /^\d+$/.test(sp.page ?? "") ? Math.min(Number(sp.page), 500) : 1,
  };

  const isTv = params.type === "tv";
  const basePath = isTv ? "/discover/tv" : "/discover/movie";
  const dateField = isTv ? "first_air_date.desc" : "primary_release_date.desc";

  const sortBy =
    params.sort === "rating"
      ? "vote_average.desc"
      : params.sort === "newest"
        ? dateField
        : "popularity.desc";

  const discoverParams = {
    sort_by: sortBy,
    page: params.page,
    include_adult: "false",
  };
  if (params.sort === "rating") discoverParams["vote_count.gte"] = 300;
  if (params.sort === "newest") discoverParams["vote_count.gte"] = 20;
  if (params.genre) discoverParams.with_genres = params.genre;

  let genres = [];
  let data = { results: [], total_pages: 1 };
  try {
    const [genreData, discoverData] = await Promise.all([
      tmdb(`/genre/${isTv ? "tv" : "movie"}/list`),
      tmdb(basePath, discoverParams),
    ]);
    genres = genreData.genres ?? [];
    data = discoverData;
  } catch {
    // render empty state below
  }

  const results = (data.results ?? []).filter((r) => r.poster_path);
  const totalPages = Math.min(data.total_pages ?? 1, 500);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6">
      <h1 className="font-marquee text-4xl text-[#e8b44d] md:text-5xl">
        Browse {isTv ? "Series" : "Movies"}
      </h1>

      <BrowseFilters type={params.type} genre={params.genre} sort={params.sort} genres={genres} />

      {/* Results */}
      {results.length === 0 ? (
        <p className="mt-12 text-center text-sm text-[#948c9e]">
          Nothing found — try a different filter.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((item) => {
            const name = item.title ?? item.name;
            const date = item.release_date ?? item.first_air_date;
            return (
              <Link
                key={item.id}
                href={isTv ? `/tv/${item.id}` : `/movie/${item.id}`}
                className="group"
              >
                <div className="ticket-card relative aspect-[2/3] overflow-hidden rounded-lg">
                  <RatingBadge score={item.vote_average} />
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                    alt={`${name} poster`}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  />
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
      )}

      {/* Pagination */}
      {totalPages > 1 && results.length > 0 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          {params.page > 1 ? (
            <Link
              href={buildHref({ ...params, page: params.page - 1 })}
              className="btn btn-ghost px-4 py-2 text-sm"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-[#948c9e]">
            Page {params.page} of {totalPages}
          </span>
          {params.page < totalPages ? (
            <Link
              href={buildHref({ ...params, page: params.page + 1 })}
              className="btn btn-primary px-4 py-2 text-sm"
            >
              Next →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}
