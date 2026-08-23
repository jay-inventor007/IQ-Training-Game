export type Domain =
  | "fluidReasoning"
  | "workingMemory"
  | "spatialReasoning"
  | "processingSpeed"
  | "quantitativeReasoning";

export const DOMAINS: Domain[] = [
  "fluidReasoning",
  "workingMemory",
  "spatialReasoning",
  "processingSpeed",
  "quantitativeReasoning",
];

export const DOMAIN_LABELS: Record<Domain, string> = {
  fluidReasoning: "Fluid Reasoning",
  workingMemory: "Working Memory",
  spatialReasoning: "Spatial Reasoning",
  processingSpeed: "Processing Speed",
  quantitativeReasoning: "Quantitative Reasoning",
};

export const DOMAIN_DESCRIPTIONS: Record<Domain, string> = {
  fluidReasoning: "Discover the rule that completes an abstract pattern.",
  workingMemory: "Hold and reproduce a sequence of positions in order.",
  spatialReasoning: "Mentally rotate a shape to find its match.",
  processingSpeed: "Make rapid, accurate go / no-go decisions.",
  quantitativeReasoning: "Find the rule governing a numeric sequence.",
};

/** A single answer option presented to the player. */
export interface ChallengeOption {
  id: string;
  /** Rendered by the domain-specific item component. */
  content: unknown;
}

/**
 * A generated, validated challenge item. `content` is domain-specific and
 * interpreted by the matching component in src/components/domains.
 */
export interface ChallengeItem<TContent = unknown> {
  id: string;
  domain: Domain;
  difficulty: number;
  timeLimitMs: number | null;
  content: TContent;
  options: ChallengeOption[];
  correctOptionId: string;
  /** Short string used for anti-repeat de-duplication against recent items. */
  signature: string;
}

export interface ChallengeResult {
  item: ChallengeItem;
  selectedOptionId: string | null;
  correct: boolean;
  responseTimeMs: number;
  timedOut: boolean;
}

/** A generator turns a difficulty target into a validated challenge item. */
export type Generator<TContent = unknown> = (
  difficulty: number,
  rng: () => number,
  recentSignatures: string[],
) => ChallengeItem<TContent>;

export type SessionMode = "training" | "assessment";
