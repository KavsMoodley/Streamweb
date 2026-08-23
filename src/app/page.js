import axios from "axios";
import Link from "next/link";
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
  const year = featured.release_date ? featured.release_date.slice(0, 4) : null;

  return (
    <div>
      {/* Hero banner using the top popular movie */}
      <section className="relative flex min-h-[440px] items-end md:min-h-[540px]">
        <img
          src={`https://image.tmdb.org/t/p/original${featured.backdrop_path}`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a10] via-[#0b0a10]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0a10]/85 via-[#0b0a10]/25 to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6">
          <div className="max-w-2xl">
            <span className="chip chip-gold fade-up">Featured today</span>
            <h1 className="font-marquee mt-3 text-6xl leading-[0.95] text-[#e8b44d] text-balance fade-up fade-up-1 md:text-7xl">
              {featured.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 fade-up fade-up-2">
              {year && <span className="chip">{year}</span>}
              <span className="chip">★ {featured.vote_average.toFixed(1)} TMDB</span>
            </div>
            <p className="mt-4 max-w-xl leading-relaxed text-[#f4efe6]/80 line-clamp-3 fade-up fade-up-2">
              {featured.overview}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 fade-up fade-up-3">
              <Link href={`/watch/${featured.id}`} className="btn btn-primary">
                ▶ Watch now
              </Link>
              <Link href={`/movie/${featured.id}`} className="btn btn-ghost">
                More info
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <SearchBar />
      </div>

      <div className="mt-8 space-y-4">
        <MovieRow title="Popular" movies={popular.data.results} />
        <MovieRow title="Top Rated" movies={topRated.data.results} />
        <MovieRow title="Now Playing" movies={nowPlaying.data.results} />
        <MovieRow title="Upcoming" movies={upcoming.data.results} />
      </div>
    </div>
  );
}
