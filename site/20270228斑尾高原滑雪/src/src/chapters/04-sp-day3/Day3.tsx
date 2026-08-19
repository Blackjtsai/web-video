import "./Day3.css";

interface Props { step: number; }

export default function Day3({ step: _step }: Props) {
  return (
    <div className="d3-stage">
      <div className="d3-header">
        <div className="d3-day-tag">DAY 03 &nbsp;·&nbsp; 03.02 TUE</div>
        <div className="d3-day-title">斑尾 → Tangram 雙雪場</div>
      </div>
      <div className="d3-block">
        <div className="d3-time">08:30 — 16:30</div>
        <div className="d3-route">
          <div className="d3-route-node">Madarao</div>
          <div className="d3-route-arrow">Mountain Pass →</div>
          <div className="d3-route-node">Tangram</div>
          <div className="d3-route-arrow">→ 下午滑回</div>
          <div className="d3-route-node">Madarao</div>
        </div>
        <div className="d3-note-box">
          <div className="d3-note-label">今日玩法</div>
          <div className="d3-note-text">
            用共通的 Mountain Pass 雪票，從斑尾一路滑到鄰近的 Tangram 雪場探索新地形，
            下午再滑回斑尾基地，一天之內體驗兩座雪場的不同風貌。
          </div>
        </div>
      </div>
    </div>
  );
}
