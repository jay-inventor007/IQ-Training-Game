import type { Domain } from "@/engine/types";
import type { WaveformStyle } from "@/lib/waveform";

export interface ChannelMeta {
  /** Short instrument-style abbreviation, e.g. a bedside monitor's HR / SpO2 / RESP. */
  code: string;
  color: string;
  waveform: WaveformStyle;
  /** Scroll period in seconds — each channel reads at its own characteristic rate. */
  durationS: number;
}

export const CHANNELS: Record<Domain, ChannelMeta> = {
  fluidReasoning: { code: "FLU", color: "#2dd9a3", waveform: "spike", durationS: 2.0 },
  workingMemory: { code: "MEM", color: "#38bdf8", waveform: "pulse", durationS: 2.6 },
  spatialReasoning: { code: "SPA", color: "#b28dfa", waveform: "sine", durationS: 4.2 },
  processingSpeed: { code: "SPD", color: "#fbbf24", waveform: "jitter", durationS: 1.2 },
  quantitativeReasoning: { code: "QNT", color: "#f472b6", waveform: "step", durationS: 3.4 },
};

export const ALARM_COLOR = "#ff3b4e";
