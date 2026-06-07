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
        <img src={`${base}images/day2.jpg`} alt="Day 2 白色戀人 T38" />
      </div>
      <div className="d2-hero-info">
        <div className="d2-day-label">Day 2 · 10/07 (Tue)</div>
        <div className="d2-day-title">室內定點<br />免走路日</div>
        <div className="d2-day-sub">白色戀人公園 + JR 塔 T38<br />坐著看遍札幌最美的風景</div>
        <div className="d2-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="d2-koibito">
      <div className="d2-koibito-left">
        <div className="d2-section-kicker">Morning · Shiroi Koibito Park</div>
        <div className="d2-section-title"><span>白色戀人公園</span>——長輩友善</div>
        <div className="d2-two-col">
          <div className="d2-col-card">
            <div className="d2-col-tag">長輩</div>
            <div className="d2-col-name">歐風室內咖啡廳</div>
            <div className="d2-col-body">
              完善無障礙電梯，不用走遠。坐在室內喝咖啡、吃甜點，
              透過落地窗俯瞰紅葉家庭花園，舒適又愜意。
            </div>
          </div>
          <div className="d2-col-card">
            <div className="d2-col-tag">年輕人</div>
            <div className="d2-col-name">戶外拍照打卡</div>
            <div className="d2-col-body">
              秋季紅葉花園正值巔峰，英式玫瑰拱門、歐式建築外牆，
              每個角落都是出片背景。
            </div>
          </div>
        </div>
      </div>
      <div className="d2-koibito-photo">
        <img src={`${base}images/koibito-park.jpg`} alt="白色戀人公園" />
      </div>
    </div>
  );
}

function Step2() {
  const segs = [
    { w: 28, h: 60, main: false },
    { w: 36, h: 100, main: false },
    { w: 24, h: 80, main: false },
    { w: 48, h: 200, main: true, label: "T38" },
    { w: 32, h: 120, main: false },
    { w: 22, h: 70, main: false },
    { w: 30, h: 90, main: false },
  ];
  return (
    <div className="d2-t38">
      <div className="d2-t38-left">
        <div className="d2-t38-kicker">Afternoon · JR Tower T38</div>
        <div className="d2-t38-title">直達 <span>38 樓</span><br />坐著看夕陽夜景</div>
        <div className="d2-t38-body">
          傍晚搭直達電梯到 JR 塔展望室 T38，
          舒服坐著一覽札幌市區滿山紅葉與絕美夕陽夜景，
          完全免受戶外吹風之苦。
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
          <div className="d2-meal-name">札幌經典<br />湯咖哩</div>
          <div className="d2-meal-detail">北海道必吃，湯底濃郁暖胃</div>
        </div>
        <div className="d2-meal-card">
          <div className="d2-meal-time">Dinner</div>
          <div className="d2-meal-name">百貨美食<br />天婦羅 / 壽司</div>
          <div className="d2-meal-detail">車站共構直達，長輩省力</div>
        </div>
      </div>
    </div>
  );
}
