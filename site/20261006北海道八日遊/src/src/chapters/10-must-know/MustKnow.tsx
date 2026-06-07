import "./MustKnow.css";

interface Props { step: number; }
const base = import.meta.env.BASE_URL;

export default function MustKnow({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  if (step === 4) return <Step4 />;
  return null;
}

function Step0() {
  return (
    <div className="mk-title-screen">
      <div className="mk-title-kicker">Before Departure</div>
      <div className="mk-title-main">出發前<br /><span>必知 5 件事</span></div>
      <div className="mk-title-sub">確認好這幾點，旅途零煩惱</div>
      <div className="mk-checklist-row">
        {["訂位", "保暖", "飲食", "行程", "伴手禮"].map(t => (
          <span key={t} className="mk-check-pill">{t}</span>
        ))}
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="mk-booking">
      <div className="mk-step-num">01</div>
      <div className="mk-booking-kicker">Item 1 · Reservation</div>
      <div className="mk-booking-title"><span>提早訂位</span>！</div>
      <div className="mk-booking-body">
        六人用餐含長輩，位子很難臨時排到。
        以下兩個餐廳請提早至少一個月網路訂位。
      </div>
      <div className="mk-booking-cards">
        <div className="mk-booking-card">
          <div className="mk-booking-card-date">10/09 (Thu)</div>
          <div className="mk-booking-card-name">螃蟹大餐<br />札幌螃蟹家 / 蝦蟹合戰</div>
        </div>
        <div className="mk-booking-card">
          <div className="mk-booking-card-date">10/12 (Sun)</div>
          <div className="mk-booking-card-name">和牛燒肉慶功<br />肉之兵衛 / 德壽</div>
        </div>
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="mk-warm">
      <div className="mk-warm-left">
        <div className="mk-warm-kicker">Item 2 · Clothing</div>
        <div className="mk-warm-title">保暖衣物<br /><span>一定要帶</span></div>
        <div className="mk-warm-body">
          10 月北海道早晚溫差極大，約 5～15°C。
          洞爺湖畔與二世谷山區體感溫度更低。
          防風防潑水外套（Gore-Tex 系列）或保暖羽絨衣，
          長輩、大人、小孩都必須備妥。
        </div>
      </div>
      <div className="mk-warm-right">
        <div className="mk-gauge-labels">
          <span className="mk-gauge-label hi">15°C 白天</span>
        </div>
        <div className="mk-gauge-track">
          <div className="mk-gauge-fill" />
        </div>
        <div className="mk-gauge-labels">
          <span className="mk-gauge-label">5°C 早晚</span>
        </div>
      </div>
    </div>
  );
}

function Step3() {
  const notes = [
    { name: "全員不吃羊肉", detail: "訂任何餐廳前請確認菜單，10/12 和牛燒肉選非羊肉套餐" },
    { name: "長輩交通：計程車代步", detail: "六人分兩台，省力且免爬地鐵樓梯；市區內車資合理" },
    { name: "10/11 Glow 別墅無早餐", detail: "傍晚需去附近生鮮超市採買 BBQ 食材（和牛 / 鮮乳 / 麵包）" },
  ];
  return (
    <div className="mk-notes">
      <div className="mk-notes-kicker">Item 3 · Notes</div>
      <div className="mk-notes-title">飲食 & 出行注意</div>
      <div className="mk-note-list">
        {notes.map(n => (
          <div key={n.name} className="mk-note-item">
            <div className="mk-note-dot" />
            <div className="mk-note-content">
              <div className="mk-note-name">{n.name}</div>
              <div className="mk-note-detail">{n.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4() {
  const featured = [
    { name: "白色戀人", note: "石屋製菓・北海道必買首選", img: "souvenir-shiroi-koibito.jpg" },
    { name: "六花亭 Marusei", note: "奶油葡萄乾夾心餅・香濃必吃", img: "souvenir-rokkatei.jpg" },
  ];
  const chips = ["薯條三兄弟・北海道限定", "北海道起司蛋糕・新鮮冷藏", "帝王蟹味噌湯包・輕鬆帶回台灣"];
  return (
    <div className="mk-souvenir">
      <div className="mk-sv-kicker">Item 4 · Souvenirs</div>
      <div className="mk-sv-title">北海道<span>伴手禮攻略</span></div>
      <div className="mk-sv-featured">
        {featured.map((f, idx) => (
          <div key={f.name} className="mk-sv-feat-card" style={{ animationDelay: `${350 + idx * 150}ms` }}>
            <div className="mk-sv-feat-img">
              <img src={`${base}images/${f.img}`} alt={f.name} />
            </div>
            <div className="mk-sv-feat-name">{f.name}</div>
            <div className="mk-sv-feat-note">{f.note}</div>
          </div>
        ))}
      </div>
      <div className="mk-sv-chips">
        {chips.map((c, i) => (
          <div key={c} className="mk-sv-chip" style={{ animationDelay: `${650 + i * 150}ms` }}>{c}</div>
        ))}
      </div>
    </div>
  );
}
