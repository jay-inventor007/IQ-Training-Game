import { DOMAINS, DOMAIN_LABELS } from "@/engine/types";
import { estimatedPercentile, reliability } from "@/engine/ability";
import { useProfileStore } from "@/store/useProfileStore";
import { CHANNELS } from "@/theme/channels";
import { WaveformTrace } from "@/components/WaveformTrace";

function SignalMeter({ level, color }: { level: number; color: string }) {
  const filled = Math.round(level * 5);
  return (
    <div className="flex items-end gap-0.5 h-3" title={`confidence ${Math.round(level * 100)}%`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-1"
          style={{
            height: `${(i + 1) * 20}%`,
            backgroundColor: i < filled ? color : "transparent",
            border: i < filled ? "none" : "1px solid #1b262b",
          }}
        />
      ))}
    </div>
  );
}

export function MindProfile() {
  const domains = useProfileStore((s) => s.domains);

  return (
    <div>
      <div className="border border-console-line divide-y divide-console-line bg-console-panel">
        {DOMAINS.map((domain) => {
          const profile = domains[domain];
          const meta = CHANNELS[domain];
          const hasData = profile.ability.itemsAnswered > 0;
          const percentile = estimatedPercentile(profile.ability);
          const rel = reliability(profile.ability);
          const amplitude = hasData ? Math.max(0.18, percentile / 100) : 0.06;

          return (
            <div key={domain} className="flex items-center gap-3 sm:gap-5 px-3 sm:px-5 py-3">
              <div className="w-12 sm:w-16 shrink-0">
                <div className="font-mono text-xs sm:text-sm font-semibold tracking-widest" style={{ color: meta.color }}>
                  {meta.code}
                </div>
                <div className="text-[10px] text-console-muted mt-0.5 hidden sm:block">{DOMAIN_LABELS[domain]}</div>
              </div>

              <div className="flex-1 min-w-0 border-l border-console-line pl-3 sm:pl-5">
                <WaveformTrace style={meta.waveform} color={meta.color} amplitude={amplitude} seed={domain} durationS={meta.durationS} height={28} />
              </div>

              <div className="font-mono text-xs text-right shrink-0 w-24">
                <div className="tabular-nums" style={{ color: hasData ? meta.color : undefined }}>
                  {hasData ? `P${percentile}` : "NO SIGNAL"}
                </div>
                <div className="text-console-muted text-[10px] mt-1">{profile.ability.itemsAnswered} items</div>
              </div>

              <SignalMeter level={rel} color={meta.color} />
            </div>
          );
        })}
      </div>
      <p className="text-xs text-console-muted pt-3 font-mono leading-relaxed">
        Estimates come from an in-app adaptive-difficulty model, not a validated psychometric instrument —
        see docs/PRODUCT_VISION.md §17 for what these numbers do and don't claim.
      </p>
    </div>
  );
}
