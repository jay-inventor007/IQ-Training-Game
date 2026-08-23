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
      <p className="text-sm text-slate-400">{ruleLabel}</p>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs uppercase tracking-wide text-slate-500">Target</span>
          <ShapeIcon shape={target.shape} color={target.color} rotation={0} size={48} />
        </div>
        <span className="text-2xl text-slate-600">vs</span>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs uppercase tracking-wide text-slate-500">Stimulus</span>
          <ShapeIcon shape={stimulus.shape} color={stimulus.color} rotation={0} size={48} />
        </div>
      </div>
    </div>
  );
}
