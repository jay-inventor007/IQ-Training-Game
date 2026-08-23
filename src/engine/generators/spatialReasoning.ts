import type { ChallengeItem, ChallengeOption, Generator } from "../types";
import { randInt, pick, shuffle } from "@/lib/random";

/**
 * Spatial reasoning: a polyomino (connected set of filled grid cells) is
 * shown; the player picks the option that is the SAME shape rotated, among
 * distractors that are mirror images (unreachable by rotation alone) or
 * unrelated shapes. Difficulty scales grid size and shape complexity.
 */

export interface PolyominoContent {
  gridSize: number;
  baseCells: [number, number][];
}

type Cell = [number, number];

function randomPolyomino(gridSize: number, cellCount: number, rng: () => number): Cell[] {
  const cellsSet = new Set<string>();
  cellsSet.add(`${randInt(rng, 0, gridSize - 1)},${randInt(rng, 0, gridSize - 1)}`);
  const dirs: Cell[] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  let guard = 0;
  while (cellsSet.size < cellCount && guard < 500) {
    guard++;
    const cellsArr = Array.from(cellsSet);
    const [cx, cy] = pick(rng, cellsArr).split(",").map(Number);
    const [dx, dy] = pick(rng, dirs);
    const nx = cx + dx;
    const ny = cy + dy;
    if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
      cellsSet.add(`${nx},${ny}`);
    }
  }
  return Array.from(cellsSet).map((s) => s.split(",").map(Number) as Cell);
}

function rotate90(cells: Cell[], gridSize: number): Cell[] {
  return cells.map(([x, y]) => [gridSize - 1 - y, x] as Cell);
}

function reflectX(cells: Cell[], gridSize: number): Cell[] {
  return cells.map(([x, y]) => [gridSize - 1 - x, y] as Cell);
}

function rotateN(cells: Cell[], gridSize: number, times: number): Cell[] {
  let result = cells;
  for (let i = 0; i < times; i++) result = rotate90(result, gridSize);
  return result;
}

function cellsSignature(cells: Cell[]): string {
  return cells
    .map(([x, y]) => `${x},${y}`)
    .sort()
    .join("|");
}

export const generateSpatialReasoning: Generator<PolyominoContent> = (difficulty, rng) => {
  const d = Math.max(0, difficulty);
  const gridSize = d < 1.5 ? 3 : d < 3.5 ? 4 : 5;
  const cellCount = Math.min(gridSize * gridSize, Math.max(4, 4 + Math.floor(d)));
  const baseCells = randomPolyomino(gridSize, cellCount, rng);

  // Never rotate by 0 — the player must actually mentally rotate the shape.
  const rotationTimes = randInt(rng, 1, 3);
  const correctCells = rotateN(baseCells, gridSize, rotationTimes);

  // Every rotation of the base shape is a legitimate "correct" match — keep
  // distractors out of this family so the item has exactly one right answer.
  const rotationFamily = new Set([0, 1, 2, 3].map((t) => cellsSignature(rotateN(baseCells, gridSize, t))));

  const optionsCount = Math.min(Math.max(4, 4 + Math.floor(d / 2)), 6);
  const used = new Set([cellsSignature(correctCells)]);
  const distractors: Cell[][] = [];

  let guard = 0;
  while (distractors.length < optionsCount - 1 && guard < 200) {
    guard++;
    const candidate = rotateN(reflectX(baseCells, gridSize), gridSize, randInt(rng, 0, 3));
    const sig = cellsSignature(candidate);
    if (!used.has(sig) && !rotationFamily.has(sig)) {
      used.add(sig);
      distractors.push(candidate);
    }
  }
  guard = 0;
  while (distractors.length < optionsCount - 1 && guard < 200) {
    guard++;
    const candidate = randomPolyomino(gridSize, cellCount, rng);
    const sig = cellsSignature(candidate);
    if (!used.has(sig) && !rotationFamily.has(sig)) {
      used.add(sig);
      distractors.push(candidate);
    }
  }

  const allShapes = shuffle(rng, [correctCells, ...distractors]);
  const options: ChallengeOption[] = allShapes.map((cells, i) => ({ id: `opt-${i}`, content: cells }));
  const correctOption = options.find((o) => cellsSignature(o.content as Cell[]) === cellsSignature(correctCells))!;

  const item: ChallengeItem<PolyominoContent> = {
    id: crypto.randomUUID(),
    domain: "spatialReasoning",
    difficulty,
    timeLimitMs: null,
    content: { gridSize, baseCells },
    options,
    correctOptionId: correctOption.id,
    signature: `spatial:${gridSize}:${cellsSignature(baseCells)}`,
  };
  return item;
};
