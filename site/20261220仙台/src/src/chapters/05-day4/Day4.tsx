import "./Day4.css";

interface Props { step: number; }

const STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 5.3 + 3) % 95}%`,
  top: `${(i * 7.1 + 5) % 85}%`,
  delay: `${(i * 0.3) % 2}s`,
}));

const NS_ITEMS = [
  { text: "浪漫燈光探照下的夜間雪坡", delay: "0ms" },
  { text: "低溫讓雪質更酥脆，速度感極強", delay: "120ms" },
  { text: "大型人工造雪 + 高品質公園區", delay: "240ms" },
];

export default function Day4({ step }: Props) {
  return (
    <div className="d4-stage">
      <div className="d4-header">
        <div className="d4-day-tag">DAY 04 &nbsp;·&nbsp; 12.23 WED</div>
        <div className="d4-day-title">重返宮城・仙台泉 Spring Valley 夜滑</div>
      </div>

      {/* Step 0: 告別藏王 */}
      {step === 0 && (
        <div className="d4-farewell">
          <div className="d4-farewell-tag">FAREWELL ZAO</div>
          <div className="d4-farewell-title">最後一次晨湯<br />公路旅行，出發</div>
          <div className="d4-route-strip">
            <div className="d4-route-node">
              <div className="d4-route-city">藏王溫泉</div>
              <div className="d4-route-time">09:30 退房</div>
            </div>
            <div className="d4-route-mid-strip">
              <div className="d4-route-line-h" />
              <div className="d4-route-km">可停山形城跡</div>
            </div>
            <div className="d4-route-node">
              <div className="d4-route-city">仙台市區</div>
              <div className="d4-route-time">12:30 抵達</div>
            </div>
          </div>
          <div className="d4-optional-note">今天主攻夜滑，白天開車時間充裕，可以輪流開車、補眠</div>
        </div>
      )}

      {/* Step 1: 午餐仙台牛 */}
      {step === 1 && (
        <div className="d4-lunch">
          <div className="d4-lunch-visual">
            <div className="d4-lunch-glow" />
            <div className="d4-lunch-icon">🥩</div>
            <div className="d4-lunch-cn">仙台牛高級燒肉</div>
          </div>
          <div className="d4-lunch-info">
            <div className="d4-lunch-name">仙台牛<br />高級燒肉</div>
            <div className="d4-lunch-tags">
              <span className="d4-ltag">A5 仙台牛</span>
              <span className="d4-ltag">補足熱量</span>
              <span className="d4-ltag">12:30 午餐</span>
            </div>
            <div className="d4-lunch-sub">
              或選擇高評價海鮮丼<br />
              飽餐一頓，為晚上夜間滑雪補足熱量
            </div>
          </div>
        </div>
      )}

      {/* Step 2: 夜滑介紹 */}
      {step === 2 && (
        <div className="d4-valley">
          <div className="d4-resort-card">
            <div className="d4-resort-name">Spring Valley<br />仙台泉高原</div>
            <div className="d4-resort-en">SPRING VALLEY SENDAI IZUMI</div>
            <div className="d4-resort-stats">
              {[
                { num: "40", label: "距市區車程 min" },
                { num: "5h", label: "夜滑時間" },
                { num: "17:00", label: "開燈時間" },
              ].map((s, i) => (
                <div key={i} className="d4-rs-item">
                  <div className="d4-rs-num">{s.num}</div>
                  <div className="d4-rs-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="d4-night-visual">
            <div className="d4-night-stars">
              {STARS.map(s => (
                <div key={s.id} className="d4-night-star" style={{ left: s.left, top: s.top, animationDelay: s.delay }} />
              ))}
            </div>
            <div className="d4-night-tag">NIGHT SKI</div>
            <div className="d4-night-time">17:00 – 22:00</div>
            <div className="d4-night-desc">
              燈光探照的夜間雪坡<br />
              仙台泉的決勝一戰
            </div>
          </div>
        </div>
      )}

      {/* Step 3: 夜滑體驗 */}
      {step === 3 && (
        <div className="d4-nightski">
          <div className="d4-ns-hero">夜滑<br />極速體驗</div>
          <div className="d4-ns-highlights">
            {NS_ITEMS.map((item, i) => (
              <div key={i} className="d4-ns-item d4-ns-item--visible" style={{ animationDelay: item.delay }}>
                <div className="d4-ns-dot" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <div className="d4-ns-warn">
            ⚠ 夜間視線較不清晰，氣溫驟降<br />
            必須加穿保暖層與面罩
          </div>
        </div>
      )}

      {/* Step 4: 深夜拉麵 */}
      {step === 4 && (
        <div className="d4-ramen">
          <div className="d4-ramen-icon">🍜</div>
          <div className="d4-ramen-title">深夜熱血<br />拉麵宵夜</div>
          <div className="d4-ramen-time">22:00</div>
          <div className="d4-ramen-sub">
            下山返回仙台市區<br />
            叫碗濃郁熱湯<br />
            三連戰完結的最好句點
          </div>
        </div>
      )}
    </div>
  );
}
