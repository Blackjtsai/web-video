import "./Day4.css";

interface Props { step: number; }

const CHECKS = [
  "退房前確認房間內貴重物品",
  "行李寄放櫃檯位置",
  "更衣、雪具打包",
  "巴士發車時刻再次確認",
];

export default function Day4({ step }: Props) {
  return (
    <div className="d4-stage">
      <div className="d4-header">
        <div className="d4-day-tag">DAY 04 &nbsp;·&nbsp; 03.03 WED</div>
        <div className="d4-day-title">機動滑雪日</div>
      </div>

      {step === 0 && (
        <div className="d4-block">
          <div className="d4-ticket">
            <span className="d4-ticket-label">3日券</span>
            <span className="d4-ticket-day">Day 3 / 3</span>
          </div>
          <div className="d4-note-box">
            <div className="d4-note-label">自由路線</div>
            <div className="d4-note-text">前兩天探過的雪場，挑一條最喜歡的路線再滑一輪，不用照表操課。</div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="d4-block">
          <div className="d4-time-badge">14:00–15:00</div>
          <div className="d4-note-box">
            <div className="d4-note-label">收板底線</div>
            <div className="d4-note-text">接下來要退房、寄放行李、換裝，時間抓得太緊會手忙腳亂。</div>
          </div>
          <div className="d4-checklist">
            {CHECKS.map((c, i) => (
              <div key={i} className="d4-check-item" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="d4-check-icon">✓</div>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="d4-block">
          <ul className="d4-timeline">
            <li className="d4-timeline-item">
              <span className="d4-timeline-time">滑完</span>
              <span className="d4-timeline-text">回志賀百樂酒店拿行李，若飯店允許可洗澡換衣</span>
            </li>
            <li className="d4-timeline-item">
              <span className="d4-timeline-time">約 15:30–16:00</span>
              <span className="d4-timeline-text">離開飯店</span>
            </li>
            <li className="d4-timeline-item">
              <span className="d4-timeline-time">巴士下山</span>
              <span className="d4-timeline-text">高天原 → 長野</span>
            </li>
            <li className="d4-timeline-item">
              <span className="d4-timeline-time">約 17:30–18:00</span>
              <span className="d4-timeline-text">抵達長野站</span>
            </li>
            <li className="d4-timeline-item">
              <span className="d4-timeline-time">新幹線</span>
              <span className="d4-timeline-text">長野 → 東京 → 轉羽田</span>
            </li>
            <li className="d4-timeline-item">
              <span className="d4-timeline-time">約 21:00–22:30</span>
              <span className="d4-timeline-text">抵達羽田機場</span>
            </li>
          </ul>
          <div className="d4-note-box">
            <div className="d4-note-label">羽田過夜等班機</div>
            <div className="d4-note-text">不訂東京住宿，直接在羽田等隔天凌晨五點的班機。實際巴士與新幹線班次，要等冬季志賀高原巴士班表公布後再微調。</div>
          </div>
        </div>
      )}
    </div>
  );
}
