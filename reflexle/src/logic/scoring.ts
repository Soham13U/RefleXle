import type { GameState } from "../hooks/useGame";

export function hiddenGuessBonusForRound(roundIndex: number) {
  // roundIndex is 0..5 (5 means "after last round")
  return [10, 8, 6, 4, 3, 2][Math.min(Math.max(roundIndex, 0), 5)];
}

export function computeScore(state: GameState) {
  const perRound: number[] = [];
  let tiles = 0;

  state.rounds.forEach((r) => {
    if (!r.submitted || !r.evalTiles) {
      perRound.push(0);
      return;
    }
    const row =
      r.evalTiles.reduce((sum, e) => sum + (e === "correct" ? 2 : e === "near" ? 1 : 0), 0) +
      (r.evalTiles.every((e) => e === "correct") ? 2 : 0); // perfect row bonus
    tiles += row;
    perRound.push(row);
  });

  let hidden = 0;
  if (state.hiddenGuessOutcome === "correct") {
    hidden = hiddenGuessBonusForRound(state.hiddenGuessRoundIndex ?? 5);
  }

  return { perRound, tiles, hidden, total: tiles + hidden };
}
