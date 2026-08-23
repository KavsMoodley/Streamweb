"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex justify-center gap-2 pt-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="bg-[#17141C] border border-[#2A2530] rounded-lg px-4 py-2 w-full max-w-md text-[#F5F1E8] focus:outline-none focus:border-[#E8B44D]"
      />
      <button
        type="submit"
        className="bg-[#A5222B] hover:bg-[#c22833] text-white font-semibold px-5 py-2 rounded-lg transition-colors"
      >
        Search
      </button>
    </form>
  );
}