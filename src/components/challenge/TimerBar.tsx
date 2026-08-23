export function TimerBar({ remainingMs, totalMs }: { remainingMs: number; totalMs: number }) {
  const pct = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));
  const urgent = pct < 30;
  return (
    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-4">
      <div
        className={`h-full transition-[width] duration-100 ease-linear ${urgent ? "bg-rose-500" : "bg-cyan-400"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
