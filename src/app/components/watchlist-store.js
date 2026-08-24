const WATCHLIST_KEY = "streamweb:watchlist";
const PROGRESS_KEY = "streamweb:progress";
export const WATCHLIST_EVENT = "streamweb:watchlist-changed";
export const PROGRESS_EVENT = "streamweb:progress-changed";

function read(key) {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

function write(key, items) {
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // storage full or unavailable — ignore
  }
}

export function getWatchlist() {
  return read(WATCHLIST_KEY);
}

export function isInWatchlist(id, type) {
  return getWatchlist().some((i) => i.id === Number(id) && i.type === type);
}

export function toggleWatchlist(item) {
  const list = getWatchlist();
  const exists = list.some((i) => i.id === item.id && i.type === item.type);
  const next = exists
    ? list.filter((i) => !(i.id === item.id && i.type === item.type))
    : [{ ...item, savedAt: Date.now() }, ...list];
  write(WATCHLIST_KEY, next);
  window.dispatchEvent(new Event(WATCHLIST_EVENT));
  return !exists;
}

export function getProgress() {
  return read(PROGRESS_KEY).sort((a, b) => b.ts - a.ts);
}

export function saveProgress(entry) {
  const list = getProgress().filter(
    (i) => !(i.id === entry.id && i.type === entry.type)
  );
  list.unshift({ ...entry, ts: Date.now() });
  write(PROGRESS_KEY, list.slice(0, 12));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}
