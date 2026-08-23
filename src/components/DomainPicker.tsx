import { Link } from "react-router-dom";
import { DOMAINS, DOMAIN_LABELS, DOMAIN_DESCRIPTIONS } from "@/engine/types";

export function DomainPicker({ basePath }: { basePath: string }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {DOMAINS.map((domain) => (
        <Link
          key={domain}
          to={`${basePath}/${domain}`}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-cyan-500/60 hover:bg-slate-900 transition"
        >
          <h3 className="font-medium mb-1">{DOMAIN_LABELS[domain]}</h3>
          <p className="text-sm text-slate-400">{DOMAIN_DESCRIPTIONS[domain]}</p>
        </Link>
      ))}
    </div>
  );
}
