import "./Day5.css";

interface Props { step: number; }

const SOUVENIRS = [
  { name: "萩の月", note: "仙台最具代表性的奶油夾心蛋糕", delay: "0ms" },
  { name: "一口毛豆麻糬", note: "東北限定，Q 彈好吃", delay: "150ms" },
  { name: "在地清酒", note: "宮城縣名酒，送禮首選", delay: "300ms" },
];

const RETURN_STEPS = [
  { num: "01", text: "在營業所附近加油站將油箱加滿（Regular 汽油）" },
  { num: "02", text: "保留加油收據備查" },
  { num: "03", text: "結算 ETC 過路費" },
  { num: "04", text: "搭接駁車到仙台機場航廈辦理登機" },
];

const RECAP = ["5天4夜", "3座雪場", "牛舌", "山形牛", "羊肉", "深夜拉麵", "硫磺溫泉"];

export default function Day5({ step }: Props) {
  return (
    <div className="d5-stage">
      <div className="d5-header">
        <div className="d5-day-tag">DAY 05 &nbsp;·&nbsp; 12.24 THU &nbsp;·&nbsp; Christmas Eve</div>
        <div className="d5-day-title">伴手禮採買・滿載而歸</div>
      </div>

      {/* Step 0: 採購 */}
      {step === 0 && (
        <div className="d5-shopping">
          <div className="d5-shop-title">東北名產<br />大採購</div>
          <div className="d5-souvenir-row">
            {SOUVENIRS.map((s, i) => (
              <div
                key={i}
                className="d5-sv-card d5-sv-card--visible"
                style={{ animationDelay: s.delay }}
              >
                <div className="d5-sv-name">{s.name}</div>
                <div className="d5-sv-note">{s.note}</div>
              </div>
            ))}
          </div>
          <div className="d5-shop-note">
            仙台車站商圈 · 男子漢行程亦不可空手回
          </div>
        </div>
      )}

      {/* Step 1: Outlet */}
      {step === 1 && (
        <div className="d5-outlet">
          <div className="d5-outlet-info">
            <div className="d5-outlet-name">仙台港<br />三井 Outlet</div>
            <div className="d5-outlet-en">MITSUI OUTLET PARK SENDAI PORT</div>
            <div className="d5-outlet-tags">
              <span className="d5-otag">大型戶外用品店</span>
              <span className="d5-otag">滑雪同好尋寶</span>
              <span className="d5-otag">午餐 + 購物</span>
            </div>
            <div className="d5-outlet-sub">
              Gore-Tex 外套、滑雪護具、運動服飾<br />
              最後一波大採購機會
            </div>
          </div>
          <div className="d5-outlet-map">
            <div className="d5-map-label">DISTANCE TO AIRPORT</div>
            <div className="d5-map-distance">
              <div className="d5-dist-num">25</div>
              <div className="d5-dist-label">分鐘<br />車程</div>
            </div>
            <div className="d5-map-note">
              鄰近仙台機場<br />
              逛完直接開去還車
            </div>
          </div>
        </div>
      )}

      {/* Step 2: 還車 */}
      {step === 2 && (
        <div className="d5-return">
          <div className="d5-day-tag" style={{ marginBottom: 4 }}>RETURN CAR → CHECK-IN</div>
          <div className="d5-steps-list">
            {RETURN_STEPS.map((s, i) => (
              <div
                key={i}
                className="d5-step-item d5-step-item--visible"
                style={{ animationDelay: `${i * 110}ms` }}
              >
                <div className="d5-step-num">{s.num}</div>
                <div className="d5-step-text">{s.text}</div>
              </div>
            ))}
          </div>
          <div className="d5-warn-box">
            提早 2 至 2.5 小時抵達機場，確保大型雪具 / 行李託運時間充裕
          </div>
        </div>
      )}

      {/* Step 3: 圓滿落幕 */}
      {step === 3 && (
        <div className="d5-finale">
          <div className="d5-finale-icon">✈️</div>
          <div className="d5-finale-title">熱血滿載<br />平安返台</div>
          <div className="d5-finale-recap">
            {RECAP.map((r, i) => (
              <div key={i} className="d5-recap-item">{r}</div>
            ))}
          </div>
          <div className="d5-finale-sub">SENDAI · 2026 · 12 · 20–24 · SEE YOU NEXT TIME</div>
        </div>
      )}
    </div>
  );
}
