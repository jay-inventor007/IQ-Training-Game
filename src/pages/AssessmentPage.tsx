import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DOMAINS, DOMAIN_LABELS, type Domain } from "@/engine/types";
import { CHANNELS } from "@/theme/channels";
import { DomainPicker } from "@/components/DomainPicker";
import { ScopePanel } from "@/components/ScopePanel";
import { useChallengeSession } from "@/hooks/useChallengeSession";
import { ChallengeRunner } from "@/components/challenge/ChallengeRunner";
import { useProfileStore } from "@/store/useProfileStore";
import { estimatedPercentile } from "@/engine/ability";

const ASSESSMENT_LENGTH = 12;

function isDomain(value: string | undefined): value is Domain {
  return !!value && (DOMAINS as string[]).includes(value);
}

export function AssessmentPage() {
  const { domain } = useParams<{ domain?: string }>();

  if (!isDomain(domain)) {
    return (
      <div>
        <div className="font-mono text-[11px] tracking-widest text-console-muted mb-1 px-1">
          ASSESSMENT MODE — SELECT A CHANNEL
        </div>
        <p className="text-sm text-console-muted mb-4 px-1">
          Controlled, fixed-length, no hints or retries — estimates your current ability rather than training it.
        </p>
        <DomainPicker basePath="/assess" />
      </div>
    );
  }

  return <AssessmentSession domain={domain} />;
}

function AssessmentSession({ domain }: { domain: Domain }) {
  const { currentItem, summary, finished, start, submitResult } = useChallengeSession({
    domain,
    mode: "assessment",
    sessionLength: ASSESSMENT_LENGTH,
  });
  const ability = useProfileStore((s) => s.domains[domain].ability);
  const meta = CHANNELS[domain];

  useEffect(() => {
    start();
  }, [domain, start]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link to="/assess" className="font-mono text-[11px] text-console-muted hover:text-console-text transition">
            ← CHANGE CHANNEL
          </Link>
          <h1 className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm font-semibold tracking-widest" style={{ color: meta.color }}>
              {meta.code}
            </span>
            <span className="text-console-muted text-sm">{DOMAIN_LABELS[domain]} — Assessment</span>
          </h1>
        </div>
        {!finished && (
          <div className="font-mono text-xs text-console-muted shrink-0">
            ITEM <span className="text-console-text tabular-nums">{Math.min(summary.itemsAnswered + 1, ASSESSMENT_LENGTH)}</span>{" "}
            / {ASSESSMENT_LENGTH}
          </div>
        )}
      </div>

      <ScopePanel>
        {finished ? (
          <div className="text-center space-y-3 py-6">
            <p className="font-mono text-[11px] tracking-widest text-console-muted">ASSESSMENT COMPLETE</p>
            <p className="text-5xl font-mono font-semibold tabular-nums" style={{ color: meta.color }}>
              P{estimatedPercentile(ability)}
            </p>
            <p className="font-mono text-[11px] tracking-widest text-console-muted">PERCENTILE (EST.)</p>
            <p className="text-sm text-console-muted font-mono">
              {summary.correctCount} / {summary.itemsAnswered} correct · {Math.round(summary.averageResponseTimeMs)} ms avg
              response
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                to="/assess"
                className="px-4 py-2 border border-console-line font-mono text-xs tracking-widest text-console-text hover:border-console-text/50 transition"
              >
                ANOTHER CHANNEL
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2 border border-console-text/30 bg-console-text text-console-bg font-mono text-xs tracking-widest hover:bg-white transition"
              >
                VIEW PROFILE
              </Link>
            </div>
          </div>
        ) : (
          currentItem && <ChallengeRunner item={currentItem} onComplete={submitResult} />
        )}
      </ScopePanel>
    </div>
  );
}
