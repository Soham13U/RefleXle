import { useEffect, useRef, useState } from "react";

export default function HiddenGuessModal({
  open,
  onClose,
  onSubmit,
  canSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (word: string) => void;
  canSubmit: boolean;
}) {
  const [word, setWord] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setWord("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  if (!open) return null;

  const submitBtnBase =
    "px-3 py-2 rounded font-semibold bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-900 p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-2">Guess the hidden word</h2>
        <p className="text-sm text-neutral-400 mb-4">
          You have <b>one</b> attempt. If you’re wrong, the game ends.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            onSubmit(word.trim().toLowerCase());
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            maxLength={5}
            className="flex-1 rounded bg-neutral-800 border border-neutral-700 px-3 py-2 uppercase tracking-widest"
            placeholder=""
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || word.trim().length !== 5}
              className={submitBtnBase}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
