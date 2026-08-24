import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import SearchBar from "./components/searchBar";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "streamWeb",
  description: "Browse and watch popular movies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-50 border-b border-[#2b2436]/80 bg-[#0b0a10]/85 backdrop-blur-md">
          <nav className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
            <Link
              href="/"
              className="shrink-0 text-xl font-bold tracking-[0.08em] text-[#e8b44d] transition-colors hover:text-[#f4d488]"
            >
              🎬 streamWeb
            </Link>

            <div className="hidden flex-1 justify-center px-2 sm:flex">
              <SearchBar />
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-5 sm:ml-0">
              <Link
                href="/browse?type=movie"
                className="text-sm font-medium text-[#948c9e] transition-colors hover:text-[#e8b44d]"
              >
                Movies
              </Link>
              <Link
                href="/browse?type=tv"
                className="text-sm font-medium text-[#948c9e] transition-colors hover:text-[#e8b44d]"
              >
                Series
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-[#948c9e] transition-colors hover:text-[#e8b44d]"
              >
                Home
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-16">
          <div className="film-strip" />
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-sm text-[#948c9e] sm:flex-row sm:px-6 sm:text-left">
            <p>
              Built by{" "}
              <span className="font-semibold text-[#e8b44d]">
                Kavs Moodley this is legal i promise
              </span>
            </p>
            <p className="text-xs">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
