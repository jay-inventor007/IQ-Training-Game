import type { ChallengeItem } from "@/engine/types";
import type { AttributeCombo } from "@/engine/generators/fluidReasoning";
import type { SequenceContent } from "@/engine/generators/workingMemory";
import type { PolyominoContent } from "@/engine/generators/spatialReasoning";
import { ComboCell } from "@/components/domains/MatrixItem";
import { SequencePreview } from "@/components/domains/SequenceRecallItem";
import { PolyominoPreview } from "@/components/domains/RotationItem";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

interface OptionGridProps {
  item: ChallengeItem;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
  revealCorrectId?: string | null;
  selectedId?: string | null;
  channelColor: string;
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
      return <span className="font-mono text-sm tracking-wide">{content as string}</span>;
    case "quantitativeReasoning":
      return <span className="text-xl font-mono tabular-nums">{content as number}</span>;
    default:
      return null;
  }
}

export function OptionGrid({ item, onSelect, disabled, revealCorrectId, selectedId, channelColor }: OptionGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-5">
      {item.options.map((option, i) => {
        const isCorrect = revealCorrectId != null && option.id === revealCorrectId;
        const isWrongSelected = revealCorrectId != null && option.id === selectedId && option.id !== revealCorrectId;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={disabled}
            style={isCorrect ? { borderColor: channelColor, backgroundColor: `${channelColor}1a` } : undefined}
            className={`flex items-center gap-2.5 border p-2.5 min-h-[44px] transition disabled:cursor-default text-left active:scale-[0.97] ${
              isCorrect
                ? ""
                : isWrongSelected
                  ? "border-alarm bg-alarm/10"
                  : "border-console-line bg-console-panel2 hover:border-console-text/40 active:border-console-text/60 disabled:opacity-60"
            }`}
          >
            <span className="font-mono text-[10px] text-console-muted border border-console-line w-5 h-5 flex items-center justify-center shrink-0">
              {OPTION_LETTERS[i] ?? i + 1}
            </span>
            <span className="flex items-center justify-center flex-1">
              <OptionContent item={item} content={option.content} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
