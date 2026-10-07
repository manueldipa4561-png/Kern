// Range checks for numbers read from storage or a synced copy (untrusted input). Free of DOM code so scripts/check-sync.ts can test them (npm test).
export const MAX_TIME = 8.64e15; // a Date cannot hold a time beyond this: past it a list reads "Invalid Date" and a streak turns to NaN
export const MAX_COUNT = 1e7; // no trail comes near this many stones
export const inTime = (n: unknown): n is number => typeof n === 'number' && Math.abs(n) <= MAX_TIME; // false for NaN too
export const clampCount = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) ? Math.min(MAX_COUNT, Math.max(0, Math.floor(n))) : 0);
