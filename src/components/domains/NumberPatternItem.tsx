import { useEffect } from "react";
import type { ChallengeItem } from "@/engine/types";
import type { NumberSequenceContent } from "@/engine/generators/quantitativeReasoning";

interface NumberPatternStimulusProps {
  item: ChallengeItem<NumberSequenceContent>;
  onReady: () => void;
}

export function NumberPatternStimulus({ item, onReady }: NumberPatternStimulusProps) {
  useEffect(() => {
    onReady();
  }, [item.id, onReady]);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-slate-400">What comes next?</p>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {item.content.sequence.map((v, i) => (
          <span key={i} className="text-2xl font-mono bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
            {v}
          </span>
        ))}
        <span className="text-2xl font-mono bg-slate-800 border border-cyan-500 text-cyan-400 rounded-lg px-3 py-2">
          ?
        </span>
      </div>
    </div>
  );
}
