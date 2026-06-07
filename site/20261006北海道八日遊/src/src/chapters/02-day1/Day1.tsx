import "./Day1.css";

interface Props { step: number; }
const base = import.meta.env.BASE_URL;

export default function Day1({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  return null;
}

function Step0() {
  return (
    <div className="d1-hero">
      <div className="d1-hero-photo">
        <img src={`${base}images/day1.jpg`} alt="Day 1 北海道" />
      </div>
      <div className="d1-hero-info">
        <div className="d1-day-label">Day 1 · 10/06 (Mon)</div>
        <div className="d1-day-title">抵達！<br />北海道</div>
        <div className="d1-day-sub">IT 234 落地，JR 直達札幌<br />放行李，今天先輕鬆</div>
        <div className="d1-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  const rows = [
    { time: "06:20", name: "台北桃園出發", detail: "台灣虎航 IT 234" },
    { time: "11:05", name: "新千歲機場落地", detail: "通關約 12:30" },
    { time: "13:00", name: "JR 快速 Airport 號", detail: "約 40 分鐘，直達札幌站，無需換車" },
  ];
  return (
    <div className="d1-transit">
      <div className="d1-transit-title">今天<span>怎麼到</span>的？</div>
      <div className="d1-timeline">
        {rows.map((r, i) => (
          <div className="d1-tl-row" key={r.time}>
            <div className="d1-tl-dot-col">
              <div className="d1-tl-dot" />
              {i < rows.length - 1 && <div className="d1-tl-line" />}
            </div>
            <div className="d1-tl-content">
              <div className="d1-tl-time">{r.time}</div>
              <div className="d1-tl-name">{r.name}</div>
              <div className="d1-tl-detail">{r.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="d1-arrival">
      <div className="d1-arrival-left">
        <div className="d1-arrival-label">Afternoon · Hotel</div>
        <div className="d1-arrival-title">入住 <span>Hotel Emion</span><br />下午輕鬆慢活</div>
        <div className="d1-arrival-body">
          飯店鄰近札幌車站，行李拖過去就到。
          下午不趕行程，搭乘紅眼班機的大家先好好休息。
        </div>
      </div>
      <div className="d1-arrival-right">
        <div className="d1-spot-card">
          <div className="d1-spot-name">札幌車站地下街</div>
          <div className="d1-spot-desc">北海道物產、生活雜貨、咖啡廳，不出門也逛得開心</div>
        </div>
        <div className="d1-spot-card">
          <div className="d1-spot-name">大通公園</div>
          <div className="d1-spot-desc">秋季楓葉步道，散步喝咖啡，長輩最愛的下午時光</div>
        </div>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="d1-dining">
      <div className="d1-dining-label">Today's Dining</div>
      <div className="d1-dining-title">今天吃什麼？</div>
      <div className="d1-dining-row">
        <div className="d1-meal-card">
          <div className="d1-meal-time">Lunch</div>
          <div className="d1-meal-name">車站美食街<br />日式定食</div>
          <div className="d1-meal-detail">初抵北海道，先吃一頓地道和食</div>
        </div>
        <div className="d1-meal-card">
          <div className="d1-meal-time">Dinner</div>
          <div className="d1-meal-name">飯店周邊<br />精緻日式料理</div>
          <div className="d1-meal-detail">輕鬆步行可達，不用遠征</div>
        </div>
      </div>
    </div>
  );
}
