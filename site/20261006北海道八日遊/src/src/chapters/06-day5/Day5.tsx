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
      <div className="d5-hero-photo"><img src={`${base}images/day5.jpg`} alt="Day 5 牧場神仙沼" /></div>
      <div className="d5-hero-info">
        <div className="d5-day-label">Day 5 · 10/10 (Fri)</div>
        <div className="d5-day-title">如畫秋景<br />孝親好日</div>
        <div className="d5-day-sub">Lake Hill Farm + 二世谷神仙沼<br />全程無障礙，帶長輩如沐畫中</div>
        <div className="d5-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="d5-farm">
      <div className="d5-farm-left">
        <div className="d5-farm-kicker">Morning · Lake Hill Farm</div>
        <div className="d5-farm-title"><span>網美牧場</span><br />冰淇淋 × 羊蹄山</div>
        <div className="d5-farm-body">
          北海道鮮乳製成的超人氣義式冰淇淋，配上寬廣大草皮與羊蹄山頂壯麗景致。
          就算只是吃個冰，也拍出夢幻網美照。
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
        <div className="d5-numa-kicker">Afternoon · Senen Numa</div>
        <div className="d5-numa-title">二世谷<span>神仙沼</span></div>
        <div className="d5-numa-badge">孝親首選：全程無障礙木棧道</div>
        <div className="d5-numa-body">
          全程鋪設極為平整的無障礙木棧道，完全無台階與陡坡。
          沿途秋季濕地落羽松、滿山楓紅，帶長輩散步如沐畫中。
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
          <div className="d5-meal-name">二世谷在地<br />蔬食 / 手作漢堡</div>
          <div className="d5-meal-detail">在地食材，清爽自然風味</div>
        </div>
        <div className="d5-meal-card">
          <div className="d5-meal-time">Dinner</div>
          <div className="d5-meal-name">二世谷<br />道地居酒屋</div>
          <div className="d5-meal-detail">入住 Torifito 飯店後，步行即達</div>
        </div>
      </div>
    </div>
  );
}
