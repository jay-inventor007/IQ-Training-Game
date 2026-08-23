import { useEffect, useState } from "react";
import type { ChallengeItem } from "@/engine/types";
import type { SequenceContent } from "@/engine/generators/workingMemory";
import { CHANNELS } from "@/theme/channels";

const MEM_COLOR = CHANNELS.workingMemory.color;

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
      <p className="font-mono text-[11px] tracking-widest text-console-muted">
        {done ? "WHICH SEQUENCE DID YOU SEE?" : "RECORDING…"}
      </p>
      <div className="grid gap-px bg-console-line border border-console-line" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => (
          <div
            key={idx}
            className="w-10 h-10 bg-console-panel2 transition-colors"
            style={idx === activeIndex ? { backgroundColor: MEM_COLOR } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export function SequencePreview({ gridSize, sequence }: { gridSize: number; sequence: number[] }) {
  const order = new Map(sequence.map((cell, i) => [cell, i + 1]));
  return (
    <div className="grid gap-px bg-console-line border border-console-line" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
      {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
        const orderIndex = order.get(idx);
        return (
          <div
            key={idx}
            className="w-5 h-5 font-mono text-[9px] flex items-center justify-center bg-console-panel2"
            style={orderIndex ? { backgroundColor: `${MEM_COLOR}33`, color: MEM_COLOR } : undefined}
          >
            {orderIndex ?? ""}
          </div>
        );
      })}
    </div>
  );
}
