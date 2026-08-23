"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const router = useRouter();

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Debounced fetch of suggestions as the user types
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        );
        setSuggestions(res.data.results.slice(0, 6));
        setShowDropdown(true);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300); // wait 300ms after typing stops before firing the request

    return () => clearTimeout(timer);
  }, [query, API_KEY]);

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

  const handleSelect = (movieId) => {
    setShowDropdown(false);
    setQuery("");
    router.push(`/movie/${movieId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
      e.target.blur();
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex justify-center pt-8">
      <div className="relative w-full max-w-md">
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
              onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search movies..."
              aria-label="Search movies"
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
              suggestions.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleSelect(movie.id)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-[#231d2e]"
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="h-14 w-10 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-14 w-10 shrink-0 rounded-md bg-[#2b2436]" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-[#f4efe6]">
                      {movie.title}
                    </p>
                    <p className="text-xs text-[#948c9e]">
                      {movie.release_date
                        ? movie.release_date.slice(0, 4)
                        : "N/A"}
                      {movie.vote_average > 0 &&
                        ` · ★ ${movie.vote_average.toFixed(1)}`}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
