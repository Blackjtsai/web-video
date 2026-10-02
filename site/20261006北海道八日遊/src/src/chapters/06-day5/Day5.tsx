import "./Day5.css";

interface Props { step: number; }
const base = import.meta.env.BASE_URL;

export default function Day5({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  return null;
}

function Step0() {
  return (
    <div className="d5-hero">
      <div className="d5-hero-photo"><img src={`${base}images/day5.jpg`} alt="Day 5 有珠山神仙沼" /></div>
      <div className="d5-hero-info">
        <div className="d5-day-label">Day 5 · 10/10 (Sat)</div>
        <div className="d5-day-title">有珠山纜車<br />神仙沼秋景</div>
        <div className="d5-day-sub">洞爺湖 → 有珠山 → 二世谷<br />高橋牧場 + 神仙沼</div>
        <div className="d5-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="d5-farm">
      <div className="d5-farm-left">
        <div className="d5-farm-kicker">Morning · Mt. Usu</div>
        <div className="d5-farm-title"><span>有珠山</span><br />纜車俯瞰洞爺湖</div>
        <div className="d5-farm-body">
          導航設定「有珠山 昭和新山駐車場」，纜車約每 15 分鐘一班
          （00、15、30、45 分）。下山後到道之驛洞爺湖展望台看湖景。
        </div>
      </div>
      <div className="d5-farm-right">
        <div className="d5-mt-snow" />
        <div className="d5-mt-shape" />
        <div className="d5-grass" />
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="d5-numa">
      <div className="d5-numa-left">
        <div className="d5-numa-kicker">Afternoon · Niseko</div>
        <div className="d5-numa-title">二世谷<span>神仙沼</span></div>
        <div className="d5-numa-badge">沿途：Niseko View Plaza · 高橋牧場</div>
        <div className="d5-numa-body">
          開往二世谷，先在 Niseko View Plaza 道路休息站停一下，
          再到高橋牧場，最後沿木棧道走神仙沼，欣賞秋季濕地與楓紅。
        </div>
      </div>
      <div className="d5-numa-photo">
        <img src={`${base}images/senen-numa.jpg`} alt="神仙沼" />
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="d5-dining">
      <div className="d5-dining-label">Today's Dining</div>
      <div className="d5-dining-title">今天吃什麼？</div>
      <div className="d5-dining-row">
        <div className="d5-meal-card">
          <div className="d5-meal-time">Lunch</div>
          <div className="d5-meal-name">行程中<br />彈性安排</div>
          <div className="d5-meal-detail">依當天進度決定</div>
        </div>
        <div className="d5-meal-card">
          <div className="d5-meal-time">Dinner</div>
          <div className="d5-meal-name">札幌らーめん<br />大心 ニセコ店</div>
          <div className="d5-meal-detail">晚餐後住 Torifito Hotel &amp; Pod Niseko（含早餐）</div>
        </div>
      </div>
    </div>
  );
}
