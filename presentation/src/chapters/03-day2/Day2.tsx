import "./Day2.css";

interface Props {
  step: number;
}

export default function Day2({ step }: Props) {
  if (step === 0) return <Opening />;
  if (step === 1) return <Timeline />;
  if (step === 2) return <Birding />;
  if (step === 3) return <Choice />;
  if (step === 4) return <Island />;
  if (step === 5) return <Aquarium />;
  return null;
}

/* ── Step 0: Day 2 開場（左文右圖）── */
function Opening() {
  return (
    <div className="d2-opening">
      <div className="d2-open-left">
        <div className="d2-open-daytag">Day 2 · 5月29日（五）</div>
        <div className="d2-open-title">
          整趟行程<br />
          <em>最豐富</em>的一天
        </div>
        <div className="d2-open-badge">
          <span className="d2-open-badge-time">07:40</span>
          <span className="d2-open-badge-label">出發，岐頭遊客中心集合</span>
        </div>
      </div>
      <div className="d2-open-right">
        <img
          className="d2-open-img"
          src="/images/day2.jpg"
          alt="Day 2 員貝島嶼遊"
        />
      </div>
    </div>
  );
}

/* ── Step 1: 員貝六小時時間軸 ── */
function Timeline() {
  return (
    <div className="d2-timeline">
      <div className="d2-tl-title">員貝耍廢一日遊</div>
      <div className="d2-tl-row">
        <div className="d2-tl-node">
          <div className="d2-tl-time">08:30</div>
          <div className="d2-tl-time-label">開船</div>
        </div>
        <div className="d2-tl-mid">
          <div className="d2-tl-bar-track">
            <div className="d2-tl-bar-fill" />
          </div>
          <div className="d2-tl-hours">6<span className="d2-tl-hours-unit"> 小時</span></div>
        </div>
        <div className="d2-tl-node">
          <div className="d2-tl-time">14:30</div>
          <div className="d2-tl-time-label">回程</div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: 賞燕鷗（季節限定）── */
function Birding() {
  return (
    <div className="d2-birding">
      <div className="d2-bird-stamp">
        <div className="d2-bird-tag">Season Exclusive · 季節限定</div>
        <div className="d2-bird-main">賞燕鷗</div>
        <div className="d2-bird-sub">搭船出海，邂逅夏日候鳥</div>
        <div className="d2-bird-note">只有現在才看得到</div>
      </div>
    </div>
  );
}

/* ── Step 3: 二選一體驗 ── */
function Choice() {
  return (
    <div className="d2-choice">
      <div className="d2-choice-title">二選一體驗</div>
      <div className="d2-choice-cards">
        <div className="d2-choice-card">
          <div className="d2-choice-icon-text">潮</div>
          <div className="d2-choice-name">潮間帶踏浪</div>
          <div className="d2-choice-desc">赤腳走入潮間帶<br />尋寶探索海洋生態</div>
        </div>
        <div className="d2-choice-or">or</div>
        <div className="d2-choice-card">
          <div className="d2-choice-icon-text">釣</div>
          <div className="d2-choice-name">傳統手捲圈釣魚</div>
          <div className="d2-choice-desc">澎湖傳統釣法體驗<br />親手垂釣感受漁趣</div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 4: 島上午餐 & 小管體驗 ── */
function Island() {
  return (
    <div className="d2-island">
      <div className="d2-island-eyebrow">登上員貝島之後⋯</div>
      <div className="d2-island-items">
        <div className="d2-island-item">
          <div className="d2-island-num">01</div>
          <div className="d2-island-text">
            <div className="d2-island-name">豪華海島午餐</div>
            <div className="d2-island-sub">島上現做，邊吃邊看海</div>
          </div>
        </div>
        <div className="d2-island-item">
          <div className="d2-island-num">02</div>
          <div className="d2-island-text">
            <div className="d2-island-name">小管一日干體驗</div>
            <div className="d2-island-sub">每人一隻小管，自己動手做食魚教育</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 5: 澎湖水族館三時段 ── */
const SLOTS = [
  { time: "14:00", pool: "礁岩池（1F）", event: "魚魚啄菜球時間" },
  { time: "15:00", pool: "大洋池（1F）", event: "精彩餵食秀" },
  { time: "15:30", pool: "觸摸池（2F）", event: "生態親密接觸體驗" },
];

function Aquarium() {
  return (
    <div className="d2-aquarium">
      <div className="d2-aquarium-header">
        <div className="d2-aquarium-title">澎湖水族館</div>
        <div className="d2-aquarium-badge">室內 · 帶小孩最適合</div>
      </div>
      <div className="d2-aquarium-note">14:40 抵達 — 錯開烈日高溫，館內舒適涼快</div>
      <div className="d2-aquarium-slots">
        {SLOTS.map((s) => (
          <div className="d2-slot" key={s.time}>
            <div className="d2-slot-time">{s.time}</div>
            <div className="d2-slot-body">
              <div className="d2-slot-pool">{s.pool}</div>
              <div className="d2-slot-event">{s.event}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
