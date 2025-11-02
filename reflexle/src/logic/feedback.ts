import type { Pattern } from "../hooks/useGame";

// Standard Wordle feedback computation (greens first, then yellows by remaining counts)
export function computeWordleFeedback(guess: string, target: string): Pattern {
  const n = guess.length;
  const res: ("G" | "Y" | "B")[] = Array(n).fill("B");
  const tArr = target.split("");
  const gArr = guess.split("");

  // Count target letters
  const counts: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    const t = tArr[i];
    counts[t] = (counts[t] ?? 0) + 1;
  }

  // Greens
  for (let i = 0; i < n; i++) {
    if (gArr[i] === tArr[i]) {
      res[i] = "G";
      counts[gArr[i]] = (counts[gArr[i]] ?? 0) - 1;
    }
  }

  // Yellows (respect remaining counts)
  for (let i = 0; i < n; i++) {
    if (res[i] !== "G") {
      const ch = gArr[i];
      if ((counts[ch] ?? 0) > 0) {
        res[i] = "Y";
        counts[ch] = (counts[ch] ?? 0) - 1;
      }
    }
  }

  return res as Pattern;
}
