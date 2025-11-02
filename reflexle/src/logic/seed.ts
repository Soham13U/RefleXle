// Simple deterministic PRNG and seeding utilities

export function makeDailySeed(date = new Date()): string {
  // Use UTC date for global consistency
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function makeRandomSeed(): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0].toString(16);
}

export function initPRNG(seed: string) {
  // mulberry32
  let h = 1779033703 ^ seed.split("").reduce((a, c) => (a * 33) ^ c.charCodeAt(0), 0);
  return function random() {
    h += 0x6D2B79F5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickHiddenWord(prng: () => number, list: string[]) {
  const i = Math.floor(prng() * list.length);
  return list[i];
}

export function scheduleFixedGuesses(prng: () => number, probes: string[], count: number) {
  const pool = probes.slice();
  const picks: string[] = [];
  for (let i = 0; i < count && pool.length; i++) {
    const j = Math.floor(prng() * pool.length);
    picks.push(pool.splice(j, 1)[0]);
  }
  return picks;
}
