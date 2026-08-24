import Link from "next/link";
import { notFound } from "next/navigation";
import { tmdb } from "@/lib/tmdb-server";

export default async function Watch({ params, searchParams }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const sp = await searchParams;
  const isTv = sp.type === "tv";
  const server = sp.server === "vidsrc" ? "vidsrc" : "2embed";

  let seasonNum = null;
  let episodeNum = null;
  if (isTv) {
    seasonNum = /^\d+$/.test(sp.season ?? "") ? Number(sp.season) : null;
    episodeNum = /^\d+$/.test(sp.episode ?? "") ? Number(sp.episode) : null;
    if (seasonNum === null || episodeNum === null) notFound();
  }

  let show = null;
  let season = null;
  let movie = null;

  try {
    if (isTv) {
      [show, season] = await Promise.all([
        tmdb(`/tv/${id}`),
        tmdb(`/tv/${id}/season/${seasonNum}`),
      ]);
    } else {
      movie = await tmdb(`/movie/${id}`);
    }
  } catch {
    notFound();
  }

  const episodes = isTv ? (season?.episodes ?? []) : [];
  const current = isTv
    ? episodes.find((e) => e.episode_number === episodeNum)
    : null;
  const prevEp = isTv && episodeNum > 1 ? episodeNum - 1 : null;
  const nextEp =
    isTv && episodeNum < episodes.length ? episodeNum + 1 : null;

  const embedUrl = isTv
    ? server === "vidsrc"
      ? `https://vidsrc.sbs/embed/tv/${id}/${seasonNum}/${episodeNum}`
      : `https://2embed.org/embed/${id}?s=${seasonNum}&e=${episodeNum}`
    : server === "vidsrc"
      ? `https://vidsrc.sbs/embed/movie/${id}`
      : `https://2embed.org/embed/${id}`;

  const serverHref = (s) => {
    const p = new URLSearchParams();
    if (isTv) {
      p.set("type", "tv");
      p.set("season", String(seasonNum));
      p.set("episode", String(episodeNum));
    }
    if (s !== "2embed") p.set("server", s);
    return `/watch/${id}?${p.toString()}`;
  };

  const heading = isTv
    ? `${show.name} — S${String(seasonNum).padStart(2, "0")}E${String(episodeNum).padStart(2, "0")}`
    : movie.title;
  const subheading = isTv
    ? current?.name || `Episode ${episodeNum}`
    : null;
  const backHref = isTv
    ? `/tv/${id}/season/${seasonNum}`
    : `/movie/${id}`;
  const backLabel = isTv ? "← Back to episodes" : "← Back to movie";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-[#948c9e] transition-colors hover:text-[#e8b44d]"
      >
        {backLabel}
      </Link>

      <h1 className="font-marquee mt-4 text-3xl tracking-wide text-[#e8b44d] md:text-4xl">
        {heading}
      </h1>
      {subheading && <p className="mt-1 text-sm text-[#948c9e]">{subheading}</p>}

      <div className="relative mt-6 w-full overflow-hidden rounded-xl border border-[#2b2436] bg-black shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)]">
        <iframe
          src={embedUrl}
          title={`${heading} player`}
          className="aspect-video w-full"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          referrerPolicy="no-referrer"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>

      {isTv && (
        <div className="mt-4 flex items-center justify-between gap-3">
          {prevEp !== null ? (
            <Link
              href={`/watch/${id}?type=tv&season=${seasonNum}&episode=${prevEp}${server !== "2embed" ? `&server=${server}` : ""}`}
              className="btn btn-ghost px-4 py-2 text-sm"
            >
              ← E{prevEp}
            </Link>
          ) : (
            <span />
          )}
          {nextEp !== null ? (
            <Link
              href={`/watch/${id}?type=tv&season=${seasonNum}&episode=${nextEp}${server !== "2embed" ? `&server=${server}` : ""}`}
              className="btn btn-primary px-4 py-2 text-sm"
            >
              E{nextEp} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}

      {/* Server switcher */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="text-[#948c9e]">Server:</span>
        <Link
          href={serverHref("2embed")}
          className={`rounded-full px-3.5 py-1.5 transition-colors ${
            server === "2embed"
              ? "bg-[#e8b44d] font-semibold text-[#0b0a10]"
              : "border border-[#2b2436] text-[#948c9e] hover:border-[#e8b44d]/50 hover:text-[#f4efe6]"
          }`}
        >
          2Embed
        </Link>
        <Link
          href={serverHref("vidsrc")}
          className={`rounded-full px-3.5 py-1.5 transition-colors ${
            server === "vidsrc"
              ? "bg-[#e8b44d] font-semibold text-[#0b0a10]"
              : "border border-[#2b2436] text-[#948c9e] hover:border-[#e8b44d]/50 hover:text-[#f4efe6]"
          }`}
        >
          VidSrc
        </Link>
      </div>

      {(isTv ? (current?.overview ?? show.overview) : movie.overview) && (
        <p className="mt-6 max-w-prose text-sm leading-relaxed text-[#948c9e]">
          {isTv ? (current?.overview ?? show.overview) : movie.overview}
        </p>
      )}
    </div>
  );
}
