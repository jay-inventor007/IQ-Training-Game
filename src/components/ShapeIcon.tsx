import type { ShapeKind } from "@/engine/generators/fluidReasoning";
import { patternForColor } from "@/theme/motifs";

function ShapePath({ shape }: { shape: ShapeKind }) {
  switch (shape) {
    case "circle":
      return <circle cx="12" cy="12" r="9" />;
    case "square":
      return <rect x="3" y="3" width="18" height="18" />;
    case "triangle":
      return <polygon points="12,2 22,20 2,20" />;
    case "star":
      return (
        <polygon points="12,1 15,9 23,9 16.5,14 19,22 12,17 5,22 7.5,14 1,9 9,9" />
      );
    case "hexagon":
      return <polygon points="6,2 18,2 23,12 18,22 6,22 1,12" />;
    case "diamond":
      return <polygon points="12,1 23,12 12,23 1,12" />;
  }
}

interface ShapeIconProps {
  shape: ShapeKind;
  color: string;
  rotation: number;
  size?: number;
}

export function ShapeIcon({ shape, color, rotation, size = 28 }: ShapeIconProps) {
  const pattern = patternForColor(color);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${rotation}deg)` }}>
      <g fill={color}>
        <ShapePath shape={shape} />
      </g>
      {pattern && (
        <g fill={`url(#${pattern})`}>
          <ShapePath shape={shape} />
        </g>
      )}
    </svg>
  );
}
