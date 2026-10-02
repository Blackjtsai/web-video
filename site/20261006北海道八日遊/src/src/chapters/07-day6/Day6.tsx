import "./Day6.css";

interface Props { step: number; }
const base = import.meta.env.BASE_URL;

export default function Day6({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  return null;
}

function Step0() {
  return (
    <div className="d6-hero">
      <div className="d6-hero-photo"><img src={`${base}images/day6.jpg`} alt="Day 6 積丹 Glow" /></div>
      <div className="d6-hero-info">
        <div className="d6-day-label">Day 6 · 10/11 (Sun)</div>
        <div className="d6-day-title">積丹藍<br />× 小樽 Glow</div>
        <div className="d6-day-sub">二世谷 → 積丹 → 余市 → 小樽<br />入住 Glow 包棟別墅</div>
        <div className="d6-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="d6-shakotan">
      <div className="d6-shakotan-kicker">Morning Drive · Shakotan &amp; Yoichi</div>
      <div className="d6-shakotan-title"><span>積丹藍</span>海岸 · 余市</div>
      <div className="d6-shakotan-body">
        沿積丹半島海岸線自駕，先到島武意海岸與神威岬看海。
        接著到余市，參觀余市威士忌蒸餾所，再到柿崎商店，和對面的余市町散策。
      </div>
      <div className="d6-sea">
        <img src={`${base}images/shakotan.jpg`} alt="積丹" className="d6-sea-photo" />
        <div className="d6-sea-label">積丹藍</div>
      </div>
    </div>
  );
}

function Step2() {
  const items = ["北海道鮮乳", "手作麵包", "麝香葡萄", "頂級和牛"];
  return (
    <div className="d6-glow">
      <div className="d6-glow-left">
        <div className="d6-glow-kicker">Afternoon · Otaru</div>
        <div className="d6-glow-title"><span>小樽天狗山</span><br />入住 Glow 別墅</div>
        <div className="d6-glow-body">
          下午到小樽天狗山觀景台，再入住 Glow 包棟別墅。
          Glow 不含餐，晚餐在小樽市區彈性安排。
        </div>
        <div className="d6-glow-shopping">
          {items.map(item => <span key={item} className="d6-shop-tag">{item}</span>)}
        </div>
      </div>
      <div className="d6-glow-right">
        <div className="d6-house-roof" />
        <div className="d6-house-body">
          <div className="d6-house-window" />
          <div className="d6-house-door" />
        </div>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="d6-bbq">
      <div className="d6-bbq-label">Tonight · Flexible Dinner</div>
      <div className="d6-bbq-title">晚餐<span>彈性安排</span><br />小樽市區自由選</div>
      <div className="d6-bbq-body">
        午餐與晚餐都在行程中彈性安排，
        可依當天進度，選喜歡的在地美食。入住 Glow 包棟別墅（不含餐）。
        別墅不含早餐，記得連隔天的早餐一起買。
      </div>
    </div>
  );
}
