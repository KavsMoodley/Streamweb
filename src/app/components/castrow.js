import Image from "next/image";

export default function CastRow({ cast }) {
  if (!cast?.length) return null;

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-marquee text-2xl tracking-wide text-[#f4efe6]">
          Top Billed Cast
        </h2>
        <span className="h-px max-w-[140px] flex-1 bg-gradient-to-r from-[#e8b44d]/60 to-transparent" />
      </div>

      <div className="scrollbar-thin flex gap-4 overflow-x-auto pb-2">
        {cast.slice(0, 12).map((person) => (
          <div key={person.credit_id} className="w-28 shrink-0 text-center sm:w-32">
            {person.profile_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                alt={person.name}
                width={185}
                height={278}
                loading="lazy"
                className="h-36 w-28 rounded-xl border border-[#2b2436] object-cover sm:h-40 sm:w-32"
              />
            ) : (
              <div className="flex h-36 w-28 items-center justify-center rounded-xl border border-[#2b2436] bg-[#231d2e] font-marquee text-3xl text-[#6f6879] sm:h-40 sm:w-32">
                {person.name?.charAt(0)}
              </div>
            )}
            <p className="mt-2 truncate text-sm font-medium text-[#f4efe6]">
              {person.name}
            </p>
            <p className="truncate text-xs text-[#948c9e]">{person.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
