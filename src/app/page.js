import axios from "axios";
import SearchBar from "./components/searchBar";
import MovieRow from "./components/movierow";

export default async function Home() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const [popular, topRated, nowPlaying, upcoming] = await Promise.all([
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`),
    axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`),
    axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`),
    axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`),
  ]);

  const featured = popular.data.results[0];

  return (
    <div>
      <div className="film-strip" />

      {/* Hero banner using the top popular movie */}
      <div className="relative h-[380px] flex items-end">
        <img
          src={`https://image.tmdb.org/t/p/original${featured.backdrop_path}`}
          alt={featured.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B10] via-transparent to-transparent" />
        <div className="relative px-6 pb-6 max-w-2xl">
          <h1 className="font-marquee text-5xl md:text-6xl text-[#E8B44D]">
            {featured.title}
          </h1>
          <p className="text-[#F5F1E8]/80 mt-2 line-clamp-3">{featured.overview}</p>
        </div>
      </div>

      <div className="px-4">
        <SearchBar />
      </div>

      <div className="mt-8">
        <MovieRow title="Popular" movies={popular.data.results} />
        <MovieRow title="Top Rated" movies={topRated.data.results} />
        <MovieRow title="Now Playing" movies={nowPlaying.data.results} />
        <MovieRow title="Upcoming" movies={upcoming.data.results} />
      </div>
    </div>
  );
}