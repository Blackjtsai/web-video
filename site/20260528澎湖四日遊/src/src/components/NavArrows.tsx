import "./NavArrows.css";

interface Props {
  onPrev(): void;
  onNext(): void;
}

export function NavArrows({ onPrev, onNext }: Props) {
  return (
    <div className="nav-arrows" data-no-advance>
      <button className="nav-btn nav-btn--prev" onClick={onPrev} aria-label="上一步" tabIndex={-1}>
        ‹
      </button>
      <button className="nav-btn nav-btn--next" onClick={onNext} aria-label="下一步" tabIndex={-1}>
        ›
      </button>
    </div>
  );
}
