import { Info } from "lucide-react";
import ModeToggle from "./ModeToggle";

export default function Header(props: {
  mode: "daily" | "unlimited";
  seed: string;
  onDaily: () => void;
  onUnlimited: () => void;
  onOpenInfo: () => void;
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
            aria-label="How to play"
            title="How to play"
            onClick={props.onOpenInfo}
            className="h-8 w-8 grid place-items-center rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
          >
            <Info className="h-4 w-4" />
          </button>
          <ModeToggle onDaily={props.onDaily} onUnlimited={props.onUnlimited} />
        </div>
      </div>
    </header>
  );
}
