export default function ColorLegend() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 grid place-items-center rounded bg-neutral-800 text-neutral-300 border border-neutral-700">■</div>
        <div>
          <b>Black</b> — letter absent (Wordle’s gray)
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 grid place-items-center rounded bg-amber-400 text-black">▲</div>
        <div>
          <b>Yellow</b> — letter exists elsewhere (misplaced)
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 grid place-items-center rounded bg-emerald-500 text-black">●</div>
        <div>
          <b>Green</b> — letter &amp; position match
        </div>
      </div>
    </div>
  );
}
