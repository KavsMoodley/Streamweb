import Link from "next/link";
import Image from "next/image";
import { tmdb } from "@/lib/tmdb-server";
import SearchBar from "./components/searchBar";
import MovieRow from "./components/movierow";

export default async function Home() {
  const [popular, topRated, nowPlaying, upcoming, trendingTv, popularTv, topRatedTv, onTheAir] =
    await Promise.all([
      tmdb("/movie/popular"),
      tmdb("/movie/top_rated"),
      tmdb("/movie/now_playing"),
      tmdb("/movie/upcoming"),
      tmdb("/trending/tv/week"),
      tmdb("/tv/popular"),
      tmdb("/tv/top_rated"),
      tmdb("/tv/on_the_air"),
    ]);

  const featured = popular.results[0];
  const year = featured.release_date ? featured.release_date.slice(0, 4) : null;

  return (
    <div>
      {/* Hero banner using the top popular movie */}
      <section className="relative flex min-h-[440px] items-end md:min-h-[540px]">
        <Image
          src={`https://image.tmdb.org/t/p/original${featured.backdrop_path}`}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
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

      {/* Mobile-only search (header search is hidden on small screens) */}
      <div className="mt-6 flex justify-center px-4 sm:hidden">
        <SearchBar />
      </div>

      <div className="mt-8 space-y-4">
        <MovieRow title="Trending Shows" movies={trendingTv.results} type="tv" />
        <MovieRow title="Popular" movies={popular.results} />
        <MovieRow title="Popular Series" movies={popularTv.results} type="tv" />
        <MovieRow title="Top Rated" movies={topRated.results} />
        <MovieRow title="Top Rated Series" movies={topRatedTv.results} type="tv" />
        <MovieRow title="Now Playing" movies={nowPlaying.results} />
        <MovieRow title="On The Air" movies={onTheAir.results} type="tv" />
        <MovieRow title="Upcoming" movies={upcoming.results} />
      </div>
    </div>
  );
}
