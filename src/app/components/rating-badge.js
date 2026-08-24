export default function RatingBadge({ score, className = "" }) {
  if (!score || score <= 0) return null;
  const s = score.toFixed(1);
  const tone =
    score >= 7.5
      ? "bg-emerald-500/90 text-emerald-950"
      : score >= 6.5
        ? "bg-[#e8b44d] text-[#0b0a10]"
        : "bg-[#b32530] text-[#f4efe6]";
  return (
    <span
      className={`absolute right-2 top-2 z-10 rounded-md px-2 py-1 text-xs font-bold ${tone} ${className}`}
    >
      ★ {s}
    </span>
  );
}
