import { useCallback, useEffect, useMemo, useState } from "react";
import { initPRNG, makeDailySeed, makeRandomSeed, pickHiddenWord, scheduleFixedGuesses } from "../logic/seed";
import { computeWordleFeedback } from "../logic/feedback";
import { comparePatterns } from "../logic/patterns";
import { loadWordLists } from "../logic/wordlists";
import { computeScore, hiddenGuessBonusForRound } from "../logic/scoring";
import { loadSnapshot, saveSnapshot, clearSnapshotKey } from "../logic/persistence";
import { buildShareString } from "../logic/share";

export type Color = "B" | "Y" | "G";
export type TileEval = "correct" | "near" | "miss";
export type Pattern = [Color, Color, Color, Color, Color];

export type Round = {
  index: number;
  fixedGuess: string;
  actualPattern: Pattern;
  playerPattern?: Pattern;
  evalTiles?: TileEval[];
  submitted: boolean;
};

export type GameState = {
  mode: "daily" | "unlimited";
  seed: string;
  hiddenWord: string;
  rounds: Round[];
  roundIndex: number; // 0..4
  status: "playing" | "won" | "lost" | "finished";

  hiddenGuess?: string;
  hiddenGuessRoundIndex?: number; // 0..5 (5 means after last round)
  hiddenGuessOutcome?: "correct" | "wrong";

  stats: { totalCorrectTiles: number; totalNearTiles: number; perfectRows: number; };
  startedAt: number;
  endedAt?: number;
};

const CONF = { wordLength: 5, maxRounds: 5 } as const;

type UseGameOpts = {
  onFinish?: () => void;
  onForceGuess?: () => void;
};

export function useGame(opts?: UseGameOpts) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<GameState | null>(null);
  const [solutions, setSolutions] = useState<string[] | null>(null);
  const [probes, setProbes] = useState<string[] | null>(null);

  // load lists
  useEffect(() => {
    (async () => {
      const { solutions, probes } = await loadWordLists();
      setSolutions(solutions);
      setProbes(probes);
      setReady(true);
    })();
  }, []);

  const initGame = useCallback((mode: "daily" | "unlimited", seed?: string) => {
    if (!solutions || !probes) return;
    const seedStr = seed ?? (mode === "daily" ? makeDailySeed() : makeRandomSeed());
    const prng = initPRNG(seedStr);
    const hiddenWord = pickHiddenWord(prng, solutions);
    const fg = scheduleFixedGuesses(prng, probes, CONF.maxRounds);

    const rounds: Round[] = fg.map((g, i) => ({
      index: i,
      fixedGuess: g,
      actualPattern: computeWordleFeedback(g, hiddenWord),
      submitted: false,
    })) as Round[];

    const st: GameState = {
      mode,
      seed: seedStr,
      hiddenWord,
      rounds,
      roundIndex: 0,
      status: "playing",
      stats: { totalCorrectTiles: 0, totalNearTiles: 0, perfectRows: 0 },
      startedAt: Date.now(),
    };
    setState(st);
    saveSnapshot(mode, seedStr, st);
  }, [solutions, probes]);

  const startDaily = useCallback(() => {
    if (!solutions || !probes) return;
    const todaySeed = makeDailySeed();
    const saved = loadSnapshot("daily", todaySeed);
    if (saved) {
      setState(saved);
    } else {
      initGame("daily", todaySeed);
    }
  }, [solutions, probes, initGame]);

  const startUnlimited = useCallback(() => {
    initGame("unlimited");
  }, [initGame]);

  useEffect(() => {
    if (ready && !state) {
      // default landing: start Daily
      startDaily();
    }
  }, [ready, state, startDaily]);

  const cycleTile = useCallback((i: number) => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.status !== "playing") return prev;
      const r = prev.rounds[prev.roundIndex];
      if (!r || r.submitted) return prev;

      const p = (r.playerPattern ?? ["B", "B", "B", "B", "B"]) as Pattern;
      const next = p.slice() as Pattern;
      const order: Color[] = ["B", "Y", "G"];
      const idx = order.indexOf(next[i]);
      next[i] = order[(idx + 1) % order.length];

      const rounds = prev.rounds.slice();
      rounds[prev.roundIndex] = { ...r, playerPattern: next };

      const ns = { ...prev, rounds };
      saveSnapshot(ns.mode, ns.seed, ns);
      return ns;
    });
  }, []);

  const submitRound = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.status !== "playing") return prev;
      const r = prev.rounds[prev.roundIndex];
      if (!r || r.submitted) return prev;

      const player = (r.playerPattern ?? ["B", "B", "B", "B", "B"]) as Pattern;
      const evalTiles = comparePatterns(player, r.actualPattern);
      const correctCount = evalTiles.filter((x) => x === "correct").length;
      const nearCount = evalTiles.filter((x) => x === "near").length;
      const perfect = correctCount === 5;

      const rounds = prev.rounds.slice();
      rounds[prev.roundIndex] = {
        ...r,
        playerPattern: player,
        evalTiles,
        submitted: true,
      };

      let roundIndex = prev.roundIndex + 1;
      let status = prev.status;
      const stats = {
        totalCorrectTiles: prev.stats.totalCorrectTiles + correctCount,
        totalNearTiles: prev.stats.totalNearTiles + nearCount,
        perfectRows: prev.stats.perfectRows + (perfect ? 1 : 0),
      };

      const ns = { ...prev, rounds, roundIndex, stats, status };
      saveSnapshot(ns.mode, ns.seed, ns);
      return ns;
    });
  }, []);

  const canSubmitHiddenGuess = useCallback(() => {
    if (!state) return false;
    return state.status === "playing" && !state.hiddenGuessOutcome;
  }, [state]);

  const openHiddenGuess = useCallback(() => {
    // no-op: handled in App via modal state
  }, []);

  const submitHiddenGuess = useCallback((word: string) => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.status !== "playing" || prev.hiddenGuessOutcome) return prev;

      const correct = word === prev.hiddenWord;
      const status = correct ? "won" : "lost";
      const endedAt = Date.now();

      const ns: GameState = {
        ...prev,
        hiddenGuess: word,
        hiddenGuessRoundIndex: prev.roundIndex, // 0..5
        hiddenGuessOutcome: correct ? "correct" : "wrong",
        status,
        endedAt,
      };

      saveSnapshot(ns.mode, ns.seed, ns);
      if (opts?.onFinish) opts.onFinish();
      return ns;
    });
  }, []);

  const forceHiddenGuessIfNeeded = useCallback(() => {
    if (!state) return;
    if (state.status !== "playing") return;

    const allSubmitted = state.roundIndex >= state.rounds.length;
    const used = !!state.hiddenGuessOutcome;

    if (allSubmitted && !used) {
      // force the modal
      if (opts?.onForceGuess) opts.onForceGuess();
    }
  }, [state]);

  const newUnlimitedGame = useCallback(() => {
    // clear prev unlimited snapshot for cleanliness
    if (state?.mode === "unlimited") {
      clearSnapshotKey("unlimited", state.seed);
    }
    initGame("unlimited");
  }, [state, initGame]);

  const shareString = useCallback(() => {
    if (!state) return "";
    return buildShareString(state, computeScore(state), hiddenGuessBonusForRound);
  }, [state]);

  return {
    ready,
    state,
    startDaily,
    startUnlimited,
    openHiddenGuess,
    submitHiddenGuess,
    cycleTile,
    submitRound,
    canSubmitHiddenGuess,
    forceHiddenGuessIfNeeded,
    newUnlimitedGame,
    shareString,
  };
}
