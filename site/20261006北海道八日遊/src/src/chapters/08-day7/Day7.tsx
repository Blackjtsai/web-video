import "./Day7.css";

interface Props { step: number; }
const base = import.meta.env.BASE_URL;

export default function Day7({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  return null;
}

function Step0() {
  return (
    <div className="d7-hero">
      <div className="d7-hero-photo"><img src={`${base}images/day7.jpg`} alt="Day 7 小樽" /></div>
      <div className="d7-hero-info">
        <div className="d7-day-label">Day 7 · 10/12 (Mon)</div>
        <div className="d7-day-title">小樽慢遊<br />返回札幌</div>
        <div className="d7-day-sub">三角市場 → 堺町通 → 小樽運河<br />傍晚回札幌住宿</div>
        <div className="d7-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  const items = ["三角市場", "堺町通商店街", "伴手禮"];
  return (
    <div className="d7-shop">
      <div className="d7-shop-left">
        <div className="d7-shop-kicker">Morning · Sankaku Market</div>
        <div className="d7-shop-title"><span>三角市場</span><br />× 堺町通</div>
        <div className="d7-shop-body">
          早餐自理。先到三角市場，再沿著堺町通商店街慢慢走，
          順便買點伴手禮。
        </div>
        <div className="d7-shop-tags">
          {items.map(i => <span key={i} className="d7-shop-tag">{i}</span>)}
        </div>
      </div>
      <div className="d7-shop-right">
        <div className="d7-box-lid" />
        <div className="d7-box-body" style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--accent)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 3, background: "var(--accent)", transform: "translateX(-50%)" }} />
        </div>
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="d7-canal">
      <div className="d7-canal-kicker">Noon · Otaru Canal</div>
      <div className="d7-canal-title"><span>小樽運河</span>散步</div>
      <div className="d7-canal-badge">紅磚倉庫與水岸風景</div>
      <div className="d7-canal-body">
        最後走到小樽運河，沿著水岸慢慢逛，
        欣賞紅磚倉庫群與秋天的景色。
      </div>
      <div className="d7-canal-photo">
        <img src={`${base}images/otaru-canal.jpg`} alt="小樽運河" />
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="d7-wagyu">
      <div className="d7-wagyu-label">Evening · Back to Sapporo</div>
      <div className="d7-wagyu-title">返回札幌<br />住<span>京急 EX</span></div>
      <div className="d7-wagyu-no-lamb">全員不吃羊肉！選餐廳前確認菜單</div>
      <div className="d7-wagyu-body">
        傍晚回札幌，還車後入住札幌京急 EX 酒店（含早餐）。
        午餐與晚餐都彈性安排。
      </div>
      <div className="d7-wagyu-places">
        <div className="d7-wagyu-place">午餐 · 彈性安排</div>
        <div className="d7-wagyu-place">晚餐 · 彈性安排</div>
      </div>
    </div>
  );
}
