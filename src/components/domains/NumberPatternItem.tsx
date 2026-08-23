import { useEffect } from "react";
import type { ChallengeItem } from "@/engine/types";
import type { NumberSequenceContent } from "@/engine/generators/quantitativeReasoning";
import { CHANNELS } from "@/theme/channels";

const QNT_COLOR = CHANNELS.quantitativeReasoning.color;

interface NumberPatternStimulusProps {
  item: ChallengeItem<NumberSequenceContent>;
  onReady: () => void;
}

export function NumberPatternStimulus({ item, onReady }: NumberPatternStimulusProps) {
  useEffect(() => {
    onReady();
  }, [item.id, onReady]);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-mono text-[11px] tracking-widest text-console-muted">WHAT COMES NEXT?</p>
      <div className="flex items-center gap-px bg-console-line border border-console-line flex-wrap justify-center">
        {item.content.sequence.map((v, i) => (
          <span key={i} className="text-xl font-mono tabular-nums bg-console-panel2 px-4 py-3">
            {v}
          </span>
        ))}
        <span className="text-xl font-mono px-4 py-3" style={{ backgroundColor: `${QNT_COLOR}22`, color: QNT_COLOR }}>
          ?
        </span>
      </div>
    </div>
  );
}
