import type { ChallengeItem, ChallengeOption, Generator } from "../types";
import { randInt, sampleDistinct, shuffle } from "@/lib/random";

/**
 * Working memory: a sequence of grid cells lights up in order; the player
 * must recognize which of several candidate sequences matches what was
 * shown. Difficulty scales grid size, sequence length, and reveal speed.
 */

export interface SequenceContent {
  gridSize: number;
  sequence: number[];
  revealMs: number;
}

function sequenceSignature(seq: number[]): string {
  return seq.join(",");
}

function mutate(seq: number[], gridSize: number, rng: () => number): number[] {
  const totalCells = gridSize * gridSize;
  const copy = [...seq];
  const swapMutation = randInt(rng, 0, 1) === 0;
  if (swapMutation && copy.length >= 2) {
    const i = randInt(rng, 0, copy.length - 1);
    let j = randInt(rng, 0, copy.length - 1);
    if (j === i) j = (j + 1) % copy.length;
    [copy[i], copy[j]] = [copy[j], copy[i]];
  } else {
    const pos = randInt(rng, 0, copy.length - 1);
    const used = new Set(copy);
    let candidate = randInt(rng, 0, totalCells - 1);
    let guard = 0;
    while (used.has(candidate) && guard < 50) {
      candidate = randInt(rng, 0, totalCells - 1);
      guard++;
    }
    copy[pos] = candidate;
  }
  return copy;
}

export const generateWorkingMemory: Generator<SequenceContent> = (difficulty, rng) => {
  const d = Math.max(0, difficulty);
  const gridSize = d < 1.5 ? 3 : d < 3.5 ? 4 : 5;
  const totalCells = gridSize * gridSize;
  const length = Math.min(totalCells, Math.max(3, 3 + Math.floor(d)));
  const revealMs = Math.max(450, 1300 - d * 130);

  const sequence = sampleDistinct(
    rng,
    Array.from({ length: totalCells }, (_, i) => i),
    length,
  );

  const optionsCount = Math.min(Math.max(4, 4 + Math.floor(d / 2)), 6);
  const used = new Set([sequenceSignature(sequence)]);
  const distractorSeqs: number[][] = [];

  let guard = 0;
  while (distractorSeqs.length < optionsCount - 1 && guard < 200) {
    guard++;
    const candidate = mutate(sequence, gridSize, rng);
    const sig = sequenceSignature(candidate);
    if (!used.has(sig)) {
      used.add(sig);
      distractorSeqs.push(candidate);
    }
  }

  const allSeqs = shuffle(rng, [sequence, ...distractorSeqs]);
  const options: ChallengeOption[] = allSeqs.map((seq, i) => ({ id: `opt-${i}`, content: seq }));
  const correctOption = options.find((o) => sequenceSignature(o.content as number[]) === sequenceSignature(sequence))!;

  const item: ChallengeItem<SequenceContent> = {
    id: crypto.randomUUID(),
    domain: "workingMemory",
    difficulty,
    timeLimitMs: null,
    content: { gridSize, sequence, revealMs },
    options,
    correctOptionId: correctOption.id,
    signature: `wm:${gridSize}:${sequenceSignature(sequence)}`,
  };
  return item;
};
