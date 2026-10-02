import "./Day4.css";

interface Props { step: number; }
const base = import.meta.env.BASE_URL;

export default function Day4({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  if (step === 4) return <Step4 />;
  return null;
}

function Step0() {
  return (
    <div className="d4-hero">
      <div className="d4-hero-photo"><img src={`${base}images/day4.jpg`} alt="Day 4 自駕洞爺湖" /></div>
      <div className="d4-hero-info">
        <div className="d4-day-label">Day 4 · 10/09 (Fri)</div>
        <div className="d4-day-title">自駕出發！<br />定山溪到洞爺湖</div>
        <div className="d4-day-sub">WNR 取車 → 定山溪 → 支笏湖 → 洞爺湖</div>
        <div className="d4-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="d4-car">
      <div className="d4-car-label">Morning · Car Rental</div>
      <div className="d4-car-title">自駕<span>正式開始</span>！</div>
      <div className="d4-car-visual">
        <div className="d4-car-body">
          <div className="d4-car-top" />
        </div>
        <div className="d4-car-wheel-row">
          <div className="d4-car-wheel" />
          <div className="d4-car-wheel" />
        </div>
      </div>
      <div className="d4-car-info">08:30 前往 WNR 取車 · 確認取車資料、駕照與日文譯本、導航設定</div>
    </div>
  );
}

function Step2() {
  return (
    <div className="d4-crab">
      <div className="d4-crab-kicker">Morning · Jozankei</div>
      <div className="d4-crab-title"><span>定山溪</span>散步</div>
      <div className="d4-crab-body">
        二見公園、二見吊橋、河童淵，車停定山溪公共停車場（¥500）。
        午餐在 Konno 拉麵店，或紅葉亭的蕎麥麵、天丼；
        再看一眼定山湖大壩（豐平峽水庫）。
      </div>
      <div className="d4-crab-chips">
        <div className="d4-crab-chip">二見吊橋</div>
        <div className="d4-crab-chip">河童淵</div>
        <div className="d4-crab-chip">定山湖大壩</div>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="d4-pass">
      <div className="d4-pass-left">
        <div className="d4-pass-kicker">Afternoon · Lake Shikotsu</div>
        <div className="d4-pass-title">支笏湖甜點<br />洞爺湖<span>展望台</span></div>
        <div className="d4-pass-body">
          到支笏湖的 Patissier Labo 甜品店吃甜點休息。
          傍晚經過道之驛洞爺湖展望台，先看看洞爺湖。
        </div>
      </div>
      <div className="d4-pass-right">
        <div className="d4-mountain" />
        <div className="d4-mountain-snow" style={{ marginTop: -8 }} />
        <div className="d4-mountain-label">洞爺湖</div>
        <div className="d4-mountain-sub">道之驛 · 展望台</div>
      </div>
    </div>
  );
}

function Step4() {
  return (
    <div className="d4-toya">
      <div className="d4-toya-left">
        <div className="d4-toya-kicker">Evening · Toya Lake</div>
        <div className="d4-toya-title">洞爺湖萬世閣<br /><span>溫泉自助晚餐</span></div>
        <div className="d4-toya-row">
          <div className="d4-toya-card">
            <div className="d4-toya-card-name">飯店自助晚餐</div>
            <div className="d4-toya-card-detail">含早晚餐，晚餐吃飯店自助餐</div>
          </div>
          <div className="d4-toya-card">
            <div className="d4-toya-card-name">洞爺湖溫泉</div>
            <div className="d4-toya-card-detail">吃完泡湯休息，不用再移動</div>
          </div>
        </div>
      </div>
      <div className="d4-toya-photo">
        <img src={`${base}images/toya-lake.jpg`} alt="洞爺湖" />
      </div>
    </div>
  );
}
