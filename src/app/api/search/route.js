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
    const data = await tmdb("/search/movie", { query });
    const results = (data.results ?? []).slice(0, 6).map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { results: [], error: "upstream_unavailable" },
      { status: 502 }
    );
  }
}
