/**
 * Puzzle-content color palette (fluid-reasoning matrices, processing-speed
 * discrimination). Colorblind-accessible design is a hard product
 * requirement (see PRODUCT.md): every color here also carries a distinct
 * SVG fill pattern via `patternForColor`, so no puzzle answer is ever
 * distinguishable by hue alone. Pure red is reserved for the alarm/incorrect
 * state elsewhere in the UI and deliberately excluded here.
 */
export const MOTIF_COLORS = [
  "#4fb6e8", // sky blue — solid
  "#14b88a", // bluish green — diagonal stripe
  "#e8b93b", // amber — dots
  "#3e7cd6", // deep blue — crosshatch
  "#c77dc9", // magenta — horizontal stripe
  "#e0722e", // vermillion (orange, not red) — rings
] as const;

const PATTERN_BY_COLOR: Record<string, string | null> = {
  "#4fb6e8": null,
  "#14b88a": "motif-diagonal",
  "#e8b93b": "motif-dots",
  "#3e7cd6": "motif-crosshatch",
  "#c77dc9": "motif-horizontal",
  "#e0722e": "motif-rings",
};

export function patternForColor(hex: string): string | null {
  return PATTERN_BY_COLOR[hex.toLowerCase()] ?? null;
}
