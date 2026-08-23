/** Deterministic PRNG (mulberry32) so items/tests can be reproduced from a seed. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

export function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[randInt(rng, 0, arr.length - 1)];
}

/** Fisher-Yates shuffle using the supplied RNG (does not mutate input). */
export function shuffle<T>(rng: () => number, arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Sample `count` distinct items from arr (count <= arr.length). */
export function sampleDistinct<T>(rng: () => number, arr: readonly T[], count: number): T[] {
  return shuffle(rng, arr).slice(0, count);
}
