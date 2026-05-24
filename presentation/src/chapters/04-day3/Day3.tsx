import "./Day3.css";

interface Props {
  step: number;
}

export default function Day3({ step }: Props) {
  if (step === 0) return <Market />;
  if (step === 1) return <Xiyou />;
  if (step === 2) return <NightFishing />;
  if (step === 3) return <Experience />;
  if (step === 4) return <InkWarning />;
  return null;
}

/* ── Step 0: Day 3 開場 — 第三魚市場（自由行）── */
function Market() {
  return (
    <div className="d3-market">
      <div className="d3-market-left">
        <div className="d3-market-daytag">Day 3 · 5月30日（六）</div>
        <div className="d3-market-time">05:00 – 07:00</div>
        <div className="d3-market-title">第三魚市場</div>
        <div className="d3-market-sub">
          澎湖最在地的清晨<br />漁獲拍賣，真實早市
        </div>
        <div className="d3-market-footer">
          <div className="d3-market-badge">自由行程</div>
          <div className="d3-market-note">不想去的人繼續睡就好</div>
        </div>
      </div>
      <div className="d3-market-right">
        <img
          className="d3-market-img"
          src="/images/day3.jpg"
          alt="Day 3 西嶼探秘 & 夜釣"
        />
      </div>
    </div>
  );
}

/* ── Step 1: 西嶼一日遊 ── */
function Xiyou() {
  return (
    <div className="d3-xiyou">
      <div className="d3-xiyou-time">09:30</div>
      <div className="d3-xiyou-title">西嶼鄉一日遊</div>
      <div className="d3-xiyou-spots">
        <div className="d3-xiyou-spot">跨海大橋</div>
        <div className="d3-xiyou-dot">·</div>
        <div className="d3-xiyou-spot">二崁聚落</div>
      </div>
      <div className="d3-xiyou-sub">沿途慢慢走</div>
    </div>
  );
}

/* ── Step 2: 晶翔號夜釣 — 集合資訊 ── */
function NightFishing() {
  return (
    <div className="d3-night">
      <div className="d3-night-eyebrow">今晚最刺激的行程</div>
      <div className="d3-night-title">晶翔號夜釣小管</div>
      <div className="d3-night-time-row">
        <div className="d3-night-time">17:30</div>
        <div className="d3-night-arrow">→</div>
        <div className="d3-night-time">20:30</div>
      </div>
      <div className="d3-night-location">
        <div className="d3-night-location-label">集合地點</div>
        <div className="d3-night-location-text">白沙鄉沙港村碼頭</div>
      </div>
      <div className="d3-night-warn">務必提前 10 分鐘到</div>
    </div>
  );
}

/* ── Step 3: 夜釣體驗 + 現煮漁夫料理 ── */
function Experience() {
  return (
    <div className="d3-exp">
      <div className="d3-exp-items">
        <div className="d3-exp-item">
          <div className="d3-exp-icon">釣</div>
          <div className="d3-exp-text">
            <div className="d3-exp-name">夜間海上垂釣</div>
            <div className="d3-exp-sub">五點半出發，八點半結束</div>
          </div>
        </div>
        <div className="d3-exp-item">
          <div className="d3-exp-icon">煮</div>
          <div className="d3-exp-text">
            <div className="d3-exp-name">現煮漁夫料理</div>
            <div className="d3-exp-sub">釣完直接吃，新鮮現做</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 4: 小管噴墨汁 警告 ── */
function InkWarning() {
  return (
    <div className="d3-ink">
      <div className="d3-ink-card">
        <div className="d3-ink-tag">重要提醒 · Important</div>
        <div className="d3-ink-main">小管噴墨汁</div>
        <div className="d3-ink-rule" />
        <div className="d3-ink-body">
          <div className="d3-ink-line">當晚絕對不要穿淺色衣服</div>
          <div className="d3-ink-line d3-ink-line--em">任何淺色都不行</div>
        </div>
      </div>
    </div>
  );
}
