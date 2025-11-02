import type { GameState } from "../hooks/useGame";

export function buildShareString(
  state: GameState,
  score: { perRound: number[]; tiles: number; hidden: number; total: number },
  hiddenBonusLookup: (r: number) => number
) {
  const header =
    `RefleXle — ${state.mode} ${state.seed}\n` +
    `Hidden: ${state.hiddenWord.toUpperCase()} — ` +
    (state.hiddenGuessOutcome === "correct"
      ? `✅ at R${(state.hiddenGuessRoundIndex ?? 0) + 1} (+${hiddenBonusLookup(state.hiddenGuessRoundIndex ?? 5)})`
      : state.hiddenGuessOutcome === "wrong"
      ? `❌ at R${(state.hiddenGuessRoundIndex ?? 0) + 1}`
      : `—`);

  const rows = state.rounds
    .map((r, i) => {
      if (!r.submitted || !r.evalTiles) return `R${i + 1}: (—)`;
      const glyphs = r.evalTiles
        .map((e) => (e === "correct" ? "✔" : e === "near" ? "⟂" : "✖"))
        .join("");
      return `R${i + 1}: ${glyphs} (${score.perRound[i]})`;
    })
    .join("\n");

  const footer = `\nScore: tiles=${score.tiles}, hidden=${score.hidden}, total=${score.total}`;

  return `${header}\n${rows}${footer}`;
}
