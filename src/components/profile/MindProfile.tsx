import { DOMAINS, DOMAIN_LABELS } from "@/engine/types";
import { estimatedPercentile, reliability } from "@/engine/ability";
import { useProfileStore } from "@/store/useProfileStore";

export function MindProfile() {
  const domains = useProfileStore((s) => s.domains);

  return (
    <div className="space-y-4">
      {DOMAINS.map((domain) => {
        const profile = domains[domain];
        const hasData = profile.ability.itemsAnswered > 0;
        const percentile = estimatedPercentile(profile.ability);
        const rel = reliability(profile.ability);
        return (
          <div key={domain} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-medium">{DOMAIN_LABELS[domain]}</span>
              <span className="text-sm text-slate-400">{hasData ? `${percentile}th percentile (est.)` : "No data yet"}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${hasData ? percentile : 0}%` }} />
            </div>
            <div className="flex justify-between mt-1 text-xs text-slate-500">
              <span>{profile.ability.itemsAnswered} items answered</span>
              <span>confidence {Math.round(rel * 100)}%</span>
            </div>
          </div>
        );
      })}
      <p className="text-xs text-slate-500 pt-2">
        Estimates come from an in-app adaptive-difficulty model, not a validated psychometric
        instrument — see docs/PRODUCT_VISION.md §17 for what these numbers do and don't claim.
      </p>
    </div>
  );
}
