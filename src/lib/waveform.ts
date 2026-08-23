import { mulberry32 } from "./random";

/**
 * Each cognitive domain gets a characteristic trace shape, the way a bedside
 * monitor's ECG/pleth/respiration channels each look distinct at a glance —
 * a redundant, non-color cue standing alongside each channel's hue.
 */
export type WaveformStyle = "spike" | "pulse" | "sine" | "jitter" | "step";

const POINTS = 64;

function samplesFor(style: WaveformStyle, seed: number): number[] {
  const rng = mulberry32(seed);
  const values: number[] = [];

  if (style === "spike") {
    const period = Math.floor(POINTS / 4);
    for (let i = 0; i < POINTS; i++) {
      const withinPeriod = i % period;
      values.push(withinPeriod === Math.floor(period / 2) ? 1 : withinPeriod === Math.floor(period / 2) + 1 ? -0.55 : (rng() - 0.5) * 0.1);
    }
  } else if (style === "pulse") {
    for (let i = 0; i < POINTS; i++) {
      const t = (i / POINTS) * Math.PI * 2 * 3;
      values.push(Math.max(0, Math.sin(t)) ** 2 * 0.95);
    }
  } else if (style === "sine") {
    for (let i = 0; i < POINTS; i++) {
      const t = (i / POINTS) * Math.PI * 2 * 2;
      values.push(Math.sin(t) * 0.75);
    }
  } else if (style === "jitter") {
    for (let i = 0; i < POINTS; i++) {
      values.push((rng() - 0.5) * 1.7);
    }
  } else {
    let level = 0;
    const stepEvery = Math.max(2, Math.floor(POINTS / 7));
    for (let i = 0; i < POINTS; i++) {
      if (i % stepEvery === 0) level = (rng() - 0.5) * 1.5;
      values.push(level + (rng() - 0.5) * 0.05);
    }
  }
  return values;
}

/** Builds one tileable SVG path 'd' string for the given style/amplitude. */
export function waveformPath(style: WaveformStyle, width: number, height: number, amplitude: number, seed = 1): string {
  const samples = samplesFor(style, seed);
  const midY = height / 2;
  const amp = Math.max(0.06, Math.min(1, amplitude)) * (height / 2) * 0.85;
  const step = width / (samples.length - 1);

  let d = "";
  for (let i = 0; i < samples.length; i++) {
    const x = i * step;
    const y = midY - samples[i] * amp;
    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export function waveformSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (Math.imul(h, 31) + input.charCodeAt(i)) | 0;
  return h >>> 0 || 1;
}
