import Link from "next/link";
import axios from "axios";

export default async function WatchMovie({ params }) {
  const { id } = await params;
  const embedUrl = `https://vidsrc.sbs/embed/movie/${id}`;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
  );
  const movie = response.data;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href={`/movie/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-[#948c9e] transition-colors hover:text-[#e8b44d]"
      >
        ← Back to movie
      </Link>

      <h1 className="font-marquee mt-4 text-3xl tracking-wide text-[#e8b44d] md:text-4xl">
        {movie.title}
      </h1>

      <div className="relative mt-6 w-full overflow-hidden rounded-xl border border-[#2b2436] bg-black shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)]">
        <iframe
          src={embedUrl}
          title={`${movie.title} player`}
          className="aspect-video w-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>

      {movie.overview && (
        <p className="mt-6 max-w-prose text-sm leading-relaxed text-[#948c9e]">
          {movie.overview}
        </p>
      )}
    </div>
  );
}
