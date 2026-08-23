import { Link } from "react-router-dom";
import { DOMAINS, DOMAIN_LABELS } from "@/engine/types";
import { CHANNELS } from "@/theme/channels";
import { estimatedPercentile } from "@/engine/ability";
import { useProfileStore } from "@/store/useProfileStore";
import { WaveformTrace } from "@/components/WaveformTrace";

/**
 * The domain picker, reimagined as a multi-channel monitor strip: each
 * domain is a channel with its own color, waveform shape, and abbreviation
 * — never distinguished by color alone. Used on Home and as the Training /
 * Assessment mode's domain-selection screen.
 */
export function DomainPicker({ basePath }: { basePath: string }) {
  const domains = useProfileStore((s) => s.domains);

  return (
    <div className="border border-console-line divide-y divide-console-line bg-console-panel">
      {DOMAINS.map((domain) => {
        const profile = domains[domain];
        const meta = CHANNELS[domain];
        const hasData = profile.ability.itemsAnswered > 0;
        const percentile = estimatedPercentile(profile.ability);
        const amplitude = hasData ? Math.max(0.18, percentile / 100) : 0.06;

        return (
          <Link
            key={domain}
            to={`${basePath}/${domain}`}
            className="flex items-center gap-3 sm:gap-5 px-3 sm:px-5 py-3 hover:bg-console-panel2 transition group"
          >
            <div className="w-12 sm:w-16 shrink-0">
              <div className="font-mono text-xs sm:text-sm font-semibold tracking-widest" style={{ color: meta.color }}>
                {meta.code}
              </div>
              <div className="font-mono text-[10px] text-console-muted mt-0.5">{hasData ? `${percentile}%` : "——"}</div>
            </div>

            <div className="flex-1 min-w-0 border-l border-console-line pl-3 sm:pl-5">
              <WaveformTrace
                style={meta.waveform}
                color={meta.color}
                amplitude={amplitude}
                seed={domain}
                durationS={meta.durationS}
                height={32}
              />
            </div>

            <div className="hidden sm:block text-console-muted group-hover:text-console-text transition text-xs shrink-0 w-40 text-right">
              {DOMAIN_LABELS[domain]}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
