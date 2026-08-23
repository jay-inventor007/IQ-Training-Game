import { Link } from "react-router-dom";
import { DomainPicker } from "@/components/DomainPicker";

export function HomePage() {
  return (
    <div className="space-y-6">
      <section className="border border-console-line bg-console-panel px-4 sm:px-5 py-4">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-console-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-channel-flu animate-pulse-flash" style={{ animationIterationCount: "infinite", animationDuration: "2.4s" }} aria-hidden="true" />
          5-CHANNEL COGNITIVE MONITOR
        </div>
        <p className="text-console-muted text-sm max-w-2xl mt-2">
          Every problem is generated and validated on the spot, then targeted to your measured ability — no
          fixed level cap, no repeated question bank. The system keeps searching for your ceiling.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link
            to="/train"
            className="inline-flex items-center gap-2 border border-console-text/30 bg-console-text text-console-bg px-4 py-2 font-mono text-xs tracking-widest hover:bg-white transition"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-console-bg" aria-hidden="true" />
            TRAINING MODE
          </Link>
          <Link
            to="/assess"
            className="inline-flex items-center gap-2 border border-console-line px-4 py-2 font-mono text-xs tracking-widest text-console-text hover:border-console-text/50 transition"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-channel-spd" aria-hidden="true" />
            ASSESSMENT MODE
          </Link>
        </div>
      </section>

      <section>
        <div className="font-mono text-[11px] tracking-widest text-console-muted mb-2 px-1">CHANNELS — SELECT TO TRAIN</div>
        <DomainPicker basePath="/train" />
      </section>
    </div>
  );
}
