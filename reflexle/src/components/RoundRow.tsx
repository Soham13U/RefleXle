import PatternPicker from "./PatternPicker";
import ResultTiles from "./ResultTiles";
import type { Round } from "../hooks/useGame";

export default function RoundRow({
  round,
  isActive,
  onCycle,
  onSubmit,
}: {
  round: Round;
  isActive: boolean;
  onCycle: (i: number) => void;
  onSubmit: () => void;
}) {
  const wrapperBase =
    "grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] items-center gap-3 p-3 rounded border";
  const wrapperTheme = "border-neutral-800 bg-neutral-900/40";

  return (
    <div className={`${wrapperBase} ${wrapperTheme}`}>
      {/* Fixed Guess */}
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {round.fixedGuess.split("").map((ch, i) => (
          <div
            key={i}
            className="h-10 w-10 grid place-items-center rounded bg-neutral-800 text-neutral-200 font-semibold uppercase"
          >
            {ch}
          </div>
        ))}
      </div>

      {/* Pattern picker */}
      <div className="flex items-center justify-center">
        <PatternPicker
          disabled={!isActive || round.submitted}
          pattern={(round.playerPattern ?? ["B", "B", "B", "B", "B"]) as (
            | "B"
            | "Y"
            | "G"
          )[]} // allow array form
          onCycle={onCycle}
        />
      </div>

      {/* Submit / Result */}
      <div className="flex items-center justify-end gap-2">
        {!round.submitted ? (
          <button
            className="px-3 py-2 text-sm rounded bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50"
            onClick={onSubmit}
            disabled={!isActive}
          >
            Submit
          </button>
        ) : (
          <ResultTiles evalTiles={round.evalTiles ?? []} />
        )}
      </div>
    </div>
  );
}
