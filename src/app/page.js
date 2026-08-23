import axios from "axios";
import Link from "next/link";
import SearchBar from "./components/searchBar";

export default async function Home() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
  const movies = response.data.results;

  return (
    <div>
      <div className="film-strip" />
      <div className="text-center py-10 px-4">
        <h1 className="font-marquee text-5xl md:text-6xl text-[#E8B44D]">NOW SHOWING</h1>
        <p className="text-[#8B8594] mt-2">Popular movies, picked fresh from the reel</p>
        <SearchBar />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 pb-12 max-w-6xl mx-auto">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
            <div className="ticket-card rounded-lg overflow-hidden relative">
              <span className="rating-badge absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
              <p className="p-3 text-center font-medium truncate">{movie.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}