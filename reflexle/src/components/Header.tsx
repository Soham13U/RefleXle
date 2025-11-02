import ModeToggle from "./ModeToggle";

export default function Header(props: {
  mode: "daily" | "unlimited";
  seed: string;
  onDaily: () => void;
  onUnlimited: () => void;
  onOpenHiddenGuess: () => void;
  hiddenGuessUsed: boolean;
  canGuess: boolean;
}) {
  return (
    <header className="border-b border-neutral-800">
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold tracking-wide">RefleXle</div>
          <span className="text-xs uppercase tracking-wider px-2 py-1 rounded bg-neutral-800 text-neutral-300">
            {props.mode}
          </span>
          <span className="hidden sm:inline text-xs text-neutral-500">
            seed: {props.seed}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 text-sm rounded bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50"
            onClick={props.onOpenHiddenGuess}
            disabled={!props.canGuess || props.hiddenGuessUsed}
            title={
              props.hiddenGuessUsed
                ? "Hidden word guess already used"
                : "One try only"
            }
          >
            Guess Hidden Word
          </button>
          <ModeToggle onDaily={props.onDaily} onUnlimited={props.onUnlimited} />
        </div>
      </div>
    </header>
  );
}
