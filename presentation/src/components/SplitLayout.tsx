import type { ReactNode } from "react";
import "../styles/split.css";

interface Props {
  imageSrc: string;
  children: ReactNode;
}

/**
 * Split layout: left half = fixed chapter image, right half = step content.
 * Activated by ?layout=split in the URL.
 */
export function SplitLayout({ imageSrc, children }: Props) {
  return (
    <div className="split-layout">
      <div className="split-left">
        <img className="split-img" src={imageSrc} alt="" />
      </div>
      <div className="split-right">
        {children}
      </div>
    </div>
  );
}
