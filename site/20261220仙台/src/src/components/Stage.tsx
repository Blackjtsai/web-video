import type { ReactNode } from "react";

interface Props {
  onAdvance(): void;
  children: ReactNode;
}

/**
 * 16:9 fixed-aspect-ratio stage.
 * Sizing is handled entirely by CSS (min(100vw, 100vh*16/9)).
 * No JS transform scale needed — fonts are real viewport px.
 */
export function Stage({ onAdvance, children }: Props) {
  return (
    <div className="app-shell">
      <div
        className="stage-frame"
        onClick={(e) => {
          const t = e.target as HTMLElement;
          if (t.closest("button, a, input, [data-no-advance]")) return;
          onAdvance();
        }}
      >
        {children}
      </div>
    </div>
  );
}
