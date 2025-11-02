import type { Pattern, TileEval } from "../hooks/useGame";

// Compare player's predicted pattern (B/Y/G) vs actual pattern (B/Y/G)
// Return per-tile evaluation: correct | near | miss
export function comparePatterns(player: Pattern, actual: Pattern): TileEval[] {
  const n = player.length;
  const out: TileEval[] = Array(n).fill("miss");

  // count colors in actual
  const count: Record<"B" | "Y" | "G", number> = { B: 0, Y: 0, G: 0 };
  actual.forEach((c) => (count[c as "B" | "Y" | "G"] = (count[c as "B" | "Y" | "G"] ?? 0) + 1));

  // exact matches first
  for (let i = 0; i < n; i++) {
    if (player[i] === actual[i]) {
      out[i] = "correct";
      const key = player[i] as "B" | "Y" | "G";
      count[key] = (count[key] ?? 0) - 1;
    }
  }

  // nears (right color, wrong position), respecting remaining counts
  for (let i = 0; i < n; i++) {
    if (out[i] === "correct") continue;
    const key = player[i] as "B" | "Y" | "G";
    if ((count[key] ?? 0) > 0) {
      out[i] = "near";
      count[key] = (count[key] ?? 0) - 1;
    } else {
      out[i] = "miss";
    }
  }

  return out;
}
