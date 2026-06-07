import "./Day3.css";

interface Props { step: number; }
const base = import.meta.env.BASE_URL;

export default function Day3({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  return null;
}

function Step0() {
  return (
    <div className="d3-hero">
      <div className="d3-hero-photo">
        <img src={`${base}images/day3.jpg`} alt="Day 3 二条市場 定山溪" />
      </div>
      <div className="d3-hero-info">
        <div className="d3-day-label">Day 3 · 10/08 (Wed)</div>
        <div className="d3-day-title">海鮮市場<br />紅葉泡湯</div>
        <div className="d3-day-special">美玲の指定行程</div>
        <div className="d3-day-sub">二条市場 → 定山溪溫泉<br />帝王蟹 + 溪谷楓紅</div>
        <div className="d3-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="d3-market">
      <div className="d3-market-kicker">08:30 · Nijo Market</div>
      <div className="d3-market-title"><span>二条市場</span>——美玲指定！</div>
      <div className="d3-market-body">
        早上八點半開市。觀賞現撈帝王蟹、新鮮海膽，
        現場享用奢華海鮮丼當早午餐。
        長輩不吃生食？市場有現烤熟魚定食可選。
      </div>
      <div className="d3-seafood-row">
        <div className="d3-sf-chip">帝王蟹</div>
        <div className="d3-sf-chip">海膽</div>
        <div className="d3-sf-chip">海鮮丼</div>
        <div className="d3-sf-chip alt">烤魚定食（長輩選項）</div>
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="d3-onsen">
      <div className="d3-onsen-left">
        <div className="d3-onsen-kicker">Afternoon · Jozankei Onsen</div>
        <div className="d3-onsen-title"><span>定山溪溫泉</span><br />溪谷紅葉日歸</div>
        <div className="d3-onsen-body">
          搭 Kappa Liner 巴士約 1 小時直達。
          10 月正是紅葉巔峰期，大片落地窗外即是滿山溪谷楓紅。
          長輩不用走路，直接進溫泉旅館日歸泡湯休息，尊榮慢活。
        </div>
      </div>
      <div className="d3-onsen-photo">
        <img src={`${base}images/jozankei.jpg`} alt="定山溪溫泉" />
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="d3-dining">
      <div className="d3-dining-label">Today's Dining</div>
      <div className="d3-dining-title">今天吃什麼？</div>
      <div className="d3-dining-row">
        <div className="d3-meal-card">
          <div className="d3-meal-time">Lunch</div>
          <div className="d3-meal-name">二条市場<br />海鮮丼大餐</div>
          <div className="d3-meal-detail">帝王蟹 + 海膽，奢華早午餐</div>
        </div>
        <div className="d3-meal-card">
          <div className="d3-meal-time">Dinner</div>
          <div className="d3-meal-name">回札幌<br />極品拉麵</div>
          <div className="d3-meal-detail">北海道拉麵，暖胃完美收尾</div>
        </div>
      </div>
    </div>
  );
}
