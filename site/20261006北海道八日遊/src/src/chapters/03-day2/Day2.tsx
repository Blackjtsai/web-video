import "./Day2.css";

interface Props { step: number; }
const base = import.meta.env.BASE_URL;

export default function Day2({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  return null;
}

function Step0() {
  return (
    <div className="d2-hero">
      <div className="d2-hero-photo">
        <img src={`${base}images/day2.jpg`} alt="Day 2 札幌市區" />
      </div>
      <div className="d2-hero-info">
        <div className="d2-day-label">Day 2 · 10/07 (Wed)</div>
        <div className="d2-day-title">札幌市區<br />慢慢逛</div>
        <div className="d2-day-sub">二條市場 · 電視塔 · 狸小路<br />傍晚上藻岩山看夜景</div>
        <div className="d2-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="d2-koibito">
      <div className="d2-koibito-left">
        <div className="d2-section-kicker">Daytime · Sapporo City</div>
        <div className="d2-section-title"><span>市區步行</span>慢慢逛</div>
        <div className="d2-two-col">
          <div className="d2-col-card">
            <div className="d2-col-tag">上午</div>
            <div className="d2-col-name">二條市場 → 電視塔</div>
            <div className="d2-col-body">
              先到二條市場，接著走到札幌電視塔與大通公園，
              沿著公園散步，都在步行範圍內。
            </div>
          </div>
          <div className="d2-col-card">
            <div className="d2-col-tag">午後</div>
            <div className="d2-col-name">狸小路商店街</div>
            <div className="d2-col-body">
              午餐在 Dekitateya 時計台店，
              之後逛狸小路商店街，想休息就隨時回飯店。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2() {
  const segs = [
    { w: 28, h: 60, main: false },
    { w: 36, h: 100, main: false },
    { w: 24, h: 80, main: false },
    { w: 48, h: 200, main: true, label: "藻岩山" },
    { w: 32, h: 120, main: false },
    { w: 22, h: 70, main: false },
    { w: 30, h: 90, main: false },
  ];
  return (
    <div className="d2-t38">
      <div className="d2-t38-left">
        <div className="d2-t38-kicker">Evening · Mt. Moiwa</div>
        <div className="d2-t38-title">藻岩山<br /><span>纜車看夜景</span></div>
        <div className="d2-t38-body">
          搭路面電車到「纜車入口站」，步行約 7–10 分鐘；
          也可以搭免費接駁車到藻岩山麓站買票上山。
          有興趣的人再上山，不上山的人在市區休息。
        </div>
      </div>
      <div className="d2-t38-right">
        <div className="d2-building">
          {segs.map((s, i) => (
            <div
              key={i}
              className={`d2-bld-seg${s.main ? " is-main" : ""}`}
              style={{ width: s.w, height: s.h }}
            >
              {s.label && <div className="d2-bld-label">{s.label}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="d2-dining">
      <div className="d2-dining-label">Today's Dining</div>
      <div className="d2-dining-title">今天吃什麼？</div>
      <div className="d2-dining-row">
        <div className="d2-meal-card">
          <div className="d2-meal-time">Lunch</div>
          <div className="d2-meal-name">Dekitateya<br />時計台店</div>
          <div className="d2-meal-detail">逛完二條市場、電視塔後用餐</div>
        </div>
        <div className="d2-meal-card">
          <div className="d2-meal-time">Dinner · 17:30</div>
          <div className="d2-meal-name">蟹座</div>
          <div className="d2-meal-detail">建議提早訂位</div>
        </div>
      </div>
    </div>
  );
}
