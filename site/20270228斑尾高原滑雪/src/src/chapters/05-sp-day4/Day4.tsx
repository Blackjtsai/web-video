import "./Day4.css";

interface Props { step: number; }

const RETURN_TRANSIT = [
  { time: "15:00", text: "最後一天滑雪，下午收板" },
  { time: "16:30", text: "回飯店拿行李、換衣，步行到斑尾高原口前" },
  { time: "17:05", text: "斑尾 → 飯山，冬季班次巴士" },
  { time: "18:30", text: "飯山 → 東京站，轉北陸新幹線" },
  { time: "21:00", text: "抵達羽田機場休息，3/4 05:00 起飛回桃園" },
];

export default function Day4({ step }: Props) {
  return (
    <div className="d4-stage">
      <div className="d4-header">
        <div className="d4-day-tag">DAY 04 &nbsp;·&nbsp; 03.03 WED</div>
        <div className="d4-day-title">Best Snow Day・收官＋回程</div>
      </div>

      {step === 0 && (
        <div className="d4-block d4-best">
          <div className="d4-best-icon">🏆</div>
          <div className="d4-time">08:30 — 15:00</div>
          <div className="d4-best-title">最佳雪日・自由重刷最愛路線</div>
          <div className="d4-best-sub">
            依照前三天累積的雪況與體力狀況，大家可以自由選擇重刷最喜歡的路線和區域，
            把整趟旅程最滿意的回憶留到最後一天。
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="d4-block">
          <ul className="d4-timeline">
            {RETURN_TRANSIT.map(t => (
              <li key={t.time} className="d4-timeline-item">
                <span className="d4-timeline-time">{t.time}</span>
                <span className="d4-timeline-text">{t.text}</span>
              </li>
            ))}
          </ul>
          <div className="d4-note-box">
            <div className="d4-note-label">回程重點</div>
            <div className="d4-note-text">下午三點收板後回飯店拿行李、梳洗換裝，晚上九點到九點半抵達羽田機場休息，準備隔天凌晨五點的班機飛回桃園。</div>
          </div>
        </div>
      )}
    </div>
  );
}
