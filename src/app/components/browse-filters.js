"use client";
import { useRouter } from "next/navigation";

export default function BrowseFilters({ type, genre, sort, genres }) {
  const router = useRouter();

  const go = (overrides) => {
    const merged = { type, genre, sort, ...overrides };
    const p = new URLSearchParams();
    p.set("type", merged.type);
    if (merged.genre) p.set("genre", String(merged.genre));
    if (merged.sort && merged.sort !== "popular") p.set("sort", merged.sort);
    router.push(`/browse?${p.toString()}`);
  };

  const selectCls =
    "cursor-pointer rounded-full border border-[#2b2436] bg-[#16131d] px-4 py-2 text-sm text-[#f4efe6] transition-colors hover:border-[#e8b44d]/40 focus:border-[#e8b44d]/60 focus:outline-none";

  const tab = (active) =>
    `px-4 py-2 text-sm transition-colors ${
      active
        ? "bg-[#e8b44d] font-semibold text-[#0b0a10]"
        : "text-[#948c9e] hover:bg-[#231d2e] hover:text-[#f4efe6]"
    }`;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2.5">
      <div className="flex overflow-hidden rounded-full border border-[#2b2436]">
        <button
          type="button"
          onClick={() => go({ type: "movie", genre: null })}
          className={tab(type === "movie")}
        >
          🎬 Movies
        </button>
        <button
          type="button"
          onClick={() => go({ type: "tv", genre: null })}
          className={tab(type === "tv")}
        >
          📺 Series
        </button>
      </div>

      <select
        value={sort}
        onChange={(e) => go({ sort: e.target.value })}
        className={selectCls}
        aria-label="Sort by"
      >
        <option value="popular">Most popular</option>
        <option value="rating">Top rated</option>
        <option value="newest">Newest</option>
      </select>

      <select
        value={genre ?? ""}
        onChange={(e) => go({ genre: e.target.value || null })}
        className={selectCls}
        aria-label="Genre"
      >
        <option value="">All genres</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </div>
  );
}
