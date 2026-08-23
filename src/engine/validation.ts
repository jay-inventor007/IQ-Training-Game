import type { ChallengeItem, Generator } from "./types";

const MAX_ATTEMPTS = 25;
const RECENT_SIGNATURE_WINDOW = 12;

/**
 * Structural checks every generated item must pass before it reaches a
 * player (docs/PRODUCT_VISION.md §8): exactly one correct option, no
 * duplicate option ids/content, and not a near-repeat of a recent item.
 */
export function isValidItem(item: ChallengeItem, recentSignatures: string[]): boolean {
  if (item.options.length < 2) return false;

  const correctCount = item.options.filter((o) => o.id === item.correctOptionId).length;
  if (correctCount !== 1) return false;

  const ids = new Set(item.options.map((o) => o.id));
  if (ids.size !== item.options.length) return false;

  const contents = new Set(item.options.map((o) => JSON.stringify(o.content)));
  if (contents.size !== item.options.length) return false;

  const recentWindow = recentSignatures.slice(-RECENT_SIGNATURE_WINDOW);
  if (recentWindow.includes(item.signature)) return false;

  return true;
}

/**
 * Runs a generator repeatedly (generate -> validate -> retry) until a valid,
 * non-duplicate item is produced or attempts are exhausted, per the
 * generation-safety pipeline in docs/PRODUCT_VISION.md §8.
 */
export function generateValidated<TContent>(
  generator: Generator<TContent>,
  difficulty: number,
  rng: () => number,
  recentSignatures: string[],
): ChallengeItem<TContent> {
  let lastItem: ChallengeItem<TContent> | null = null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const item = generator(difficulty, rng, recentSignatures);
    lastItem = item;
    if (isValidItem(item, recentSignatures)) {
      return item;
    }
  }
  // Exhausted retries (e.g. a very constrained difficulty/history combo) —
  // surface the last generated item rather than blocking the session.
  return lastItem as ChallengeItem<TContent>;
}
