import { NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb-server";

const MAX_QUERY_LENGTH = 80;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;

const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

export async function GET(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { results: [], error: "rate_limited" },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("query") ?? "").trim().slice(0, MAX_QUERY_LENGTH);

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await tmdb("/search/multi", { query });
    const results = (data.results ?? [])
      .filter((r) => r.media_type === "movie" || r.media_type === "tv")
      .slice(0, 6)
      .map((r) => ({
        id: r.id,
        media_type: r.media_type,
        title: r.title ?? r.name,
        poster_path: r.poster_path,
        release_date: r.release_date ?? r.first_air_date,
        vote_average: r.vote_average,
      }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { results: [], error: "upstream_unavailable" },
      { status: 502 }
    );
  }
}
