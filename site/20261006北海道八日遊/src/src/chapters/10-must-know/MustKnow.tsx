import "./MustKnow.css";
import { WEATHER, WEATHER_QUERIED_AT, WEATHER_SOURCE } from "../../data/weather";

interface Props { step: number; }
const base = import.meta.env.BASE_URL;

export default function MustKnow({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  if (step === 4) return <Step4 />;
  if (step === 5) return <Step5 />;
  return null;
}

function Step0() {
  return (
    <div className="mk-title-screen">
      <div className="mk-title-kicker">Before Departure</div>
      <div className="mk-title-main">出發前<br /><span>必知 5 件事</span></div>
      <div className="mk-title-sub">確認好這幾點，旅途零煩惱</div>
      <div className="mk-checklist-row">
        {["訂位", "保暖", "天氣", "注意", "伴手禮"].map(t => (
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
        這間餐廳請提早上網訂位。
      </div>
      <div className="mk-booking-cards">
        <div className="mk-booking-card">
          <div className="mk-booking-card-date">10/07 (Wed) 17:30</div>
          <div className="mk-booking-card-name">蟹座<br />Day 2 晚餐</div>
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
          洞爺湖、二世谷、積丹等戶外景點體感溫度更低。
          建議帶保暖又防風的外套，
          大人、長輩都要備妥。
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
  return (
    <div className="mk-wx">
      <div className="mk-notes-kicker">Item 3 · Weather</div>
      <div className="mk-notes-title">每日<span style={{ color: "var(--accent)" }}>天氣預報</span></div>
      <div className="mk-wx-grid">
        {WEATHER.map(w => (
          <div key={w.date} className="mk-wx-card">
            <div className="mk-wx-head">{w.day} · {w.date.slice(0, 5)}</div>
            <div className="mk-wx-place">{w.place}</div>
            <div className="mk-wx-icon">{w.icon}</div>
            <div className="mk-wx-text">{w.text}</div>
            <div className="mk-wx-temp">{w.min}–{w.max}°C</div>
            <div className="mk-wx-pop">降雨 {w.pop}%</div>
          </div>
        ))}
      </div>
      <div className="mk-wx-note">資料：{WEATHER_SOURCE}｜查詢時間 {WEATHER_QUERIED_AT}｜預報會變動，出發前請再確認</div>
    </div>
  );
}

function Step4() {
  const notes = [
    { name: "全員不吃羊肉", detail: "訂任何餐廳前請確認菜單" },
    { name: "Day 4 起自駕", detail: "出發前確認 WNR 取車資料、駕照 / 日文譯本與導航設定" },
    { name: "10/11 Glow 別墅不含餐", detail: "不含餐，餐食需自行安排" },
  ];
  return (
    <div className="mk-notes">
      <div className="mk-notes-kicker">Item 4 · Notes</div>
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

function Step5() {
  const featured = [
    { name: "白色戀人", note: "石屋製菓・北海道必買首選", img: "souvenir-shiroi-koibito.jpg" },
    { name: "六花亭 Marusei", note: "奶油葡萄乾夾心餅・香濃必吃", img: "souvenir-rokkatei.jpg" },
  ];
  const chips = ["薯條三兄弟・北海道限定", "北海道起司蛋糕・新鮮冷藏"];
  return (
    <div className="mk-souvenir">
      <div className="mk-sv-kicker">Item 5 · Souvenirs</div>
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
