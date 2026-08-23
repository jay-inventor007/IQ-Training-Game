import type { ChallengeItem, ChallengeOption, Generator } from "../types";
import { randInt, pick, shuffle } from "@/lib/random";

/**
 * Fluid reasoning: a 3x3 abstract matrix (Raven's-style). One or more visual
 * attributes progress by a fixed step across rows and/or columns; the player
 * picks the missing bottom-right cell. Difficulty scales the number of
 * attributes that vary, whether they vary along one or both axes, and how
 * many values each attribute cycles through.
 */

export type ShapeKind = "circle" | "square" | "triangle" | "star" | "hexagon" | "diamond";

export interface AttributeCombo {
  shape: ShapeKind;
  color: string;
  count: number;
  rotation: number;
}

export interface MatrixContent {
  cells: (AttributeCombo | null)[][];
}

const SHAPES: ShapeKind[] = ["circle", "square", "triangle", "star", "hexagon", "diamond"];
const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#06b6d4"];
const COUNTS = [1, 2, 3];
const ROTATIONS = [0, 90, 180, 270];

type AttrKey = "shape" | "color" | "count" | "rotation";
const ATTR_KEYS: AttrKey[] = ["shape", "color", "count", "rotation"];
const ATTR_DOMAIN_SIZE: Record<AttrKey, number> = {
  shape: SHAPES.length,
  color: COLORS.length,
  count: COUNTS.length,
  rotation: ROTATIONS.length,
};

interface AttrRule {
  key: AttrKey;
  cycleLength: number;
  rowStep: number;
  colStep: number;
  base: number;
}

function valueAt(rule: AttrRule, r: number, c: number): number {
  return (((rule.base + r * rule.rowStep + c * rule.colStep) % rule.cycleLength) + rule.cycleLength) % rule.cycleLength;
}

function comboFromIndices(indices: Record<AttrKey, number>): AttributeCombo {
  return {
    shape: SHAPES[indices.shape] ?? SHAPES[0],
    color: COLORS[indices.color] ?? COLORS[0],
    count: COUNTS[indices.count] ?? COUNTS[0],
    rotation: ROTATIONS[indices.rotation] ?? ROTATIONS[0],
  };
}

function comboSignature(combo: AttributeCombo): string {
  return `${combo.shape}|${combo.color}|${combo.count}|${combo.rotation}`;
}

function buildRules(difficulty: number, rng: () => number): AttrRule[] {
  const activeCount = Math.min(4, Math.max(1, 1 + Math.floor(difficulty / 1.3)));
  const activeKeys = new Set(shuffle(rng, ATTR_KEYS).slice(0, activeCount));
  const bothAxes = difficulty > 2.2;

  return ATTR_KEYS.map((key) => {
    const domainSize = ATTR_DOMAIN_SIZE[key];
    if (!activeKeys.has(key)) {
      return { key, cycleLength: 1, rowStep: 0, colStep: 0, base: randInt(rng, 0, domainSize - 1) };
    }
    const cycleLength = Math.min(domainSize, Math.max(2, 3 + Math.floor(Math.max(0, difficulty - 1))));
    const rowStep = randInt(rng, 1, cycleLength - 1);
    const colStep = bothAxes ? randInt(rng, 1, cycleLength - 1) : 0;
    return { key, cycleLength, rowStep, colStep, base: randInt(rng, 0, cycleLength - 1) };
  });
}

function indicesAt(rules: AttrRule[], r: number, c: number): Record<AttrKey, number> {
  const indices = {} as Record<AttrKey, number>;
  for (const rule of rules) indices[rule.key] = valueAt(rule, r, c);
  return indices;
}

function perturbedIndices(rules: AttrRule[], indices: Record<AttrKey, number>, rng: () => number): Record<AttrKey, number> {
  const activeRules = rules.filter((r) => r.cycleLength > 1);
  const rule = pick(rng, activeRules.length ? activeRules : rules);
  const delta = pick(rng, [1, -1]);
  const newVal = ((indices[rule.key] + delta) % rule.cycleLength + rule.cycleLength) % rule.cycleLength;
  return { ...indices, [rule.key]: newVal };
}

function randomIndices(rules: AttrRule[], rng: () => number): Record<AttrKey, number> {
  const indices = {} as Record<AttrKey, number>;
  for (const rule of rules) indices[rule.key] = randInt(rng, 0, rule.cycleLength - 1);
  return indices;
}

export const generateFluidReasoning: Generator<MatrixContent> = (difficulty, rng) => {
  const rules = buildRules(Math.max(0, difficulty), rng);

  const cells: (AttributeCombo | null)[][] = [];
  for (let r = 0; r < 3; r++) {
    const row: (AttributeCombo | null)[] = [];
    for (let c = 0; c < 3; c++) {
      row.push(r === 2 && c === 2 ? null : comboFromIndices(indicesAt(rules, r, c)));
    }
    cells.push(row);
  }

  const correctIndices = indicesAt(rules, 2, 2);
  const correctCombo = comboFromIndices(correctIndices);

  const totalCombos = rules.reduce((acc, r) => acc * r.cycleLength, 1);
  const optionsCount = Math.min(Math.max(4, 4 + Math.floor(difficulty / 2)), 6, totalCombos);

  const used = new Set([comboSignature(correctCombo)]);
  const distractors: AttributeCombo[] = [];

  let guard = 0;
  while (distractors.length < optionsCount - 1 && guard < 200) {
    guard++;
    const candidate = comboFromIndices(perturbedIndices(rules, correctIndices, rng));
    const sig = comboSignature(candidate);
    if (!used.has(sig)) {
      used.add(sig);
      distractors.push(candidate);
    }
  }
  guard = 0;
  while (distractors.length < optionsCount - 1 && guard < 300) {
    guard++;
    const candidate = comboFromIndices(randomIndices(rules, rng));
    const sig = comboSignature(candidate);
    if (!used.has(sig)) {
      used.add(sig);
      distractors.push(candidate);
    }
  }

  const allCombos = shuffle(rng, [correctCombo, ...distractors]);
  const options: ChallengeOption[] = allCombos.map((combo, i) => ({ id: `opt-${i}`, content: combo }));
  const correctOption = options.find((o) => comboSignature(o.content as AttributeCombo) === comboSignature(correctCombo))!;

  const signature = `fluid:${rules.map((r) => `${r.key}:${r.cycleLength}:${r.rowStep}:${r.colStep}:${r.base}`).join(",")}`;

  const item: ChallengeItem<MatrixContent> = {
    id: crypto.randomUUID(),
    domain: "fluidReasoning",
    difficulty,
    timeLimitMs: null,
    content: { cells },
    options,
    correctOptionId: correctOption.id,
    signature,
  };
  return item;
};
