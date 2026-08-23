/**
 * Global SVG pattern definitions, mounted once (see App.tsx) and referenced
 * by id from anywhere via fill="url(#motif-x)". Backs the colorblind-safe
 * puzzle palette in theme/motifs.ts — each pattern is a black overlay mark
 * at partial opacity, so it reads as texture on top of any base hue.
 */
export function PatternDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="motif-diagonal" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#000" strokeOpacity="0.45" strokeWidth="2.5" />
        </pattern>
        <pattern id="motif-dots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.3" fill="#000" fillOpacity="0.5" />
        </pattern>
        <pattern id="motif-crosshatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#000" strokeOpacity="0.4" strokeWidth="1.6" />
          <line x1="0" y1="0" x2="7" y2="0" stroke="#000" strokeOpacity="0.4" strokeWidth="1.6" />
        </pattern>
        <pattern id="motif-horizontal" width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="6" y2="0" stroke="#000" strokeOpacity="0.45" strokeWidth="2.5" />
        </pattern>
        <pattern id="motif-rings" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="3" fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="1.4" />
        </pattern>
      </defs>
    </svg>
  );
}
