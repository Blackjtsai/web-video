import "./Day1.css";

interface Props {
  step: number;
}

export default function Day1({ step }: Props) {
  if (step === 0) return <Flight />;
  if (step === 1) return <Split />;
  if (step === 2) return <Hotel />;
  if (step === 3) return <AfternoonTea />;
  if (step === 4) return <Dinner />;
  if (step === 5) return <Fireworks />;
  return null;
}

/* ── Step 0: 航班路線 ── */
function Flight() {
  return (
    <div className="d1-flight">
      <div className="d1-day-label">Day 1 · 5月28日（四）</div>
      <div className="d1-departure-word">出發！</div>
      <div className="d1-flight-row">
        <div className="d1-airport">
          <div className="d1-airport-name">松山機場</div>
          <div className="d1-airport-time">12:10</div>
        </div>
        <div className="d1-path">
          <div className="d1-path-line" />
          <div className="d1-path-label">1 小時</div>
        </div>
        <div className="d1-airport">
          <div className="d1-airport-name">馬公機場</div>
          <div className="d1-airport-time">13:10</div>
        </div>
      </div>
      <div className="d1-airline-tag">華信航空</div>
    </div>
  );
}

/* ── Step 1: 機場分流 ── */
function Split() {
  return (
    <div className="d1-split">
      <div className="d1-split-title">到了，分兩組行動</div>
      <div className="d1-split-cols">
        <div className="d1-split-group">
          <div className="d1-group-num">3 人</div>
          <div className="d1-group-name">取車組</div>
          <div className="d1-group-desc">順順租車行</div>
          <div className="d1-group-detail">Tiida + 機車 2 台</div>
        </div>
        <div className="d1-sep-line" />
        <div className="d1-split-group">
          <div className="d1-group-num">其餘</div>
          <div className="d1-group-name">民宿組</div>
          <div className="d1-group-desc">接機專車</div>
          <div className="d1-group-detail">直接前往民宿<br />放置行李</div>
        </div>
      </div>
      <div className="d1-luggage-note">
        <span className="d1-luggage-badge">大件行李</span>
        全部跟民宿組走 — 取車組免搬行李
      </div>
    </div>
  );
}

/* ── Step 2: 住宿 ── */
function Hotel() {
  return (
    <div className="d1-hotel">
      <div className="d1-hotel-eyebrow">今晚住這</div>
      <div className="d1-hotel-name">夏天正涼民宿</div>
      <div className="d1-hotel-rule" />
      <div className="d1-hotel-badges">
        <span className="d1-hotel-badge">3 晚</span>
        <span className="d1-hotel-badge">每日含早餐</span>
      </div>
    </div>
  );
}

/* ── Step 3: 下午茶三選一 ── */
const TEA_OPTIONS = [
  { name: "楊媽媽韭菜盒", addr: "民權路 89-1 號" },
  { name: "蔬脆蛋餅",     addr: "光明路 45 號" },
  { name: "老家餡餅",     addr: "民權路 72 號" },
];

function AfternoonTea() {
  return (
    <div className="d1-tea">
      <div className="d1-tea-title">下午茶 · 三選一</div>
      <div className="d1-tea-time">約 15:00</div>
      <div className="d1-tea-cards">
        {TEA_OPTIONS.map((opt) => (
          <div className="d1-tea-card" key={opt.name}>
            <div className="d1-tea-card-name">{opt.name}</div>
            <div className="d1-tea-card-addr">{opt.addr}</div>
          </div>
        ))}
      </div>
      <div className="d1-tea-note">當天視距離 · 順路決定</div>
    </div>
  );
}

/* ── Step 4: 晚餐 ── */
function Dinner() {
  return (
    <div className="d1-dinner">
      <div className="d1-dinner-time">17:30</div>
      <div className="d1-dinner-name">阿東餐廳</div>
      <div className="d1-dinner-sub">澎湖在地海鮮桌菜</div>
      <div className="d1-dinner-reserved">已預訂</div>
    </div>
  );
}

/* ── Step 5: 煙火秀 ── */
function Fireworks() {
  return (
    <div className="d1-fireworks">
      <img
        className="d1-fw-bg"
        src={`${import.meta.env.BASE_URL}images/day1.jpg`}
        alt="Day 1 澎湖花火節"
      />
      <div className="d1-fw-overlay" />
      <div className="d1-fw-content">
        <div className="d1-fw-time">21:00</div>
        <div className="d1-fw-title">觀音亭煙火秀</div>
        <div className="d1-fw-sub">花火節 · 重頭戲</div>
        <div className="d1-fw-tip">提早去找好位置</div>
      </div>
    </div>
  );
}
