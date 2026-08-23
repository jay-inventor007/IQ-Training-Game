import type { ReactNode } from "react";

/** An instrument-panel container with viewfinder-style corner brackets. */
export function ScopePanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative border border-console-line bg-console-panel p-6 ${className}`}>
      <span className="absolute -top-px -left-px h-3 w-3 border-t-2 border-l-2 border-console-text/40" aria-hidden="true" />
      <span className="absolute -top-px -right-px h-3 w-3 border-t-2 border-r-2 border-console-text/40" aria-hidden="true" />
      <span className="absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-console-text/40" aria-hidden="true" />
      <span className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-console-text/40" aria-hidden="true" />
      {children}
    </div>
  );
}
