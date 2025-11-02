import type { GameState } from "../hooks/useGame";

const KEY = (mode: "daily" | "unlimited", seed: string) => `reflexle.v1.${mode}.${seed}`;

export function saveSnapshot(mode: "daily" | "unlimited", seed: string, state: GameState) {
  try {
    localStorage.setItem(KEY(mode, seed), JSON.stringify(state));
  } catch {}
}

export function loadSnapshot(mode: "daily" | "unlimited", seed: string): GameState | null {
  try {
    const raw = localStorage.getItem(KEY(mode, seed));
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

export function clearSnapshotKey(mode: "daily" | "unlimited", seed: string) {
  try {
    localStorage.removeItem(KEY(mode, seed));
  } catch {}
}
