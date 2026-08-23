import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DOMAINS, DOMAIN_LABELS, type Domain } from "@/engine/types";
import { CHANNELS } from "@/theme/channels";
import { DomainPicker } from "@/components/DomainPicker";
import { ScopePanel } from "@/components/ScopePanel";
import { useChallengeSession } from "@/hooks/useChallengeSession";
import { ChallengeRunner } from "@/components/challenge/ChallengeRunner";

function isDomain(value: string | undefined): value is Domain {
  return !!value && (DOMAINS as string[]).includes(value);
}

export function TrainingPage() {
  const { domain } = useParams<{ domain?: string }>();

  if (!isDomain(domain)) {
    return (
      <div>
        <div className="font-mono text-[11px] tracking-widest text-console-muted mb-2 px-1">
          TRAINING MODE — SELECT A CHANNEL
        </div>
        <DomainPicker basePath="/train" />
      </div>
    );
  }

  return <TrainingSession domain={domain} />;
}

function TrainingSession({ domain }: { domain: Domain }) {
  const { currentItem, summary, start, submitResult } = useChallengeSession({ domain, mode: "training" });
  const meta = CHANNELS[domain];

  useEffect(() => {
    start();
  }, [domain, start]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link to="/train" className="font-mono text-[11px] text-console-muted hover:text-console-text transition">
            ← CHANGE CHANNEL
          </Link>
          <h1 className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm font-semibold tracking-widest" style={{ color: meta.color }}>
              {meta.code}
            </span>
            <span className="text-console-muted text-sm">{DOMAIN_LABELS[domain]} — Training</span>
          </h1>
        </div>
        <div className="font-mono text-xs text-console-muted text-right shrink-0">
          <div>
            <span className="tabular-nums text-console-text">{summary.correctCount}</span> / {summary.itemsAnswered} correct
          </div>
          {summary.itemsAnswered > 0 && <div>{Math.round(summary.averageResponseTimeMs)} ms avg</div>}
        </div>
      </div>

      <ScopePanel>{currentItem && <ChallengeRunner item={currentItem} onComplete={submitResult} />}</ScopePanel>
    </div>
  );
}
