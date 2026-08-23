import type { ChallengeItem, ChallengeOption, Generator } from "../types";
import { randInt, pick, shuffle } from "@/lib/random";

/**
 * Quantitative reasoning: a numeric sequence with the last value hidden;
 * the player picks the value that continues the rule. Rule complexity
 * (arithmetic -> geometric -> quadratic -> interleaved) scales with
 * difficulty.
 */

export interface NumberSequenceContent {
  sequence: number[];
}

type RuleKind = "arithmetic" | "geometric" | "quadratic" | "alternating";

function buildSequence(difficulty: number, rng: () => number): { shown: number[]; next: number } {
  const d = Math.max(0, difficulty);
  const length = Math.min(8, Math.max(4, 4 + Math.floor(d / 1.5)));

  const kinds: RuleKind[] =
    d < 1 ? ["arithmetic"] : d < 2.5 ? ["arithmetic", "geometric"] : d < 4 ? ["arithmetic", "geometric", "quadratic"] : ["arithmetic", "geometric", "quadratic", "alternating"];
  const kind = pick(rng, kinds);

  let values: number[] = [];

  if (kind === "arithmetic") {
    const start = randInt(rng, 1, 20);
    const step = randInt(rng, 1, 4 + Math.floor(d)) * pick(rng, [1, -1]);
    values = Array.from({ length: length + 1 }, (_, i) => start + i * step);
  } else if (kind === "geometric") {
    const start = randInt(rng, 1, 5);
    const ratio = randInt(rng, 2, 3);
    values = Array.from({ length: length + 1 }, (_, i) => start * ratio ** i);
  } else if (kind === "quadratic") {
    const start = randInt(rng, 1, 10);
    const accel = randInt(rng, 1, 3);
    let val = start;
    let step = randInt(rng, 1, 3);
    values = [val];
    for (let i = 0; i < length; i++) {
      val += step;
      values.push(val);
      step += accel;
    }
  } else {
    const startA = randInt(rng, 1, 15);
    const stepA = randInt(rng, 1, 4);
    const startB = randInt(rng, 1, 15);
    const stepB = -randInt(rng, 1, 4);
    for (let i = 0; i <= length; i++) {
      values.push(i % 2 === 0 ? startA + (i / 2) * stepA : startB + ((i - 1) / 2) * stepB);
    }
  }

  const next = values[values.length - 1];
  const shown = values.slice(0, values.length - 1);
  return { shown, next };
}

function distractorsForNext(shown: number[], next: number, rng: () => number, count: number): number[] {
  const lastDiff = shown.length >= 2 ? shown[shown.length - 1] - shown[shown.length - 2] : 1;
  const pool = [
    next + lastDiff,
    next - lastDiff,
    next + (lastDiff || 1) * 2,
    shown[shown.length - 1],
    next + randInt(rng, 1, 5),
    next - randInt(rng, 1, 5),
  ];

  const candidates = new Set<number>();
  for (const c of pool) {
    if (c !== next) candidates.add(c);
    if (candidates.size >= count) break;
  }
  let guard = 0;
  while (candidates.size < count && guard < 100) {
    guard++;
    const c = next + randInt(rng, -10, 10) * pick(rng, [1, 1, 1, 2]);
    if (c !== next) candidates.add(c);
  }
  return Array.from(candidates).slice(0, count);
}

export const generateQuantitativeReasoning: Generator<NumberSequenceContent> = (difficulty, rng) => {
  const { shown, next } = buildSequence(difficulty, rng);
  const optionsCount = Math.min(Math.max(4, 4 + Math.floor(difficulty / 2)), 6);
  const distractors = distractorsForNext(shown, next, rng, optionsCount - 1);

  const allValues = shuffle(rng, [next, ...distractors]);
  const options: ChallengeOption[] = allValues.map((v, i) => ({ id: `opt-${i}`, content: v }));
  const correctOption = options.find((o) => o.content === next)!;

  const item: ChallengeItem<NumberSequenceContent> = {
    id: crypto.randomUUID(),
    domain: "quantitativeReasoning",
    difficulty,
    timeLimitMs: null,
    content: { sequence: shown },
    options,
    correctOptionId: correctOption.id,
    signature: `quant:${shown.join(",")}`,
  };
  return item;
};
