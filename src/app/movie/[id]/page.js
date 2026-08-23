// src/app/movie/[id]/page.js
// src/app/movie/[id]/page.js

import Link from "next/link";
import axios from "axios";

export default async function MovieDetail({ params }) {
  const { id } = await params;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const movieResponse = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
  );
  const movie = movieResponse.data;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="font-marquee text-4xl text-[#E8B44D] text-center">{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full rounded-lg mt-6 border border-[#2A2530]"
      />
      <p className="mt-4 text-[#F5F1E8]/90 leading-relaxed">{movie.overview}</p>
      <p className="mt-3 font-semibold text-[#E8B44D]">★ {movie.vote_average.toFixed(1)}</p>

      <div className="mt-6 text-center">
        <Link href={`/watch/${id}`}>
          <button className="bg-[#A5222B] hover:bg-[#c22833] text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Watch Now
          </button>
        </Link>
      </div>
    </div>
  );
}