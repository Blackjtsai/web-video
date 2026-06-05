import "./MustKnow.css";

interface Props {
  step: number;
}

export default function MustKnow({ step }: Props) {
  if (step === 0) return <Documents />;
  if (step === 1) return <Luggage />;
  if (step === 2) return <Checkin />;
  if (step === 3) return <Seasick />;
  if (step === 4) return <Souvenir1 />;
  if (step === 5) return <Souvenir2 />;
  return null;
}

/* ── Step 0: 必備證件 ── */
const DOCS = [
  { icon: "大", name: "身分證", who: "大人必備" },
  { icon: "保", name: "健保卡", who: "小朋友" },
  { icon: "駕", name: "駕照",   who: "開車必備" },
];

function Documents() {
  return (
    <div className="mk-docs">
      <div className="mk-docs-eyebrow">出發前確認</div>
      <div className="mk-docs-cards">
        {DOCS.map((d, i) => (
          <div
            className="mk-doc-card"
            key={d.name}
            style={{ animationDelay: `${i * 160 + 200}ms` }}
          >
            <div className="mk-doc-icon">{d.icon}</div>
            <div className="mk-doc-name">{d.name}</div>
            <div className="mk-doc-who">{d.who}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Step 1: 行李規定 ── */
function Luggage() {
  return (
    <div className="mk-luggage">
      <div className="mk-luggage-title">行李規定</div>
      <div className="mk-luggage-rules">
        <div className="mk-luggage-rule mk-luggage-rule--carry">
          <div className="mk-luggage-type">手提</div>
          <div className="mk-luggage-detail">
            <div className="mk-luggage-limit">1 件 · 7 kg</div>
            <div className="mk-luggage-size">56 × 36 × 23 cm</div>
          </div>
        </div>
        <div className="mk-luggage-rule mk-luggage-rule--check">
          <div className="mk-luggage-type">託運</div>
          <div className="mk-luggage-detail">
            <div className="mk-luggage-limit">10 kg</div>
            <div className="mk-luggage-size">三邊總和 ≤ 180 cm</div>
          </div>
        </div>
      </div>
      <div className="mk-luggage-warn">別超重</div>
    </div>
  );
}

/* ── Step 2: 報到截止時間 ── */
function Checkin() {
  return (
    <div className="mk-checkin">
      <div className="mk-checkin-title">報到截止時間</div>
      <div className="mk-checkin-times">
        <div className="mk-checkin-node">
          <div className="mk-checkin-dir">去程</div>
          <div className="mk-checkin-time">11:40</div>
        </div>
        <div className="mk-checkin-divider" />
        <div className="mk-checkin-node">
          <div className="mk-checkin-dir">回程</div>
          <div className="mk-checkin-time">15:10</div>
        </div>
      </div>
      <div className="mk-checkin-note">提早到，別遲到</div>
    </div>
  );
}

/* ── Step 3: 暈船藥 ── */
function Seasick() {
  return (
    <div className="mk-seasick">
      <div className="mk-seasick-card">
        <div className="mk-seasick-tag">夜釣必備 · Must Have</div>
        <div className="mk-seasick-main">暈船藥</div>
        <div className="mk-seasick-rule" />
        <div className="mk-seasick-body">
          <div className="mk-seasick-line">船停在海上還是會搖</div>
          <div className="mk-seasick-line mk-seasick-line--em">容易暈的提前吃好</div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 4: 伴手禮 Part 1 — 黑糖糕 ── */
function Souvenir1() {
  return (
    <div className="mk-sv1">
      <div className="mk-sv1-eyebrow">伴手禮快速記</div>
      <div className="mk-sv1-product">黑糖糕</div>
      <div className="mk-sv1-table">
        <div className="mk-sv1-row">
          <div className="mk-sv1-row-label">在地推薦</div>
          <div className="mk-sv1-row-shops">水月堂 · 春仁</div>
        </div>
        <div className="mk-sv1-row">
          <div className="mk-sv1-row-label">機場提貨</div>
          <div className="mk-sv1-row-shops">御品家</div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 5: 伴手禮 Part 2 + 結語 ── */
const SV2_ITEMS = [
  { name: "干貝醬", shops: "高林・胡媽媽灶腳" },
  { name: "花生酥", shops: "正一" },
  { name: "鹹餅",   shops: "盛興・泉利" },
];

function Souvenir2() {
  return (
    <div className="mk-sv2">
      <div className="mk-sv2-grid">
        {SV2_ITEMS.map((item, i) => (
          <div
            className="mk-sv2-item"
            key={item.name}
            style={{ animationDelay: `${i * 140 + 100}ms` }}
          >
            <div className="mk-sv2-name">{item.name}</div>
            <div className="mk-sv2-shops">{item.shops}</div>
          </div>
        ))}
      </div>
      <div className="mk-sv2-sep" />
      <div className="mk-sv2-finale">澎湖，我們來了。</div>
    </div>
  );
}
