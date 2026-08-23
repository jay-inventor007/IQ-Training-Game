import type { ChallengeItem } from "@/engine/types";
import type { AttributeCombo } from "@/engine/generators/fluidReasoning";
import type { SequenceContent } from "@/engine/generators/workingMemory";
import type { PolyominoContent } from "@/engine/generators/spatialReasoning";
import { ComboCell } from "@/components/domains/MatrixItem";
import { SequencePreview } from "@/components/domains/SequenceRecallItem";
import { PolyominoPreview } from "@/components/domains/RotationItem";

interface OptionGridProps {
  item: ChallengeItem;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
  revealCorrectId?: string | null;
  selectedId?: string | null;
}

function OptionContent({ item, content }: { item: ChallengeItem; content: unknown }) {
  switch (item.domain) {
    case "fluidReasoning":
      return <ComboCell combo={content as AttributeCombo} />;
    case "workingMemory": {
      const { gridSize } = item.content as SequenceContent;
      return <SequencePreview gridSize={gridSize} sequence={content as number[]} />;
    }
    case "spatialReasoning": {
      const { gridSize } = item.content as PolyominoContent;
      return <PolyominoPreview gridSize={gridSize} cells={content as [number, number][]} />;
    }
    case "processingSpeed":
      return <span className="text-base font-semibold">{content as string}</span>;
    case "quantitativeReasoning":
      return <span className="text-2xl font-mono">{content as number}</span>;
    default:
      return null;
  }
}

export function OptionGrid({ item, onSelect, disabled, revealCorrectId, selectedId }: OptionGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
      {item.options.map((option) => {
        const isCorrect = revealCorrectId != null && option.id === revealCorrectId;
        const isWrongSelected = revealCorrectId != null && option.id === selectedId && option.id !== revealCorrectId;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={disabled}
            className={`rounded-xl border p-3 flex items-center justify-center transition disabled:cursor-default ${
              isCorrect
                ? "border-emerald-400 bg-emerald-400/10"
                : isWrongSelected
                  ? "border-rose-400 bg-rose-400/10"
                  : "border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 disabled:opacity-60"
            }`}
          >
            <OptionContent item={item} content={option.content} />
          </button>
        );
      })}
    </div>
  );
}
