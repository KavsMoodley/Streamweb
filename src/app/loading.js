export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      {/* Hero skeleton */}
      <div className="relative flex min-h-[440px] items-end md:min-h-[540px]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a10] to-[#16131d]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6">
          <div className="h-6 w-32 animate-pulse rounded-full bg-[#231d2e]" />
          <div className="mt-3 h-14 w-2/3 max-w-lg animate-pulse rounded bg-[#231d2e]" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-[#1d1926]" />
          <div className="mt-6 flex gap-3">
            <div className="h-11 w-36 animate-pulse rounded-full bg-[#231d2e]" />
            <div className="h-11 w-32 animate-pulse rounded-full bg-[#1d1926]" />
          </div>
        </div>
      </div>

      {/* Search bar skeleton */}
      <div className="mx-auto max-w-7xl px-2 pt-8 sm:px-4">
        <div className="mx-auto h-11 w-full max-w-md animate-pulse rounded-full bg-[#16131d]" />
      </div>

      {/* Row skeletons */}
      {[0, 1].map((row) => (
        <div key={row} className="mt-10 px-4 sm:px-6">
          <div className="mb-4 h-7 w-40 animate-pulse rounded bg-[#231d2e]" />
          <div className="scrollbar-thin flex gap-4 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-36 shrink-0 md:w-44">
                <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-[#16131d]" />
                <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-[#1d1926]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
