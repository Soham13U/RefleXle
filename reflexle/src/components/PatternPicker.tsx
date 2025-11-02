type Color = "B" | "Y" | "G";

export default function PatternPicker({
  pattern,
  onCycle,
  disabled,
}: {
  pattern: Color[];            // accept array of 5 colors
  onCycle: (index: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1 sm:gap-2">
      {pattern.map((c, i) => {
        const label = c === "B" ? "Black" : c === "Y" ? "Yellow" : "Green";

        const base =
          "h-10 w-10 rounded grid place-items-center font-semibold text-sm";
        const colorClass =
          c === "B"
            ? "bg-neutral-800 text-neutral-300 border border-neutral-700"
            : c === "Y"
            ? "bg-amber-400 text-black"
            : "bg-emerald-500 text-black";
        const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";

        return (
          <button
            key={i}
            type="button"
            aria-label={`Pattern tile ${i + 1}: ${label}`}
            className={`${base} ${colorClass} ${disabledClass}`}
            onClick={() => !disabled && onCycle(i)}
          >
            <span className="sr-only">{label}</span>
            {c === "B" ? "■" : c === "Y" ? "▲" : "●"}
          </button>
        );
      })}
    </div>
  );
}
