import type { GameState } from "../hooks/useGame";
import RoundRow from "./RoundRow";

export default function Board({
  state,
  onCycle,
  onSubmitRound,
  onNewUnlimited,
}: {
  state: GameState;
  onCycle: (i: number) => void;
  onSubmitRound: () => void;
  onNewUnlimited: () => void;
}) {
  const current = state.rounds[state.roundIndex];

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-neutral-400">
          Round {state.roundIndex + 1} / {state.rounds.length}
        </div>
        <div className="flex gap-2">
          {state.mode === "unlimited" && (
            <button
              className="px-3 py-2 text-sm rounded bg-neutral-800 hover:bg-neutral-700"
              onClick={onNewUnlimited}
            >
              New Game
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {state.rounds.map((r) => (
          <RoundRow
            key={r.index}
            round={r}
            isActive={r.index === state.roundIndex && state.status === "playing"}
            onCycle={onCycle}
            onSubmit={onSubmitRound}
          />
        ))}
      </div>

      {current?.submitted === false && state.status === "playing" && (
        <div className="mt-3 text-xs text-neutral-500">
          Tip: Click tiles to cycle Black → Yellow → Green. Submit to lock a row.
        </div>
      )}
    </section>
  );
}
