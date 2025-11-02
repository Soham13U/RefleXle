export default function ResultTiles({
  evalTiles,
}: {
  evalTiles: ("correct" | "near" | "miss")[];
}) {
  return (
    <div className="flex gap-1 sm:gap-2" aria-label="Pattern evaluation">
      {evalTiles.map((e, i) => {
        const base =
          "h-10 w-10 rounded grid place-items-center text-xs font-semibold";
        const ring =
          e === "correct"
            ? "ring-2 ring-emerald-400"
            : e === "near"
            ? "ring-2 ring-amber-400"
            : "ring-2 ring-neutral-600";
        const glyph = e === "correct" ? "✔" : e === "near" ? "⟂" : "✖";

        return (
          <div key={i} className={`${base} ${ring}`} title={e}>
            {glyph}
          </div>
        );
      })}
    </div>
  );
}
