// Loads public/solutions.txt and public/probes.txt (fallback to small built-ins)

const fallbackSolutions = [
  "crane","bring","point","plant","slate","audio","grind","shard","smile","trace"
];
const fallbackProbes = ["slate","crane","point","audio","plant"];

async function fetchList(url: string): Promise<string[] | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    return text
      .split(/\r?\n/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => /^[a-z]{5}$/.test(s));
  } catch {
    return null;
  }
}

export async function loadWordLists(): Promise<{ solutions: string[]; probes: string[]; }> {
  // Try /solutions.txt and /probes.txt from public root
  const [sol, pro] = await Promise.all([
    fetchList("/solutions.txt"),
    fetchList("/probes.txt"),
  ]);

  return {
    solutions: sol && sol.length ? sol : fallbackSolutions,
    probes: pro && pro.length ? pro : fallbackProbes,
  };
}
