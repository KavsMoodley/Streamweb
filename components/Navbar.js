import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight focus-visible:outline focus-visible:outline-red-600"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" aria-hidden="true" />
          OpenReel
        </Link>
        <form action="/search" role="search" className="ml-auto w-full max-w-xs sm:max-w-sm">
          <input
            type="search"
            name="q"
            placeholder="Search titles…"
            aria-label="Search movies and TV shows"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-red-600/60 focus:bg-white/10"
          />
        </form>
      </nav>
    </header>
  );
}
