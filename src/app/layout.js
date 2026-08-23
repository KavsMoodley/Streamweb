import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Now Showing",
  description: "Browse and watch popular movies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#2A2530]">
          <Link href="/" className="font-marquee text-2xl text-[#E8B44D] tracking-wider">
            🎬 NOW SHOWING
          </Link>
        </header>

        {children}

        <div className="film-strip mt-12" />
        <footer className="text-center py-6 text-sm text-[#8B8594]">
          Built by <span className="text-[#E8B44D] font-semibold">Kavs Moodley this is legal i promise</span>
        </footer>
      </body>
    </html>
  );
}