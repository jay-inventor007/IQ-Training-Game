import type { ChallengeItem, ChallengeOption, Generator } from "../types";
import { pick } from "@/lib/random";
import type { ShapeKind } from "./fluidReasoning";
import { MOTIF_COLORS } from "@/theme/motifs";

/**
 * Processing speed: a target shape/color is shown, then a stimulus that
 * either matches or doesn't on one rule attribute; the player decides
 * "Match" / "No Match" against a shrinking time limit. At higher difficulty
 * the non-rule attribute is held constant on mismatches, increasing visual
 * interference (docs/PRODUCT_VISION.md §10).
 */

export interface DiscriminationContent {
  ruleLabel: string;
  ruleAttribute: "shape" | "color";
  target: { shape: ShapeKind; color: string };
  stimulus: { shape: ShapeKind; color: string };
}

const SHAPES: ShapeKind[] = ["circle", "square", "triangle", "star", "hexagon", "diamond"];
const COLORS = [...MOTIF_COLORS];

export const generateProcessingSpeed: Generator<DiscriminationContent> = (difficulty, rng) => {
  const d = Math.max(0, difficulty);
  const ruleAttribute: "shape" | "color" = pick(rng, ["shape", "color"]);
  const targetShape = pick(rng, SHAPES);
  const targetColor = pick(rng, COLORS);
  const isMatch = rng() < 0.5;
  const highInterference = d > 2;

  let stimulusShape = targetShape;
  let stimulusColor = targetColor;

  if (ruleAttribute === "shape") {
    if (!isMatch) stimulusShape = pick(rng, SHAPES.filter((s) => s !== targetShape));
    stimulusColor = highInterference ? targetColor : pick(rng, COLORS);
  } else {
    if (!isMatch) stimulusColor = pick(rng, COLORS.filter((c) => c !== targetColor));
    stimulusShape = highInterference ? targetShape : pick(rng, SHAPES);
  }

  const timeLimitMs = Math.max(700, 2600 - d * 220);
  const ruleLabel = ruleAttribute === "shape" ? "Same shape as target?" : "Same color as target?";

  const options: ChallengeOption[] = [
    { id: "match", content: "Match" },
    { id: "no-match", content: "No Match" },
  ];
  const correctOptionId = isMatch ? "match" : "no-match";

  const item: ChallengeItem<DiscriminationContent> = {
    id: crypto.randomUUID(),
    domain: "processingSpeed",
    difficulty,
    timeLimitMs,
    content: {
      ruleLabel,
      ruleAttribute,
      target: { shape: targetShape, color: targetColor },
      stimulus: { shape: stimulusShape, color: stimulusColor },
    },
    options,
    correctOptionId,
    signature: `speed:${ruleAttribute}:${targetShape}:${targetColor}:${stimulusShape}:${stimulusColor}`,
  };
  return item;
};
