import "./ColdOpen.css";

interface Props { step: number; }

const NODES = [
  { name: "高天原", tag: "住宿基地", base: true },
  { name: "中央區", tag: "Day 2" },
  { name: "東館山", tag: "Day 2" },
  { name: "寺小屋", tag: "Day 2" },
  { name: "一之瀨", tag: "Day 3" },
  { name: "燒額山", tag: "Day 3" },
  { name: "奧志賀", tag: "Day 3" },
];

const DAYS = [
  { num: "01", label: "抵達・移動日", desc: "桃園→羽田→長野→高天原" },
  { num: "02", label: "高天原・中央區", desc: "3日券 Day1" },
  { num: "03", label: "一之瀨→燒額山→奧志賀", desc: "3日券 Day2" },
  { num: "04", label: "機動滑雪＋歸途", desc: "3日券 Day3" },
];

export default function ColdOpen({ step }: Props) {
  const base = import.meta.env.BASE_URL;

  return (
    <div className="co-stage">
      {step === 0 && (
        <div className="co-hero">
          <img className="co-hero-bg" src={`${base}images/cover.jpg`} aria-hidden alt="" />
          <img className="co-hero-img" src={`${base}images/cover.jpg`} alt="志賀高原雪景" />
          <div className="co-hero-overlay">
            <div className="co-hero-sub">Nagano · Shiga Kogen · 2027.02.28 — 03.04</div>
            <div className="co-hero-title">志賀高原滑雪</div>
            <div className="co-hero-badges">
              <span className="co-badge">6 人成行</span>
              <span className="co-badge">4 天 3 夜</span>
              <span className="co-badge">3 日券連滑三天</span>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="co-map">
          <div className="co-map-title">十八個雪場，一張票串連</div>
          <div className="co-map-grid">
            {NODES.map(n => (
              <div key={n.name} className={`co-map-node ${n.base ? "co-map-node--base" : ""}`}>
                <div className="co-map-node-name">{n.name}</div>
                <div className="co-map-node-tag">{n.tag}</div>
              </div>
            ))}
          </div>
          <div className="co-map-note">
            高天原是我們的落腳點，往東連中央區、東館山、寺小屋，往西連一之瀨、燒額山、奧志賀——
            日本最大雪場群，走路或纜車就能串完。
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="co-days">
          <div className="co-days-title">四天三夜，行程一次攤開</div>
          <div className="co-days-row">
            {DAYS.map(d => (
              <div key={d.num} className="co-day-card">
                <div className="co-day-num">{d.num}</div>
                <div className="co-day-label">{d.label}</div>
                <div className="co-day-desc">{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="co-budget">
          <div className="co-budget-label">Budget Per Person</div>
          <div className="co-budget-num">NT$32,400</div>
          <div className="co-budget-sub">建議準備 NT$35,000</div>
          <div className="co-budget-note">
            機票 NT$9,000・住宿 NT$8,000・交通約 NT$5,200・雪票約 NT$5,200・保險 NT$1,000・餐費 NT$4,000
          </div>
        </div>
      )}
    </div>
  );
}
