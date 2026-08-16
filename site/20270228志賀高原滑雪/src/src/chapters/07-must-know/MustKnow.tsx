import "./MustKnow.css";

interface Props { step: number; }

const CHECKS = [
  "護照效期六個月以上",
  "雪具自備（滑雪服、雪鏡、手套）",
  "旅遊保險（雪上運動風險較高）",
];

const SOUVENIRS = [
  { icon: "🍜", name: "長野蕎麥麵" },
  { icon: "🍲", name: "信州味噌" },
  { icon: "🍶", name: "當地地酒" },
  { icon: "🎿", name: "滑雪場限定周邊" },
];

const BUDGET_ITEMS = [
  { name: "機票", amount: "NT$9,000" },
  { name: "住宿", amount: "NT$8,000" },
  { name: "交通", amount: "約 NT$5,200" },
  { name: "雪票", amount: "約 NT$5,200" },
  { name: "保險", amount: "NT$1,000" },
  { name: "餐費", amount: "NT$4,000" },
];

export default function MustKnow({ step }: Props) {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="mk-stage">
      <div className="mk-header">
        <div className="mk-tag">出發前必知</div>
        <div className="mk-title">別到了雪場才手忙腳亂</div>
      </div>

      {step === 0 && (
        <div className="mk-block">
          <div className="mk-lead">出發前，有幾件事必須確認清楚。</div>
        </div>
      )}

      {step === 1 && (
        <div className="mk-block">
          <div className="mk-checklist">
            {CHECKS.map((c, i) => (
              <div key={i} className="mk-check-item" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="mk-check-icon">✓</div>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mk-block">
          <div className="mk-warn">
            <div className="mk-warn-label">⚠ 出發前務必再確認</div>
            <div className="mk-warn-text">
              2026/27 冬季巴士班表、夜滑日期與雪票價格截至目前尚未正式公布，
              別憑去年的資訊出發，出發前一定要再查一次。
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mk-block">
          <div className="mk-note-box">
            <div className="mk-note-label">溫泉飯店須知</div>
            <div className="mk-note-text">浴巾、拖鞋飯店都會提供，但貴重物品要自己保管——泡湯前先鎖好。</div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="mk-block">
          <div className="mk-souvenir-row">
            {SOUVENIRS.map(s => (
              <div key={s.name} className="mk-souvenir-card">
                <div className="mk-souvenir-icon">{s.icon}</div>
                <div className="mk-souvenir-name">{s.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="mk-block">
          <div className="mk-budget-card">
            <div className="mk-budget-label">參考預算・每人</div>
            <div className="mk-budget-table">
              {BUDGET_ITEMS.map(b => (
                <div key={b.name} className="mk-budget-row">
                  <span className="mk-budget-name">{b.name}</span>
                  <span className="mk-budget-amount">{b.amount}</span>
                </div>
              ))}
            </div>
            <div className="mk-budget-total">
              <span>合計約</span>
              <span className="mk-budget-total-amount">NT$32,400</span>
            </div>
            <div className="mk-budget-suggest">建議準備 NT$35,000（含機動金）</div>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="mk-block mk-block--map">
          <div className="mk-map-wrap">
            <img
              className="mk-map-img"
              src={`${base}images/trail-map.jpg`}
              alt="志賀高原全山雪道地圖"
            />
          </div>
          <div className="mk-map-caption">
            高天原・中央區・東館山・寺小屋・一之瀨・燒額山・奧志賀 — 本次行程雪場皆涵蓋在內
          </div>
        </div>
      )}
    </div>
  );
}
