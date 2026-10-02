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
        <div className="d1-day-label">Day 1 · 10/06 (Tue)</div>
        <div className="d1-day-title">抵達！<br />北海道</div>
        <div className="d1-day-sub">IT236 落地，JR 直達札幌<br />Check-in 後登 JR 塔</div>
        <div className="d1-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  const rows = [
    { time: "06:20", name: "台北桃園出發", detail: "台灣虎航 IT236" },
    { time: "11:05", name: "新千歲機場落地", detail: "12:15 出關，步行至國內線航廈 3 樓午餐" },
    { time: "14:19", name: "JR 快速 Airport 號", detail: "約 40 分鐘，自由席 ¥1,230" },
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
        <div className="d1-arrival-title">入住 <span>京急 EX 酒店</span><br />稍作休息</div>
        <div className="d1-arrival-body">
          15:30 Check-in，先放下行李、稍作休息。
          傍晚再出門，行程不趕。
        </div>
      </div>
      <div className="d1-arrival-right">
        <div className="d1-spot-card">
          <div className="d1-spot-name">15:30 Check-in</div>
          <div className="d1-spot-desc">札幌京急 EX 酒店，連住三晚，行李不用天天搬</div>
        </div>
        <div className="d1-spot-card">
          <div className="d1-spot-name">16:30 JR 塔觀景台</div>
          <div className="d1-spot-desc">登上 JR 塔 T38，俯瞰札幌的傍晚</div>
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
          <div className="d1-meal-name">新千歲機場<br />國內線航廈</div>
          <div className="d1-meal-detail">出關後步行前往 3 樓用餐</div>
        </div>
        <div className="d1-meal-card">
          <div className="d1-meal-time">Dinner · 18:00</div>
          <div className="d1-meal-name">根室花丸 或<br />奧芝湯咖哩</div>
          <div className="d1-meal-detail">二選一</div>
        </div>
      </div>
    </div>
  );
}
