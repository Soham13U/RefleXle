import type { GameState } from "../hooks/useGame";

export default function ResultModal({
  open,
  onClose,
  state,
  shareString,
  onNewUnlimited,
}: {
  open: boolean;
  onClose: () => void;
  state: GameState;
  shareString: string;
  onNewUnlimited: () => void;
}) {
  if (!open) return null;

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareString);
      alert("Share text copied!");
    } catch {
      alert("Failed to copy.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-lg border border-neutral-800 bg-neutral-900 p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-2">Results</h2>
        <div className="text-sm text-neutral-300 mb-1">
          Hidden word: <b className="uppercase">{state.hiddenWord}</b>
        </div>
        <div className="text-sm text-neutral-400 mb-4">
          Outcome: {state.status === "won" ? "You guessed it!" : "Game over"}
          {state.hiddenGuess ? (
            <>
              {" "}
              (guess: <b className="uppercase">{state.hiddenGuess}</b> at round{" "}
              {state.hiddenGuessRoundIndex ?? "?"})
            </>
          ) : null}
        </div>

        <pre className="bg-neutral-950/60 border border-neutral-800 rounded p-3 text-xs whitespace-pre-wrap overflow-auto mb-4">
{shareString}
        </pre>

        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          <button
            className="px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700"
            onClick={copyShare}
          >
            Copy Result
          </button>
          {state.mode === "unlimited" && (
            <button
              className="px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700"
              onClick={onNewUnlimited}
            >
              New Unlimited
            </button>
          )}
          <button
            className="px-3 py-2 rounded bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
