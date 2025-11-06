import { useEffect, useState } from "react";
import Header from "./components/Header";
import Board from "./components/Board";
import HiddenGuessModal from "./components/HiddenGuessModal";
import ResultModal from "./components/ResultModal";
import ColorLegend from "./components/ColorLegend";
import InfoModal from "./components/InfoModal";
import { useGame } from "./hooks/useGame";

export default function App() {
  const [showHiddenGuess, setShowHiddenGuess] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const {
    state,
    ready,
    startDaily,
    startUnlimited,
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

  useEffect(() => {
    const KEY = "reflexle_hasSeenInfo_v1";
    try {
      if (!localStorage.getItem(KEY)) {
        setShowInfo(true);
        localStorage.setItem(KEY, "1");
      }
    } catch {
      setShowInfo(true);
    }
  }, []);

  useEffect(() => {
    if (ready && state) {
      forceHiddenGuessIfNeeded();
    }
  }, [ready, state, forceHiddenGuessIfNeeded]);

  if (!ready || !state) {
    return (
      <div className="min-h-screen grid place-items-center bg-neutral-950 text-neutral-100">
        <div className="text-center">
          <div className="animate-pulse text-sm text-neutral-400">Loading…</div>
        </div>
      </div>
    );
  }

  const showFloatingCTA =
    state.status === "playing" && canSubmitHiddenGuess() && !state.hiddenGuessOutcome;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header
        mode={state.mode}
        seed={state.seed}
        onDaily={startDaily}
        onUnlimited={startUnlimited}
        onOpenInfo={() => setShowInfo(true)}
      />

      <main className="mx-auto max-w-3xl px-4 md:px-6 py-6 md:py-8">
        <Board
          state={state}
          onCycle={(i) => cycleTile(i)}
          onSubmitRound={() => submitRound()}
          onNewUnlimited={() => newUnlimitedGame()}
        />
        <div className="mt-6">
          <ColorLegend />
        </div>
      </main>

      
      {showFloatingCTA && (
        <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4">
          <button
            className="px-5 py-3 rounded-full bg-emerald-500 text-black font-semibold shadow-lg hover:bg-emerald-400"
            onClick={() => setShowHiddenGuess(true)}
          >
            Guess Hidden Word
          </button>
        </div>
      )}

      <HiddenGuessModal
        open={showHiddenGuess}
        onClose={() => setShowHiddenGuess(false)}
        canSubmit={canSubmitHiddenGuess()}
        onSubmit={(word) => {
          submitHiddenGuess(word);
          setShowHiddenGuess(false);
        }}
      />

      <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />

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
