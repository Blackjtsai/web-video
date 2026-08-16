import "./Day2.css";

interface Props { step: number; }

const SLOPES = [
  { name: "中央區", pct: 0.75, km: "主纜車集散" },
  { name: "橫倉區", pct: 1.0, km: "中級長巡航" },
  { name: "上ノ台", pct: 0.5, km: "初級練身" },
];

const TIMELINE = [
  { time: "07:30", title: "飯店早餐、換裝", sub: "確認雪場與纜車開放狀況", delay: "0ms" },
  { time: "08:30", title: "前往租借店／纜車站", sub: "租裝備、購 Lift 券", delay: "120ms" },
  { time: "09:00", title: "上午滑行", sub: "熟悉雪況與回飯店方向", delay: "240ms" },
  { time: "16:00", title: "收板回飯店", sub: "不用開車，就在雪場旁", delay: "360ms" },
];

const TIPS = [
  "第一天先熟悉，別急著攻頂",
  "把中央區、橫倉區主要路線滑順",
  "體力留給明天進階、後天夜滑",
];

export default function Day2({ step }: Props) {
  return (
    <div className="d2-stage">
      <div className="d2-header">
        <div className="d2-day-tag">DAY 02 &nbsp;·&nbsp; 12.21 MON</div>
        <div className="d2-day-title">山形藏王溫泉滑雪場・熟悉雪場</div>
      </div>

      {/* Step 0: 今日行程 */}
      {step === 0 && (
        <div className="d2-depart">
          <div className="d2-timeline">
            {TIMELINE.map((t, i) => (
              <div key={i} className="d2-tl-item d2-tl-item--visible" style={{ animationDelay: t.delay }}>
                <div className="d2-tl-left">
                  <div className="d2-tl-time">{t.time}</div>
                </div>
                <div className="d2-tl-right">
                  <div className="d2-tl-title">{t.title}</div>
                  <div className="d2-tl-sub">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: 藏王溫泉滑雪場（熟悉日） */}
      {step === 1 && (
        <div className="d2-eboshi">
          <div className="d2-resort-card">
            <div className="d2-resort-name">山形藏王溫泉<br />スキー場</div>
            <div className="d2-resort-en">YAMAGATA ZAO ONSEN · DAY 1 熟悉</div>
            <div className="d2-stats-grid">
              {[
                { num: "3", unit: "晚", label: "連住雪場旁" },
                { num: "1661", unit: "m", label: "最高標高" },
                { num: "855", unit: "m", label: "最大落差" },
                { num: "樹氷", unit: "", label: "12月奇景" },
              ].map((s, i) => (
                <div key={i} className="d2-stat-box">
                  <div><span className="d2-stat-num">{s.num}</span><span className="d2-stat-unit">{s.unit}</span></div>
                  <div className="d2-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="d2-slope-visual">
            <div className="d2-slope-label">今日熟悉區域</div>
            <div className="d2-slope-bars">
              {SLOPES.map((s, i) => (
                <div key={i} className="d2-slope-row">
                  <div className="d2-slope-name">{s.name}</div>
                  <div className="d2-slope-bar-bg">
                    <div
                      className="d2-slope-bar-fill"
                      style={{ width: `${s.pct * 100}%`, animationDelay: `${i * 150}ms` }}
                    />
                  </div>
                  <div className="d2-slope-km">{s.km}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: 全日飆雪 */}
      {step === 2 && (
        <div className="d2-ski-day">
          <div className="d2-time-block">
            <div className="d2-time-big">09:00</div>
            <div className="d2-time-sep">→</div>
            <div className="d2-time-big">16:30</div>
            <div className="d2-time-label">全日熟悉<br />約 7.5 小時</div>
          </div>
          <div className="d2-tips">
            {TIPS.map((t, i) => (
              <div
                key={i}
                className="d2-tip-item d2-tip-item--visible"
                style={{ animationDelay: `${i * 130}ms` }}
              >
                <div className="d2-tip-dot" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="d2-tl-sub" style={{ color: "var(--text-mute)", fontSize: 15 }}>
            中午在雪場餐廳吃日式拉麵或咖哩飯，補足能量
          </div>
        </div>
      )}

      {/* Step 3: 藏王溫泉街晚餐 */}
      {step === 3 && (
        <div className="d2-dinner">
          <div className="d2-dinner-visual">
            <div className="d2-dinner-icon">🍶</div>
            <div className="d2-dinner-cn">溫泉街晚餐</div>
          </div>
          <div className="d2-dinner-info">
            <div className="d2-dinner-name">藏王溫泉街<br />小食堂</div>
            <div className="d2-dinner-tags">
              <span className="d2-dtag">步行可達</span>
              <span className="d2-dtag">在地家常料理</span>
              <span className="d2-dtag">不用開車</span>
            </div>
            <div className="d2-tl-sub" style={{ fontSize: 14, color: "var(--text-mute)" }}>
              就住在溫泉街上，晚餐後直接回飯店，不用再開車
            </div>
          </div>
        </div>
      )}

      {/* Step 4: 溫泉 */}
      {step === 4 && (
        <div className="d2-onsen">
          <div className="d2-onsen-hero">
            <div className="d2-onsen-visual">
              <div className="d2-onsen-steam">
                <div className="d2-steam-line" />
                <div className="d2-steam-line" />
                <div className="d2-steam-line" />
              </div>
              <div className="d2-onsen-icon">♨️</div>
              <div className="d2-onsen-cn">藏王溫泉</div>
            </div>
            <div className="d2-onsen-info">
              <div className="d2-onsen-name">回飯店<br />泡湯放鬆<br />洗去疲憊</div>
              <div className="d2-onsen-desc">
                藏王強酸性硫磺泉<br />第一天滑雪的疲憊瞬間化解
              </div>
            </div>
          </div>
          <div className="d2-onsen-note">
            溫泉街的公共浴場（上湯／下湯）留到明天滑完雪再去逛
          </div>
        </div>
      )}
    </div>
  );
}
