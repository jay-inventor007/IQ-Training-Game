import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DOMAINS, DOMAIN_LABELS, type Domain } from "@/engine/types";
import { DomainPicker } from "@/components/DomainPicker";
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
        <h1 className="text-xl font-semibold mb-4">Training — pick a domain</h1>
        <DomainPicker basePath="/train" />
      </div>
    );
  }

  return <TrainingSession domain={domain} />;
}

function TrainingSession({ domain }: { domain: Domain }) {
  const { currentItem, summary, start, submitResult } = useChallengeSession({ domain, mode: "training" });

  useEffect(() => {
    start();
  }, [domain, start]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/train" className="text-sm text-slate-500 hover:text-slate-300">
            ← Change domain
          </Link>
          <h1 className="text-xl font-semibold mt-1">{DOMAIN_LABELS[domain]} — Training</h1>
        </div>
        <div className="text-sm text-slate-400 text-right">
          <div>
            {summary.correctCount} / {summary.itemsAnswered} correct
          </div>
          {summary.itemsAnswered > 0 && <div>{Math.round(summary.averageResponseTimeMs)} ms avg</div>}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        {currentItem && <ChallengeRunner item={currentItem} onComplete={submitResult} />}
      </div>
    </div>
  );
}
