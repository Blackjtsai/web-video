import "./Day1.css";

interface Props { step: number; }

const TRANSIT = [
  { time: "04:00", text: "羽田 T3 抵達，入境＋領行李／雪板" },
  { time: "05:15", text: "離開羽田，電車前往東京站" },
  { time: "06:28", text: "東京 → 飯山，北陸新幹線 Hakutaka 551" },
  { time: "08:16", text: "飯山站抵達，轉斑尾高原方向巴士" },
  { time: "09:35", text: "斑尾高原口前下車，步行到飯店" },
  { time: "10:30", text: "寄行李、換裝後，開始滑雪" },
];

export default function Day1({ step }: Props) {
  return (
    <div className="d1-stage">
      <div className="d1-header">
        <div className="d1-day-tag">DAY 01 &nbsp;·&nbsp; 02.28 SUN</div>
        <div className="d1-day-title">去程交通・直奔斑尾高原</div>
      </div>

      {step === 0 && (
        <div className="d1-block">
          <ul className="d1-timeline">
            {TRANSIT.map(t => (
              <li key={t.time} className="d1-timeline-item">
                <span className="d1-timeline-time">{t.time}</span>
                <span className="d1-timeline-text">{t.text}</span>
              </li>
            ))}
          </ul>
          <div className="d1-note-box">
            <div className="d1-note-label">去程重點</div>
            <div className="d1-note-text">虎航深夜班機凌晨落地，全程走公共交通，從飯山轉巴士直達斑尾高原，理想狀況約 10:30 就能開滑。</div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="d1-block d1-ski">
          <div className="d1-ski-icon">⛷</div>
          <div className="d1-ski-title">熟悉主雪場・視情況夜滑</div>
          <div className="d1-ski-sub">
            抵達後先熟悉斑尾主雪場與主要纜車動線，讓身體和裝備都進入狀態。
            如果當季夜滑場次有開放，體力許可的話還可以加碼夜滑，為接下來三天的全力衝刺熱身。
          </div>
        </div>
      )}
    </div>
  );
}
