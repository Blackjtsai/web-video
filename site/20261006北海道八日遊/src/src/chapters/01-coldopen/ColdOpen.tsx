import type React from "react";
import "./ColdOpen.css";

interface Props { step: number; }

export default function ColdOpen({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  return null;
}

const base = import.meta.env.BASE_URL;

/* ── Step 0: Hero cover ── */
function Step0() {
  return (
    <div className="co-hero">
      <img className="co-hero-bg" src={`${base}images/cover.jpg`} alt="" aria-hidden />
      <img className="co-hero-img" src={`${base}images/cover.jpg`} alt="北海道家族旅遊封面" />
      <div className="co-hero-gradient" />
      <div className="co-hero-text">
        <div className="co-hero-kicker">2026 · Oct · Hokkaido</div>
        <div className="co-hero-title">北海道，我們來了</div>
        <div className="co-hero-accent-bar" />
        <div className="co-hero-badges">
          <span className="co-badge-pill">六人成行</span>
          <span className="co-badge-pill">八天七夜</span>
          <span className="co-badge-pill">秋楓滿山</span>
        </div>
      </div>
    </div>
  );
}

/* ── Step 1: Family 6 people ── */
function Step1() {
  return (
    <div className="co-family">
      <div className="co-family-kicker">Family · 2026 Autumn</div>
      <div className="co-family-num-row">
        <span className="co-family-num">6</span>
        <span className="co-family-unit">人同行</span>
      </div>
      <div className="co-family-desc">
        <strong>長輩 2 位 · Eason & 美玲 · 美惠 & 弈捷</strong>
        <br />
        家族同行，秋日慢活
      </div>
      <div className="co-family-tags">
        <span className="co-family-tag">慢活步調</span>
        <span className="co-family-tag">四天自駕</span>
        <span className="co-family-tag">包棟別墅</span>
      </div>
    </div>
  );
}

/* ── Step 2: Route preview ── */
const STOPS = [
  { name: "札幌", days: "Day 1–3", hub: true },
  { name: "洞爺湖", days: "Day 4", hub: false },
  { name: "二世谷", days: "Day 5", hub: false },
  { name: "積丹・余市", days: "Day 6", hub: false },
  { name: "小樽", days: "Day 7", hub: false },
  { name: "新千歲", days: "Day 8", hub: true },
];

function Step2() {
  const items: React.ReactNode[] = [];
  STOPS.forEach((s, i) => {
    items.push(
      <div className="co-stop" key={s.name}>
        <div className={`co-stop-dot${s.hub ? " is-hub" : ""}`} />
        <div className="co-stop-name">{s.name}</div>
        <div className="co-stop-days">{s.days}</div>
      </div>
    );
    if (i < STOPS.length - 1) {
      items.push(<div className="co-connector" key={`c-${i}`} />);
    }
  });
  return (
    <div className="co-route">
      <div className="co-route-header">
        <div className="co-route-title">北海道 <span>8 天</span> 精華路線</div>
        <div className="co-route-sub">10/06 — 10/13 · IT236 / IT235</div>
      </div>
      <div className="co-route-track">{items}</div>
    </div>
  );
}

/* ── Step 3: Trip themes ── */
const THEMES = [
  { icon: "🏙️", name: "札幌市區慢遊", detail: "二條市場 · 電視塔 · 狸小路 · 藻岩山夜景" },
  { icon: "♨️", name: "洞爺湖溫泉", detail: "萬世閣溫泉 · 飯店自助晚餐 · 有珠山纜車" },
  { icon: "🚗", name: "Day 4 起自駕", detail: "WNR 取車 · 定山溪 → 洞爺湖 → 二世谷 → 積丹 → 小樽" },
  { icon: "🏡", name: "Glow 包棟別墅", detail: "小樽近郊 · 採買食材，全家一起 BBQ" },
];

function Step3() {
  return (
    <div className="co-themes">
      <div className="co-themes-left">
        <div className="co-themes-label">This Trip</div>
        <div className="co-themes-heading">
          這趟<br /><span>怎麼玩</span>？
        </div>
      </div>
      <div className="co-themes-right">
        {THEMES.map((t) => (
          <div className="co-theme-card" key={t.name}>
            <div className="co-theme-icon">{t.icon}</div>
            <div className="co-theme-body">
              <div className="co-theme-name">{t.name}</div>
              <div className="co-theme-detail">{t.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
