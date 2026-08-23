import Link from "next/link";
import { notFound } from "next/navigation";
import { tmdb } from "@/lib/tmdb-server";

export default async function WatchMovie({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const embedUrl = `https://vidsrc.sbs/embed/movie/${id}`;

  let movie;
  try {
    movie = await tmdb(`/movie/${id}`);
  } catch {
    notFound();
  }

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
          sandbox="allow-scripts allow-same-origin allow-presentation"
          referrerPolicy="no-referrer"
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
