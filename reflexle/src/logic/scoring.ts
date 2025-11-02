import type { GameState } from "../hooks/useGame";


export function hiddenGuessBonusForRound(roundIndex: number) {
  // Tunable scale; strictly descending
  const scale = [10, 8, 6, 4, 3, 2] as const;
  const idx = Math.min(Math.max(roundIndex, 0), 5);
  return scale[idx];
}


export function computeScore(state: GameState) {
  // No row points anymore — we keep the shape for compatibility with UI
  const perRound = state.rounds.map(() => 0);
  const tiles = 0;

  let hidden = 0;
  if (state.hiddenGuessOutcome === "correct") {
    hidden = hiddenGuessBonusForRound(state.hiddenGuessRoundIndex ?? 5);
  } else {
    hidden = 0; // wrong or not used => zero
  }

  return { perRound, tiles, hidden, total: hidden };
}
