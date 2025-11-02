export default function InfoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-lg border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="text-lg font-semibold">How to play</h2>
          <button
            aria-label="Close"
            className="h-8 w-8 grid place-items-center rounded bg-neutral-800 hover:bg-neutral-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm text-neutral-300">
          <p>
            You’re given <b>5 fixed words</b>, one per round. For each word,
            predict the <b>Wordle-style pattern</b> it would produce against the hidden word:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><b>Black</b>: letter not in the word</li>
            <li><b>Yellow</b>: letter in word, wrong position</li>
            <li><b>Green</b>: letter in correct position</li>
          </ul>
          <p>
            Click the 5 boxes to cycle <b>Black → Yellow → Green</b>, then <b>Submit</b> to lock
            the round and see how close your pattern was.
          </p>
          <p>
            You have <b>one try</b> to <b>Guess the Hidden Word</b> at any time.
            Guessing earlier awards <b>more points</b>. A wrong guess ends the game.
            If you finish all 5 rounds without guessing, you’ll be <b>forced</b> to guess.
          </p>
          <p className="text-neutral-400">
            Share results. Good luck!
          </p>
        </div>
      </div>
    </div>
  );
}
