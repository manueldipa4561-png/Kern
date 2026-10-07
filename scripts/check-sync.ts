// Checks the sync rules in src/scripts/sync.ts and the next-mission rule in src/scripts/next.ts. Run: npm test (Node 22.18+ runs .ts directly).
import assert from 'node:assert/strict';
import { nextSpot, roundOf } from '../src/scripts/next.ts';
import { akey, mergeAnswers, stamp, type Tomb } from '../src/scripts/sync.ts';
import { MAX_COUNT, MAX_TIME, clampCount, inTime } from '../src/scripts/valid.ts';

const x = { f: 'Design', i: 0, at: 1000, t: 'x' };
const y = { f: 'Design', i: 1, at: 2000, t: 'y' };
const keys = (r: { answers: { f: string; i: number; at: number }[] }) => r.answers.map(akey);

// First sign-in on a device: nothing is lost from either side.
assert.deepEqual(keys(mergeAnswers([x], [y], [], [])), [akey(x), akey(y)]);
// Deleted on another device: this device's old copy does not bring it back.
assert.deepEqual(keys(mergeAnswers([x, y], [y], [], [[akey(x), 1500]])), [akey(y)]);
// An edit beats the older copy, whichever side has it.
const x2 = { ...x, t: 'x edited', ed: 3000 };
assert.equal(mergeAnswers([x], [x2], [], []).answers[0].t, 'x edited');
assert.equal(mergeAnswers([x2], [x], [], []).answers[0].t, 'x edited');
// Undo after the delete already synced: the restored answer is newer than its tombstone, so it stays.
assert.deepEqual(keys(mergeAnswers([], [{ ...x, ed: 1600 }], [[akey(x), 1500]], [])), [akey(x)]);
// A device whose clock is behind still stamps changes newer than what it saw.
assert.ok(stamp(Date.now() + 60_000) > Date.now() + 60_000);
// Tombstones are capped.
const many: Tomb[] = Array.from({ length: 300 }, (_, k) => [`Design.0.${k}`, k]);
assert.equal(mergeAnswers([], [], many, []).gone.length, 200);

// Next mission: the open one in the current field first, then the other chosen fields in order, then nothing.
const finished: Record<string, number[]> = { Design: [0, 1], Writing: [0, 1, 2], Code: [] };
const doneIn = (f: string) => new Set(finished[f] ?? []);
assert.deepEqual(nextSpot('Design', ['Design', 'Writing'], doneIn), { f: 'Design', i: 2 });
assert.deepEqual(nextSpot('Writing', ['Design', 'Writing', 'Code'], doneIn), { f: 'Design', i: 2 });
assert.deepEqual(nextSpot('Writing', ['Writing', 'Code'], doneIn), { f: 'Code', i: 0 });
assert.equal(nextSpot('Writing', ['Writing'], doneIn), null);
// A field that was never chosen is not suggested, and a gap earlier in the list is found first.
assert.deepEqual(nextSpot('Design', ['Design'], (f) => new Set(f === 'Design' ? [1, 2] : [])), { f: 'Design', i: 0 });

// With 6 missions per field the search runs through both rounds, in order.
const six = (...n: number[]) => (f: string) => new Set(f === 'Design' ? n : []);
assert.deepEqual(nextSpot('Design', ['Design'], six(0, 1, 2, 3), 6), { f: 'Design', i: 4 });
assert.deepEqual(nextSpot('Design', ['Design', 'Code'], six(0, 1, 2, 3, 4, 5), 6), { f: 'Code', i: 0 });
assert.equal(nextSpot('Design', ['Design'], six(0, 1, 2, 3, 4, 5), 6), null);
assert.deepEqual(nextSpot('Design', ['Design'], six(0, 1, 2, 4, 5), 6), { f: 'Design', i: 3 }); // a gap left behind is found

// Rounds: missions come 3 at a time. The round in play is the first with a mission left, or the last one when all are done.
const some = (...n: number[]) => new Set(n);
assert.equal(roundOf(some(), 6), 0);
assert.equal(roundOf(some(0, 1), 6), 0);
assert.equal(roundOf(some(0, 1, 2), 6), 1);
assert.equal(roundOf(some(0, 1, 2, 3), 6), 1);
assert.equal(roundOf(some(0, 1, 2, 3, 4, 5), 6), 1);
assert.equal(roundOf(some(1, 2, 3, 4, 5), 6), 0); // a gap in round 1 keeps round 1 in play
assert.equal(roundOf(some(0, 1, 2), 3), 0); // a field with a single round stays on it

// Stored numbers: a time must be one a Date can hold (else "Invalid Date" and a NaN streak), a count is a whole number up to a ceiling.
assert.ok(inTime(Date.now()) && inTime(0) && inTime(-1e12) && inTime(MAX_TIME));
assert.ok(!Number.isNaN(new Date(MAX_TIME).getTime()), 'the limit itself is a real date');
for (const bad of [1e20, MAX_TIME + 1e4, NaN, Infinity, -Infinity, '1700000000000', null, undefined, {}]) assert.ok(!inTime(bad), `inTime(${String(bad)})`);
assert.equal(clampCount(335), 335);
assert.equal(clampCount(12.9), 12);
assert.equal(clampCount(-5), 0);
assert.equal(clampCount(1e308), MAX_COUNT);
assert.equal(clampCount(1e21), MAX_COUNT);
for (const bad of [NaN, Infinity, '9', null, undefined]) assert.equal(clampCount(bad), 0, `clampCount(${String(bad)})`);

console.log('sync rules: ok');
