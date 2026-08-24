"use client";
import { useRouter } from "next/navigation";

export default function SeasonSelect({ tvId, current, seasons }) {
  const router = useRouter();
  const options = seasons.filter((s) => s.episode_count > 0);

  return (
    <select
      value={current}
      onChange={(e) => router.push(`/tv/${tvId}/season/${e.target.value}`)}
      aria-label="Select season"
      className="cursor-pointer rounded-full border border-[#2b2436] bg-[#16131d] px-4 py-2 text-sm text-[#f4efe6] transition-colors hover:border-[#e8b44d]/40 focus:border-[#e8b44d]/60 focus:outline-none"
    >
      {options.map((s) => (
        <option key={s.id} value={s.season_number}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
