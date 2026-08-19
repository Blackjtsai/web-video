import "./Day2.css";

interface Props { step: number; }

export default function Day2({ step: _step }: Props) {
  return (
    <div className="d2-stage">
      <div className="d2-header">
        <div className="d2-day-tag">DAY 02 &nbsp;·&nbsp; 03.01 MON</div>
        <div className="d2-day-title">斑尾全山攻略日</div>
      </div>
      <div className="d2-block">
        <div className="d2-time">08:30 — 16:30</div>
        <div className="d2-lead">主攻斑尾最具特色的樹林雪道、粉雪與非壓雪地形。</div>
        <div className="d2-note-box">
          <div className="d2-note-label">今日焦點</div>
          <div className="d2-note-text">
            感受斑尾之所以吸引全球雪友的森林滑雪魅力，是整趟行程滑雪強度最高、最盡興的一天。
          </div>
        </div>
        <div className="d2-tags">
          <span className="d2-tag">Tree Run</span>
          <span className="d2-tag">Powder</span>
          <span className="d2-tag">非壓雪地形</span>
        </div>
      </div>
    </div>
  );
}
