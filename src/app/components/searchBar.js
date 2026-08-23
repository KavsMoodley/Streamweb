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

  return (
    <div ref={wrapperRef} className="relative flex justify-center pt-6">
      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md px-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
          placeholder="Search movies..."
          className="bg-[#17141C] border border-[#2A2530] rounded-lg px-4 py-2 w-full text-[#F5F1E8] focus:outline-none focus:border-[#E8B44D]"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-[#A5222B] hover:bg-[#c22833] text-white font-semibold px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </form>

      {showDropdown && (
        <div className="absolute top-[calc(100%+4px)] w-full max-w-md mx-4 bg-[#17141C] border border-[#2A2530] rounded-lg overflow-hidden shadow-xl z-50">
          {loading && (
            <p className="text-[#8B8594] text-sm px-4 py-3">Searching...</p>
          )}

          {!loading && suggestions.length === 0 && (
            <p className="text-[#8B8594] text-sm px-4 py-3">No matches found.</p>
          )}

          {!loading &&
            suggestions.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleSelect(movie.id)}
                className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-[#2A2530] transition-colors"
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-14 bg-[#2A2530] rounded flex-shrink-0" />
                )}
                <div>
                  <p className="text-[#F5F1E8] text-sm font-medium">{movie.title}</p>
                  <p className="text-[#8B8594] text-xs">
                    {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
                  </p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}