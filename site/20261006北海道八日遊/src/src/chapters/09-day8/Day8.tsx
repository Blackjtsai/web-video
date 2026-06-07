import "./Day8.css";

interface Props { step: number; }
const base = import.meta.env.BASE_URL;

export default function Day8({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  return null;
}

function Step0() {
  return (
    <div className="d8-hero">
      <div className="d8-hero-photo"><img src={`${base}images/day8.jpg`} alt="Day 8 新千歲機場" /></div>
      <div className="d8-hero-info">
        <div className="d8-day-label">Day 8 · 10/13 (Mon)</div>
        <div className="d8-day-title">快樂賦歸<br />再見北海道</div>
        <div className="d8-day-sub">機場大補貨 → IT 235 → 台北<br />帶著滿滿回憶圓滿回家</div>
        <div className="d8-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  const items = ["白色戀人", "六花亭奶油葡萄乾", "薯條三兄弟", "北海道起司蛋糕"];
  return (
    <div className="d8-shopping">
      <div className="d8-shopping-kicker">Chitose Airport · Last Shopping</div>
      <div className="d8-shopping-title">新千歲機場<span>最後大補貨</span></div>
      <div className="d8-shopping-body">
        辦完登機手續後，抓緊最後機會掃貨。
        國際線出發廳有齊全的北海道名產，一次全部買齊。
      </div>
      <div className="d8-souvenirs">
        {items.map(i => (
          <div key={i} className="d8-sv-card">
            <div className="d8-sv-name">{i}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="d8-depart">
      <div className="d8-depart-label">12:05 · IT 235 · Departure</div>
      <div className="d8-depart-title">北海道，<br /><span>謝謝你</span>。</div>
      <div className="d8-plane">
        <div className="d8-plane-body" />
        <div className="d8-plane-wing" />
        <div className="d8-plane-tail" />
      </div>
      <div className="d8-flight-info">IT 235 · 新千歲 12:05 → 台北 15:20</div>
      <div className="d8-depart-sub">帶著滿行李箱的回憶，圓滿賦歸。</div>
    </div>
  );
}
