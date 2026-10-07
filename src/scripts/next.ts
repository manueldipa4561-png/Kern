// Where "keep going" leads: the first open mission in the current field, then in the other chosen fields in order.
// Free of DOM code so scripts/check-sync.ts can test it (npm test).
export type Spot = { f: string; i: number };

// Missions come in rounds of 3 (index 0-2 is round 1, 3-5 round 2). The round in play is the first with a mission left,
// or the last one when everything is done. A mission's kind (improve / start from zero / partner) is its index % PER_ROUND.
export const PER_ROUND = 3;
export function roundOf(done: ReadonlySet<number>, total: number): number {
  const rounds = Math.max(1, Math.ceil(total / PER_ROUND));
  for (let i = 0; i < total; i++) if (!done.has(i)) return Math.floor(i / PER_ROUND);
  return rounds - 1;
}

export function nextSpot(field: string, fields: readonly string[], done: (f: string) => ReadonlySet<number>, perField = 3): Spot | null {
  for (const f of [field, ...fields.filter((x) => x !== field)]) {
    const finished = done(f);
    for (let i = 0; i < perField; i++) if (!finished.has(i)) return { f, i };
  }
  return null;
}
