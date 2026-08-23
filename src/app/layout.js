import "./globals.css";

export const metadata = {
  title: "Now Showing",
  description: "Browse and watch popular movies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <div className="film-strip mt-12" />
        <footer className="text-center py-6 text-sm text-[#8B8594]">
          Built by <span className="text-[#E8B44D] font-semibold">Kavs Moodley</span>
        </footer>
      </body>
    </html>
  );
}
