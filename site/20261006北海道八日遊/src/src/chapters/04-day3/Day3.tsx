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
        <img src={`${base}images/day3.jpg`} alt="Day 3 札幌經典景點" />
      </div>
      <div className="d3-hero-info">
        <div className="d3-day-label">Day 3 · 10/08 (Thu)</div>
        <div className="d3-day-title">札幌經典<br />景點日</div>
        <div className="d3-day-special">地鐵東西線為主</div>
        <div className="d3-day-sub">北海道神宮 · 場外市場<br />白色戀人公園 · 發寒 AEON</div>
        <div className="d3-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="d3-market">
      <div className="d3-market-kicker">Morning · Jingu &amp; Market</div>
      <div className="d3-market-title"><span>北海道神宮</span> → 場外市場</div>
      <div className="d3-market-body">
        圓山公園站（T06）步行約 14 分鐘到北海道神宮。
        接著到二十四軒站（T04），步行約 10 分鐘就是場外市場；
        也可以改搭 JR 在桑園站下車，西剪票口步行 8–12 分鐘。
      </div>
      <div className="d3-seafood-row">
        <div className="d3-sf-chip">圓山公園站 T06</div>
        <div className="d3-sf-chip">北海道神宮</div>
        <div className="d3-sf-chip">二十四軒站 T04</div>
        <div className="d3-sf-chip alt">場外市場</div>
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="d3-onsen">
      <div className="d3-onsen-left">
        <div className="d3-onsen-kicker">Afternoon · Koibito Park</div>
        <div className="d3-onsen-title"><span>白色戀人公園</span><br />+ 發寒 AEON Mall</div>
        <div className="d3-onsen-body">
          下午在宮之澤站（T01）下車，到白色戀人公園。
          再搭一站到發寒南站（T02），逛發寒 AEON Mall。
        </div>
      </div>
      <div className="d3-onsen-photo">
        <img src={`${base}images/koibito-park.jpg`} alt="白色戀人公園" />
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
          <div className="d3-meal-name">場外市場<br />或 AEON Mall</div>
          <div className="d3-meal-detail">看當天走到哪裡再決定</div>
        </div>
        <div className="d3-meal-card">
          <div className="d3-meal-time">Dinner</div>
          <div className="d3-meal-name">札幌車站<br />附近</div>
          <div className="d3-meal-detail">回到車站周邊用餐</div>
        </div>
      </div>
    </div>
  );
}
