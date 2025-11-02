import { useEffect, useState } from "react";
import Header from "./components/Header";
import Board from "./components/Board";
import HiddenGuessModal from "./components/HiddenGuessModal";
import ResultModal from "./components/ResultModal";
import ColorLegend from "./components/ColorLegend";
import { useGame } from "./hooks/useGame";

export default function App() {
  const [showHiddenGuess, setShowHiddenGuess] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const {
    state,
    ready,
    startDaily,
    startUnlimited,
    openHiddenGuess,
    submitHiddenGuess,
    cycleTile,
    submitRound,
    forceHiddenGuessIfNeeded,
    canSubmitHiddenGuess,
    newUnlimitedGame,
    shareString,
  } = useGame({
    onFinish: () => setShowResult(true),
    onForceGuess: () => setShowHiddenGuess(true),
  });

  // Force guess modal after round 5 if needed (only when state exists)
  useEffect(() => {
    if (ready && state) {
      forceHiddenGuessIfNeeded();
    }
  }, [ready, state, forceHiddenGuessIfNeeded]);

  // Unified loading guard: wait for both lists (ready) AND initial game state
  if (!ready || !state) {
    return (
      <div className="min-h-screen grid place-items-center bg-neutral-950 text-neutral-100">
        <div className="text-center">
          <div className="animate-pulse text-sm text-neutral-400">Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header
        mode={state.mode}
        seed={state.seed}
        onDaily={startDaily}
        onUnlimited={startUnlimited}
        onOpenHiddenGuess={() => setShowHiddenGuess(true)}
        hiddenGuessUsed={!!state.hiddenGuessOutcome}
        canGuess={canSubmitHiddenGuess()}
      />

      <main className="mx-auto max-w-3xl px-4 md:px-6 py-6 md:py-8">
        <Board
          state={state}
          onCycle={(i) => cycleTile(i)}
          onSubmitRound={() => submitRound()}
          onOpenHiddenGuess={() => setShowHiddenGuess(true)}
          onNewUnlimited={() => newUnlimitedGame()}
        />
        <div className="mt-6">
          <ColorLegend />
        </div>
      </main>

      <HiddenGuessModal
        open={showHiddenGuess}
        onClose={() => setShowHiddenGuess(false)}
        canSubmit={canSubmitHiddenGuess()}
        onSubmit={(word) => {
          submitHiddenGuess(word);
          setShowHiddenGuess(false);
        }}
      />

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        state={state}
        shareString={shareString()}
        onNewUnlimited={() => {
          setShowResult(false);
          newUnlimitedGame();
        }}
      />
    </div>
  );
}
