/**
 * Simplified adaptive-ability model, inspired by 1PL Rasch / Elo updates.
 *
 * This is deliberately NOT full Item Response Theory (see docs/PRODUCT_VISION.md
 * §9 and §17) — it is a practical placeholder that gives real adaptive
 * difficulty and a rough percentile today, while leaving room to swap in a
 * proper IRT/CAT engine later without changing the call sites.
 *
 * Ability and difficulty share one logistic scale, mean 0 / sd 1 (a z-score).
 * P(correct) = 1 / (1 + exp(-(ability - difficulty)))
 */

export interface AbilityState {
  /** Current point estimate on the shared logistic scale. */
  estimate: number;
  /** Number of items answered — drives both the learning-rate decay and reliability. */
  itemsAnswered: number;
}

export const INITIAL_ABILITY: AbilityState = { estimate: 0, itemsAnswered: 0 };

export function expectedProbability(ability: number, difficulty: number): number {
  return 1 / (1 + Math.exp(-(ability - difficulty)));
}

/**
 * Update ability after one response. The learning rate K decays as more
 * items are answered so the estimate stabilizes instead of oscillating.
 */
export function updateAbility(state: AbilityState, itemDifficulty: number, correct: boolean): AbilityState {
  const k = 0.9 / (1 + state.itemsAnswered / 12);
  const expected = expectedProbability(state.estimate, itemDifficulty);
  const nextEstimate = state.estimate + k * ((correct ? 1 : 0) - expected);
  return {
    estimate: nextEstimate,
    itemsAnswered: state.itemsAnswered + 1,
  };
}

/**
 * Pick the difficulty for the next generated item: centered on the current
 * ability estimate (so the player sits near ~50% success) with jitter so
 * consecutive items aren't identical, widening while the estimate is still
 * unreliable (few items answered) and narrowing as it firms up.
 */
export function nextItemDifficulty(state: AbilityState, rng: () => number): number {
  const spread = 0.6 + 1.4 / (1 + state.itemsAnswered / 8);
  const jitter = (rng() * 2 - 1) * spread;
  return Math.max(-3, state.estimate + jitter);
}

/** Standard normal CDF, used to turn a z-score ability estimate into a percentile. */
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}

/** Rough percentile (0-100) — NOT a norm-referenced, validated score. See PRODUCT_VISION.md §17. */
export function estimatedPercentile(state: AbilityState): number {
  return Math.round(normalCdf(state.estimate) * 100);
}

/**
 * Reliability proxy in [0, 1): approaches 1 as more items are answered.
 * Used only to decide how much to trust/display an estimate, not as a
 * validated standard-error-of-measurement.
 */
export function reliability(state: AbilityState): number {
  return state.itemsAnswered / (state.itemsAnswered + 8);
}
