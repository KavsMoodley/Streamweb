"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const router = useRouter();

  // Debounced fetch of suggestions as the user types
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setSuggestions(data.results ?? []);
        setShowDropdown(true);
      } catch (err) {
        if (err.name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300); // wait 300ms after typing stops before firing the request

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close dropdown when clicking outside the search bar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleSelect = (item) => {
    setShowDropdown(false);
    setQuery("");
    router.push(
      item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
      e.target.blur();
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f6879]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() =>
                query.length >= 2 && suggestions.length > 0 && setShowDropdown(true)
              }
              onKeyDown={handleKeyDown}
              placeholder="Search movies & shows..."
              aria-label="Search movies and TV shows"
              maxLength={80}
              className="w-full rounded-full border border-[#2b2436] bg-[#16131d] py-2.5 pl-11 pr-4 text-sm text-[#f4efe6] placeholder:text-[#6f6879] transition-all duration-200 focus:border-[#e8b44d]/60 focus:shadow-[0_0_0_4px_rgba(232,180,77,0.12)] focus:outline-none"
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn btn-primary px-5 py-2.5 text-sm">
            Search
          </button>
        </form>

        {showDropdown && (
          <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-full overflow-hidden rounded-xl border border-[#2b2436] bg-[#16131d] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)]">
            {loading && (
              <p className="flex items-center gap-2 px-4 py-3 text-sm text-[#948c9e]">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#e8b44d] border-t-transparent" />
                Searching…
              </p>
            )}

            {!loading && suggestions.length === 0 && (
              <p className="px-4 py-3 text-sm text-[#948c9e]">
                No matches found.
              </p>
            )}

            {!loading &&
              suggestions.map((item) => (
                <button
                  key={`${item.media_type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-[#231d2e]"
                >
                  {item.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      alt=""
                      aria-hidden="true"
                      width={92}
                      height={138}
                      loading="lazy"
                      className="h-14 w-10 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-14 w-10 shrink-0 rounded-md bg-[#2b2436]" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#f4efe6]">
                      <span
                        className={`mr-1.5 rounded px-1 py-0.5 text-[10px] font-bold ${
                          item.media_type === "tv"
                            ? "bg-sky-500/15 text-sky-400"
                            : "bg-[#e8b44d]/15 text-[#e8b44d]"
                        }`}
                      >
                        {item.media_type === "tv" ? "TV" : "MOVIE"}
                      </span>
                      {item.title}
                    </p>
                    <p className="text-xs text-[#948c9e]">
                      {item.release_date
                        ? item.release_date.slice(0, 4)
                        : "N/A"}
                      {item.vote_average > 0 &&
                        ` · ★ ${item.vote_average.toFixed(1)}`}
                    </p>
                  </div>
                </button>
              ))}
        </div>
      )}
    </div>
  );
}
