import MediaCard from "./MediaCard";

export default function Row({ heading, items }) {
  if (!items?.length) return null;
  return (
    <section aria-label={heading} className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-100">{heading}</h2>
      <div className="row-scroll -mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
        {items.map((item) => (
          <MediaCard key={`${item.media_type || "m"}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}
