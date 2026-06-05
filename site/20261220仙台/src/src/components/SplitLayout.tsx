import type { ReactNode } from "react";
import "../styles/split.css";

interface Props {
  imageSrc: string;
  children: ReactNode;
}

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
