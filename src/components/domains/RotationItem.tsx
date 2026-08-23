import { useEffect } from "react";
import type { ChallengeItem } from "@/engine/types";
import type { PolyominoContent } from "@/engine/generators/spatialReasoning";
import { CHANNELS } from "@/theme/channels";

const SPA_COLOR = CHANNELS.spatialReasoning.color;

function CellGrid({
  gridSize,
  cells,
  cellSize = 16,
}: {
  gridSize: number;
  cells: [number, number][];
  cellSize?: number;
}) {
  const filled = new Set(cells.map(([x, y]) => `${x},${y}`));
  return (
    <div className="grid gap-px bg-console-line border border-console-line" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
      {Array.from({ length: gridSize }).map((_, y) =>
        Array.from({ length: gridSize }).map((_, x) => (
          <div
            key={`${x}-${y}`}
            style={{ width: cellSize, height: cellSize, backgroundColor: filled.has(`${x},${y}`) ? SPA_COLOR : undefined }}
            className={filled.has(`${x},${y}`) ? "" : "bg-console-panel2"}
          />
        )),
      )}
    </div>
  );
}

interface RotationStimulusProps {
  item: ChallengeItem<PolyominoContent>;
  onReady: () => void;
}

export function RotationStimulus({ item, onReady }: RotationStimulusProps) {
  useEffect(() => {
    onReady();
  }, [item.id, onReady]);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-mono text-[11px] tracking-widest text-console-muted">WHICH OPTION IS THIS SHAPE, ROTATED?</p>
      <CellGrid gridSize={item.content.gridSize} cells={item.content.baseCells} cellSize={28} />
    </div>
  );
}

export function PolyominoPreview({ gridSize, cells }: { gridSize: number; cells: [number, number][] }) {
  return <CellGrid gridSize={gridSize} cells={cells} cellSize={14} />;
}
