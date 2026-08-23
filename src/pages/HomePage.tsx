import { Link } from "react-router-dom";
import { DomainPicker } from "@/components/DomainPicker";

export function HomePage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold mb-2">Train your cognitive edge</h1>
        <p className="text-slate-400 max-w-2xl">
          Procedurally generated challenges across five cognitive domains, adapting to your ability as you play.
          No fixed level cap — the system keeps looking for your ceiling.
        </p>
        <div className="flex gap-3 mt-5">
          <Link to="/train" className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400">
            Start training
          </Link>
          <Link
            to="/assess"
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-200 font-medium hover:bg-slate-800"
          >
            Take an assessment
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Pick a domain to train</h2>
        <DomainPicker basePath="/train" />
      </section>
    </div>
  );
}
