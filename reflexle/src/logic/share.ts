import type { GameState } from "../hooks/useGame";


export function buildShareString(
  state: GameState,
  score: { perRound: number[]; tiles: number; hidden: number; total: number },
  hiddenBonusLookup: (r: number) => number
) {
  const header = `RefleXle - ${state.mode} ${state.seed}`;

  const hiddenLine =
    state.hiddenGuessOutcome === "correct"
      ? `Guess: ✅ at R${(state.hiddenGuessRoundIndex ?? 0) + 1} (+${hiddenBonusLookup(
          state.hiddenGuessRoundIndex ?? 5
        )})`
      : state.hiddenGuessOutcome === "wrong"
      ? `Guess: ❌ at R${(state.hiddenGuessRoundIndex ?? 0) + 1}`
      : `Guess: -`;

  // Per-round glyphs only (no numeric row scores, no spoilers)
  const rows = state.rounds
    .map((r, i) => {
      if (!r.submitted || !r.evalTiles) return `R${i + 1}: (—)`;
      const glyphs = r.evalTiles
        .map((e) => (e === "correct" ? "✔" : e === "near" ? "⟂" : "✖"))
        .join("");
      return `R${i + 1}: ${glyphs}`;
    })
    .join("\n");


  const footer = `\nScore: ${score.total}`;

  return `${header}\n${hiddenLine}\n${rows}${footer}`;
}
