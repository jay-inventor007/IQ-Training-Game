import { ALARM_COLOR } from "@/theme/channels";

const TICKS = 20;

export function TimerBar({ remainingMs, totalMs, color }: { remainingMs: number; totalMs: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));
  const urgent = pct < 30;
  const litTicks = Math.round((pct / 100) * TICKS);

  return (
    <div className="flex gap-0.5 mt-4" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      {Array.from({ length: TICKS }).map((_, i) => (
        <div
          key={i}
          className="h-2 flex-1 border-t border-console-line transition-colors duration-100"
          style={{ backgroundColor: i < litTicks ? (urgent ? ALARM_COLOR : color) : "transparent" }}
        />
      ))}
    </div>
  );
}
