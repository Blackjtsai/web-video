import type { ReactNode } from "react";

interface Props {
  onAdvance(): void;
  children: ReactNode;
}

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
