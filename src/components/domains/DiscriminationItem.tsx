import { useEffect } from "react";
import type { ChallengeItem } from "@/engine/types";
import type { DiscriminationContent } from "@/engine/generators/processingSpeed";
import { ShapeIcon } from "@/components/ShapeIcon";

interface DiscriminationStimulusProps {
  item: ChallengeItem<DiscriminationContent>;
  onReady: () => void;
}

export function DiscriminationStimulus({ item, onReady }: DiscriminationStimulusProps) {
  useEffect(() => {
    onReady();
  }, [item.id, onReady]);

  const { ruleLabel, target, stimulus } = item.content;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-mono text-[11px] tracking-widest text-console-muted uppercase">{ruleLabel}</p>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2 border border-console-line px-5 py-4">
          <span className="font-mono text-[10px] tracking-widest text-console-muted">TARGET</span>
          <ShapeIcon shape={target.shape} color={target.color} rotation={0} size={48} />
        </div>
        <span className="font-mono text-xs text-console-muted">VS</span>
        <div className="flex flex-col items-center gap-2 border border-console-line px-5 py-4">
          <span className="font-mono text-[10px] tracking-widest text-console-muted">STIMULUS</span>
          <ShapeIcon shape={stimulus.shape} color={stimulus.color} rotation={0} size={48} />
        </div>
      </div>
    </div>
  );
}
