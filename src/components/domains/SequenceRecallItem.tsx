import { useEffect, useState } from "react";
import type { ChallengeItem } from "@/engine/types";
import type { SequenceContent } from "@/engine/generators/workingMemory";

interface SequenceStimulusProps {
  item: ChallengeItem<SequenceContent>;
  onReady: () => void;
}

export function SequenceStimulus({ item, onReady }: SequenceStimulusProps) {
  const { gridSize, sequence, revealMs } = item.content;
  const [activeIndex, setActiveIndex] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setActiveIndex(-1);
    setDone(false);
    let cancelled = false;
    let step = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      if (cancelled) return;
      if (step >= sequence.length) {
        setActiveIndex(-1);
        setDone(true);
        onReady();
        return;
      }
      setActiveIndex(sequence[step]);
      step++;
      timeoutId = setTimeout(tick, revealMs);
    }

    timeoutId = setTimeout(tick, 500);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [item.id, onReady, revealMs, sequence]);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-slate-400">{done ? "Which sequence did you see?" : "Watch the sequence…"}</p>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => (
          <div
            key={idx}
            className={`w-10 h-10 rounded border ${
              idx === activeIndex ? "bg-cyan-400 border-cyan-300" : "bg-slate-800 border-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function SequencePreview({ gridSize, sequence }: { gridSize: number; sequence: number[] }) {
  const order = new Map(sequence.map((cell, i) => [cell, i + 1]));
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
      {Array.from({ length: gridSize * gridSize }).map((_, idx) => (
        <div
          key={idx}
          className={`w-5 h-5 rounded-sm border text-[9px] flex items-center justify-center ${
            order.has(idx) ? "bg-cyan-500/80 border-cyan-300 text-white" : "bg-slate-800 border-slate-700"
          }`}
        >
          {order.get(idx) ?? ""}
        </div>
      ))}
    </div>
  );
}
