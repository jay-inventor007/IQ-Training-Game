import { useEffect } from "react";
import type { ChallengeItem } from "@/engine/types";
import type { AttributeCombo, MatrixContent } from "@/engine/generators/fluidReasoning";
import { ShapeIcon } from "@/components/ShapeIcon";

export function ComboCell({ combo }: { combo: AttributeCombo }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: combo.count }).map((_, i) => (
        <ShapeIcon key={i} shape={combo.shape} color={combo.color} rotation={combo.rotation} size={22} />
      ))}
    </div>
  );
}

interface MatrixStimulusProps {
  item: ChallengeItem<MatrixContent>;
  onReady: () => void;
}

export function MatrixStimulus({ item, onReady }: MatrixStimulusProps) {
  useEffect(() => {
    onReady();
  }, [item.id, onReady]);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-slate-400">Which piece completes the pattern?</p>
      <div className="grid grid-cols-3 gap-2 w-fit mx-auto">
        {item.content.cells.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className="w-20 h-20 rounded-lg border border-slate-700 bg-slate-800/60 flex items-center justify-center"
            >
              {cell ? <ComboCell combo={cell} /> : <span className="text-3xl text-slate-500">?</span>}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
