import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DOMAINS, DOMAIN_LABELS, type Domain } from "@/engine/types";
import { DomainPicker } from "@/components/DomainPicker";
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
        <h1 className="text-xl font-semibold mb-1">Assessment — pick a domain</h1>
        <p className="text-sm text-slate-400 mb-4">
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

  useEffect(() => {
    start();
  }, [domain, start]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/assess" className="text-sm text-slate-500 hover:text-slate-300">
            ← Change domain
          </Link>
          <h1 className="text-xl font-semibold mt-1">{DOMAIN_LABELS[domain]} — Assessment</h1>
        </div>
        {!finished && (
          <div className="text-sm text-slate-400">
            Item {Math.min(summary.itemsAnswered + 1, ASSESSMENT_LENGTH)} / {ASSESSMENT_LENGTH}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        {finished ? (
          <div className="text-center space-y-3 py-6">
            <p className="text-slate-400">Assessment complete</p>
            <p className="text-4xl font-semibold text-cyan-400">{estimatedPercentile(ability)}th percentile (est.)</p>
            <p className="text-sm text-slate-500">
              {summary.correctCount} / {summary.itemsAnswered} correct · {Math.round(summary.averageResponseTimeMs)} ms avg
              response
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link to="/assess" className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800">
                Choose another domain
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400"
              >
                View profile
              </Link>
            </div>
          </div>
        ) : (
          currentItem && <ChallengeRunner item={currentItem} onComplete={submitResult} />
        )}
      </div>
    </div>
  );
}
