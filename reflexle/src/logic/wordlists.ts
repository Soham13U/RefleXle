
export async function loadWordLists(): Promise<{ solutions: string[]; probes: string[] }> {
  const base = import.meta.env.BASE_URL; // e.g. "/" or "/RefleXle/"
  try {
    const [sol, pro] = await Promise.all([
      fetch(`${base}solutions.txt`).then(r => (r.ok ? r.text() : "")),
      fetch(`${base}probes.txt`).then(r => (r.ok ? r.text() : "")),
    ]);

    const solutions = sol
      .split(/\r?\n/)
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const probes = pro
      .split(/\r?\n/)
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    return { solutions, probes };
  } catch (err) {
    console.error("Failed to load word lists:", err);
    return {
      solutions: ["crane", "bring", "point", "flash", "vivid"],
      probes: ["slate", "crane", "point", "audio", "plant"],
    };
  }
}
