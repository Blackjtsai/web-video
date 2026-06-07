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
        <div className="d6-day-label">Day 6 · 10/11 (Sat)</div>
        <div className="d6-day-title">積丹藍<br />× 家族 BBQ</div>
        <div className="d6-day-sub">積丹海岸自駕 → Glow 包棟別墅<br />和牛採買 → 家族私廚饗宴</div>
        <div className="d6-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="d6-shakotan">
      <div className="d6-shakotan-kicker">Morning Drive · Shakotan</div>
      <div className="d6-shakotan-title"><span>積丹藍</span>——只有這個季節</div>
      <div className="d6-shakotan-body">
        沿積丹半島海岸線自駕，隨車窗悠閒欣賞「積丹藍」——
        秋季特有的清澈湛藍海色，是北海道只有這個季節才看得到的限定風景。
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
        <div className="d6-glow-kicker">Afternoon · Glow Villa</div>
        <div className="d6-glow-title"><span>Glow</span> 包棟別墅<br />傍晚超市採買</div>
        <div className="d6-glow-body">
          下午提早入住小樽近郊極具美學質感的包棟別墅 Glow。
          入住後全家開車去附近生鮮超市，採買今晚 BBQ 食材。
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
      <div className="d6-bbq-label">Tonight · Family BBQ</div>
      <div className="d6-bbq-title">頂級<span>和牛 BBQ</span><br />家族私廚饗宴</div>
      <div className="d6-bbq-body">
        全家人在民宿廚房一起下廚，辦一場私密溫馨的家族和牛 BBQ 饗宴。
        這種感覺，任何飯店都吃不到。
      </div>
      <div className="d6-flames">
        {[...Array(7)].map((_, i) => <div key={i} className="d6-flame" />)}
      </div>
    </div>
  );
}
