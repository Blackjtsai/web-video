import "./Day4.css";

interface Props {
  step: number;
}

export default function Day4({ step }: Props) {
  if (step === 0) return <Opening />;
  if (step === 1) return <Spots />;
  if (step === 2) return <ReturnCar />;
  if (step === 3) return <Airport />;
  return null;
}

/* ── Step 0: Day 4 開場（最後一天）── */
function Opening() {
  return (
    <div className="d4-opening">
      <div className="d4-open-left">
        <div className="d4-open-daytag">Day 4 · 5月31日（日）</div>
        <div className="d4-open-title">最後一天</div>
        <div className="d4-open-sub">市區慢慢走</div>
      </div>
      <div className="d4-open-right">
        <img
          className="d4-open-img"
          src="/images/day4.jpg"
          alt="Day 4 市區巡禮"
        />
      </div>
    </div>
  );
}

/* ── Step 1: 市區五大景點 ── */
const SPOTS = ["北辰市場", "天后宮", "中央老街", "菊島之星", "澎湖開拓館"];

function Spots() {
  return (
    <div className="d4-spots">
      <div className="d4-spots-label">09:00 · 市區自由行</div>
      <div className="d4-spots-list">
        {SPOTS.map((s, i) => (
          <div
            className="d4-spot-item"
            key={s}
            style={{ animationDelay: `${i * 110 + 200}ms` }}
          >
            <div className="d4-spot-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="d4-spot-name">{s}</div>
          </div>
        ))}
      </div>
      <div className="d4-spots-note">自由逛街，順便帶伴手禮回家</div>
    </div>
  );
}

/* ── Step 2: 歸還車輛 ── */
function ReturnCar() {
  return (
    <div className="d4-car">
      <div className="d4-car-time">13:30</div>
      <div className="d4-car-title">歸還車輛</div>
      <div className="d4-car-card">
        <div className="d4-car-warn">還車前，先去加滿油</div>
        <div className="d4-car-types">
          <span className="d4-car-type">汽車</span>
          <span className="d4-car-sep">＋</span>
          <span className="d4-car-type">機車 × 2</span>
          <span className="d4-car-sep">—</span>
          <span className="d4-car-all">全部加滿</span>
        </div>
      </div>
    </div>
  );
}

/* ── Step 3: 機場報到 & 圓滿賦歸 ── */
function Airport() {
  return (
    <div className="d4-airport">
      <img className="d4-airport-bg" src="/images/day4.jpg" alt="" />
      <div className="d4-airport-overlay" />
      <div className="d4-airport-content">
        <div className="d4-airport-checkin">14:00 開始報到</div>
        <div className="d4-airport-flight-row">
          <div className="d4-airport-node">
            <div className="d4-airport-time">15:40</div>
            <div className="d4-airport-label">馬公起飛</div>
          </div>
          <div className="d4-airport-line" />
          <div className="d4-airport-node">
            <div className="d4-airport-time">16:35</div>
            <div className="d4-airport-label">松山落地</div>
          </div>
        </div>
        <div className="d4-airport-finale">四天三夜，圓滿落幕</div>
      </div>
    </div>
  );
}
