export async function tmdb(pathname, params = {}) {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    const err = new Error("TMDB_API_KEY_MISSING");
    err.code = "NO_KEY";
    throw err;
  }
  const url = new URL(`https://api.themoviedb.org/3${pathname}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set("api_key", key);
  let res;
  try {
    res = await fetch(url, { next: { revalidate: 3600 } });
  } catch {
    const err = new Error("TMDB_UNREACHABLE");
    err.code = "UPSTREAM";
    throw err;
  }
  if (!res.ok) {
    const err = new Error(`TMDB_${res.status}`);
    err.code = res.status === 401 ? "BAD_KEY" : "TMDB_ERROR";
    err.status = res.status;
    throw err;
  }
  return res.json();
}
