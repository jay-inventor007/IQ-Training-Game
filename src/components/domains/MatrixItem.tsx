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
    <div className="flex flex-col items-center gap-3">
      <p className="font-mono text-[11px] tracking-widest text-console-muted">WHICH PIECE COMPLETES THE PATTERN?</p>
      <div className="grid grid-cols-3 gap-px bg-console-line w-fit mx-auto border border-console-line">
        {item.content.cells.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className="w-20 h-20 bg-console-panel2 flex items-center justify-center">
              {cell ? <ComboCell combo={cell} /> : <span className="font-mono text-2xl text-console-muted">?</span>}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
