# 🎬 streamWeb

A fast, dark-cinema-styled movie discovery and streaming site built with **Next.js 15**, **React 19**, and **Tailwind CSS v4**.

**🔗 Live: [streamweb-by-kavs.vercel.app](https://streamweb-by-kavs.vercel.app)**

![Live site](https://img.shields.io/website?url=https%3A%2F%2Fstreamweb-by-kavs.vercel.app&label=live%20site&style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs&style=flat-square)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white&style=flat-square)
![Data: TMDB](https://img.shields.io/badge/data-TMDB-01B4E4?logo=themoviedb&logoColor=white&style=flat-square)

## ✨ Features

- **Browse by category** — Trending, Popular, Top Rated, Now Playing, and Upcoming
- **Instant search** — debounced suggestions powered by a self-hosted, rate-limited API proxy (30 req/min/IP)
- **Cinematic detail pages** — backdrop hero, ratings badge, genre chips, and cast info per movie
- **Watch page** — embedded player in a sandboxed iframe with a clean 16:9 frame
- **Security-first** — server-only API keys, strict Content-Security-Policy, hardened response headers, zero secrets shipped to the client
- **Fully responsive** — mobile-first dark UI with Bebas Neue display type

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Data | [TMDB API](https://developer.themoviedb.org/) |
| Hosting | Vercel |

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/KavsMoodley/moviesite.git
cd moviesite
npm install
```

### 2. Add your TMDB API key

Create a free account at [themoviedb.org](https://www.themoviedb.org/signup), then request an API key from your [account settings](https://www.themoviedb.org/settings/api).

Create a `.env.local` file in the project root:

```bash
TMDB_API_KEY=your_api_key_here
```

> The key is read **server-side only** (`lib/tmdb-server.js`) and is never exposed to the browser.

### 3. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint (Next.js core-web-vitals rules) |

## ☁️ Deploying

Any Node host works, but Vercel is zero-config for this stack:

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add `TMDB_API_KEY` as an environment variable
4. Deploy 🎉

## 🙏 Attribution

This product uses the **TMDB API** but is not endorsed or certified by [TMDB](https://www.themoviedb.org/).

---
Made with ❤️ by [@KavsMoodley](https://github.com/KavsMoodley)
