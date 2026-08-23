import { useEffect } from "react";
import type { ChallengeItem } from "@/engine/types";
import type { PolyominoContent } from "@/engine/generators/spatialReasoning";

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
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
      {Array.from({ length: gridSize }).map((_, y) =>
        Array.from({ length: gridSize }).map((_, x) => (
          <div
            key={`${x}-${y}`}
            style={{ width: cellSize, height: cellSize }}
            className={`rounded-sm ${
              filled.has(`${x},${y}`) ? "bg-emerald-400" : "bg-slate-800 border border-slate-700"
            }`}
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
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-slate-400">Which option is this shape, rotated?</p>
      <CellGrid gridSize={item.content.gridSize} cells={item.content.baseCells} cellSize={28} />
    </div>
  );
}

export function PolyominoPreview({ gridSize, cells }: { gridSize: number; cells: [number, number][] }) {
  return <CellGrid gridSize={gridSize} cells={cells} cellSize={14} />;
}
