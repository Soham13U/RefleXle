export default function ModeToggle({
  onDaily,
  onUnlimited,
}: {
  onDaily: () => void;
  onUnlimited: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onDaily}
        className="px-3 py-2 text-sm rounded bg-neutral-800 hover:bg-neutral-700"
      >
        Daily
      </button>
      <button
        onClick={onUnlimited}
        className="px-3 py-2 text-sm rounded bg-neutral-800 hover:bg-neutral-700"
      >
        Unlimited
      </button>
    </div>
  );
}
