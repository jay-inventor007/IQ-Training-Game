import { waveformPath, waveformSeed, type WaveformStyle } from "@/lib/waveform";

const TILE_WIDTH = 240;
const TILE_COPIES = 10;

interface WaveformTraceProps {
  style: WaveformStyle;
  color: string;
  /** 0-1. Near-zero reads as a flat, barely-alive line — used when a domain has no data yet. */
  amplitude: number;
  height?: number;
  seed?: string;
  durationS?: number;
  className?: string;
}

export function WaveformTrace({ style, color, amplitude, height = 40, seed = "trace", durationS = 3, className }: WaveformTraceProps) {
  const d = waveformPath(style, TILE_WIDTH, height, amplitude, waveformSeed(seed));

  return (
    <div className={`relative w-full overflow-hidden ${className ?? ""}`} style={{ height }} aria-hidden="true">
      <div
        className="absolute inset-y-0 left-0 flex motion-reduce:animate-none"
        style={{
          width: TILE_WIDTH * TILE_COPIES,
          animation: `waveform-scroll ${durationS}s linear infinite`,
        }}
      >
        {Array.from({ length: TILE_COPIES }).map((_, i) => (
          <svg key={i} width={TILE_WIDTH} height={height} viewBox={`0 0 ${TILE_WIDTH} ${height}`} className="shrink-0">
            <path d={d} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" opacity={0.9} />
          </svg>
        ))}
      </div>
    </div>
  );
}
