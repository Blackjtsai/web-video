import { useState } from "react";
import { createPortal } from "react-dom";
import "./TrailMap.css";

interface Props {
  src: string;
  label: string;
}

export default function TrailMap({ src, label }: Props) {
  const [open, setOpen] = useState(false);
  const base = import.meta.env.BASE_URL;

  return (
    <>
      <button className="tm-thumb" onClick={() => setOpen(true)} type="button">
        <img src={`${base}${src}`} alt={label} className="tm-thumb-img" />
        <div className="tm-thumb-overlay">
          <span className="tm-thumb-icon">🗺️</span>
          <span className="tm-thumb-label">{label}</span>
        </div>
      </button>
      {open && createPortal(
        <div className="tm-lightbox" onClick={() => setOpen(false)}>
          <img src={`${base}${src}`} alt={label} className="tm-lightbox-img" onClick={(e) => e.stopPropagation()} />
          <button className="tm-lightbox-close" onClick={() => setOpen(false)} type="button" aria-label="關閉">✕</button>
        </div>,
        document.body
      )}
    </>
  );
}
