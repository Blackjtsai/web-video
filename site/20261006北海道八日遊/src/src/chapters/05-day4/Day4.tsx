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
        <div className="d4-day-label">Day 4 · 10/09 (Thu)</div>
        <div className="d4-day-title">自駕出發！<br />螃蟹 × 花火</div>
        <div className="d4-day-sub">取車 → 螃蟹大餐 → 羊蹄山 → 洞爺湖花火</div>
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
      <div className="d4-car-info">Toyota Hiace 10 人座 · 六人 + 行李全塞得下 · 10/09–12 四天</div>
    </div>
  );
}

function Step2() {
  return (
    <div className="d4-crab">
      <div className="d4-crab-kicker">11:30 · Crab Kaiseki</div>
      <div className="d4-crab-title">奢華<span>螃蟹大宴</span></div>
      <div className="d4-crab-body">
        精心安排前往札幌螃蟹名店——螃蟹家 或 蝦蟹合戰——享用精緻螃蟹懷石料理。
        坐得舒服，長輩吃得開心滿意。
      </div>
      <div className="d4-crab-chips">
        <div className="d4-crab-chip">帝王蟹</div>
        <div className="d4-crab-chip">松葉蟹</div>
        <div className="d4-crab-chip">螃蟹懷石</div>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="d4-pass">
      <div className="d4-pass-left">
        <div className="d4-pass-kicker">En Route · Nakayama Pass</div>
        <div className="d4-pass-title">中山峠<br />遠眺<span>羊蹄山</span></div>
        <div className="d4-pass-body">
          途中在中山峠停留片刻，遠眺被稱為「蝦夷富士」的羊蹄山。
          雲霧間完美的錐形輪廓，不停車拍照實在太可惜。
        </div>
      </div>
      <div className="d4-pass-right">
        <div className="d4-mountain" />
        <div className="d4-mountain-snow" style={{ marginTop: -8 }} />
        <div className="d4-mountain-label">羊蹄山</div>
        <div className="d4-mountain-sub">1,898 m · 蝦夷富士</div>
      </div>
    </div>
  );
}

function Step4() {
  return (
    <div className="d4-toya">
      <div className="d4-toya-left">
        <div className="d4-toya-kicker">Evening · Toya Lake</div>
        <div className="d4-toya-title">洞爺湖萬世閣<br /><span>花火大會</span></div>
        <div className="d4-toya-row">
          <div className="d4-toya-card">
            <div className="d4-toya-card-name">頂級溫泉晚宴</div>
            <div className="d4-toya-card-detail">飯店附早晚餐，入住即享豪華晚宴</div>
          </div>
          <div className="d4-toya-card">
            <div className="d4-toya-card-name">洞爺湖花火大會</div>
            <div className="d4-toya-card-detail">在房間或湖畔輕鬆觀賞，不需移動</div>
          </div>
        </div>
        <div className="d4-fireworks">
          {[...Array(8)].map((_, i) => <div key={i} className="d4-fw-dot" />)}
        </div>
      </div>
      <div className="d4-toya-photo">
        <img src={`${base}images/toya-lake.jpg`} alt="洞爺湖" />
      </div>
    </div>
  );
}
