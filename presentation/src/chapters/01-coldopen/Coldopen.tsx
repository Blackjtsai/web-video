import "./Coldopen.css";

interface Props {
  step: number;
}

export default function Coldopen({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  return null;
}

/* ── Step 0: 九個人一起 ── */
function Step0() {
  return (
    <div className="co-hero">
      <img
        className="co-hero-img"
        src="/images/cover.jpg"
        alt="澎湖家族旅遊封面"
      />
      <div className="co-hero-gradient" />
      <div className="co-hero-text">
        <div className="co-hero-sub">帶著一歲半的小寶寶</div>
        <div className="co-hero-title">澎湖家族行</div>
        <div className="co-hero-accent-bar" />
        <div className="co-hero-badge">
          <span className="co-badge-pill">九人成行</span>
          <span className="co-badge-pill">四天三夜</span>
        </div>
      </div>
    </div>
  );
}

/* ── Step 1: 我們真的敢這樣玩 ── */
function Step1() {
  return (
    <div className="co-statement">
      <div className="co-statement-label">2026 · 五月</div>
      <div className="co-statement-text">
        我們真的
        <br />
        <em>敢這樣玩。</em>
      </div>
      <div className="co-statement-underline" />
    </div>
  );
}

/* ── Step 2: 旅程基本資訊 ── */
function Step2() {
  return (
    <div className="co-stats">
      <div className="co-stats-hero">
        <div className="co-stats-label">全家五月底出發</div>
        <div className="co-stats-title">目的地：澎湖</div>
      </div>
      <div className="co-stats-grid">
        <div className="co-stat-card">
          <div className="co-stat-num">4</div>
          <div className="co-stat-unit">天三夜</div>
        </div>
        <div className="co-stat-card">
          <div className="co-stat-num">9</div>
          <div className="co-stat-unit">人同行</div>
        </div>
        <div className="co-stat-card">
          <div className="co-stat-num">1hr</div>
          <div className="co-stat-unit">松山→馬公</div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 3: 行程預告 ── */
function Step3() {
  const days = [
    { tag: "Day 1", desc: "出發 · 花火慶典" },
    { tag: "Day 2", desc: "員貝島嶼遊 & 水族館" },
    { tag: "Day 3", desc: "西嶼探秘 & 夜釣小管" },
    { tag: "Day 4", desc: "市區巡禮 · 圓滿賦歸" },
  ];
  return (
    <div className="co-preview">
      <div className="co-preview-left">
        <div className="co-preview-question">
          這趟<span>怎麼玩</span>？
        </div>
        <div className="co-preview-days">
          {days.map((d) => (
            <div className="co-day-row" key={d.tag}>
              <span className="co-day-tag">{d.tag}</span>
              <span className="co-day-desc">{d.desc}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="co-preview-right">
        <img
          className="co-preview-img"
          src="/images/cover.jpg"
          alt="全家澎湖旅遊插圖"
        />
      </div>
    </div>
  );
}
