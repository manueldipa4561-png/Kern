import { t2 } from './i18n';

// Variable-ratio reward: finishing a mission sometimes drops something, never on a fixed beat.
// Amounts are random inside each tier. A soft safety net (after 3 empty finishes in a row the next one always drops)
// keeps it from feeling rigged against you. Drops are stored on the answer (a.d, a.x) so sync, delete and undo stay exact.
export type Tier = 'none' | 'spark' | 'gem' | 'relic' | 'jackpot';
export type Drop = { tier: Tier; id: string; stones: number }; // id: tier id, or the relic id for a relic

// 12 collectibles. Each icon is a 24x24 outline path set drawn with a 1.8 stroke.
export const RELICS: { id: string; name: string; d: string }[] = [
  { id: 'compass', name: t2('Compass', 'Bussola'), d: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z' },
  { id: 'key', name: t2('Key', 'Chiave'), d: 'M8 15a4 4 0 1 1 3.4-1.9L20 14.5V18h-2.5v-1.5H16V15h-1.5l-3-1.1A4 4 0 0 1 8 15z' },
  { id: 'lantern', name: t2('Lantern', 'Lanterna'), d: 'M9 3h6M10 3v2h4V3M8 8h8v10H8zM8 8l1.5-3h5L16 8M10 18v2h4v-2M12 10v5' },
  { id: 'anchor', name: t2('Anchor', 'Ancora'), d: 'M12 6a1.8 1.8 0 1 0 0-.01zM12 8v12M7 12H5a7 7 0 0 0 14 0h-2M9 11h6' },
  { id: 'map', name: t2('Map', 'Mappa'), d: 'M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14' },
  { id: 'feather', name: t2('Feather', 'Piuma'), d: 'M5 19c0-9 5-14 14-14 0 9-5 14-14 14zM5 19l9-9M10 14h4' },
  { id: 'prism', name: t2('Prism', 'Prisma'), d: 'M12 4l8 14H4zM12 4v14M7 11h10' },
  { id: 'seed', name: t2('Seed', 'Seme'), d: 'M12 21v-8M12 13c0-4-3-6-7-6 0 4 3 6 7 6zM12 13c0-3 2-5 6-5 0 3-2 5-6 5z' },
  { id: 'kite', name: t2('Kite', 'Aquilone'), d: 'M12 3l6 7-6 8-6-8zM12 3v15M6 10h12M12 18c-2 1-1 3-3 3' },
  { id: 'bell', name: t2('Bell', 'Campana'), d: 'M6 17h12l-1.5-2V10a4.5 4.5 0 0 0-9 0v5zM10 20h4' },
  { id: 'thread', name: t2('Thread', 'Filo'), d: 'M5 6c6 0 6 6 12 6M5 12c6 0 6 6 12 6M17 12a2.5 2.5 0 1 0 0-.01zM17 6a2.5 2.5 0 1 0 0-.01z' },
  { id: 'flame', name: t2('Flame', 'Fiamma'), d: 'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z' },
];

const int = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

// streak: finished missions in a row with no drop. owned: relic ids already found.
// lucky: the first mission finished each day, which is less likely to come up empty.
export function rollDrop(streak: number, owned: string[], lucky = false, rnd0 = Math.random()): Drop {
  const rnd = lucky ? 0.15 + 0.85 * rnd0 : rnd0;
  let tier: Tier = rnd < 0.38 ? 'none' : rnd < 0.72 ? 'spark' : rnd < 0.89 ? 'gem' : rnd < 0.97 ? 'relic' : 'jackpot';
  if (tier === 'none' && streak >= 3) tier = 'spark';
  const left = RELICS.filter((r) => !owned.includes(r.id));
  if (tier === 'relic' && !left.length) tier = 'gem'; // collection complete: relic rolls pay as a gem
  if (tier === 'none') return { tier, id: '', stones: 0 };
  if (tier === 'spark') return { tier, id: 'spark', stones: int(15, 35) };
  if (tier === 'gem') return { tier, id: 'gem', stones: int(50, 95) };
  if (tier === 'jackpot') return { tier, id: 'jackpot', stones: int(150, 260) };
  return { tier, id: left[int(0, left.length - 1)].id, stones: int(10, 30) };
}
