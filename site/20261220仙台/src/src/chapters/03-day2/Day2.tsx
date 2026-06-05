import "./Day2.css";

interface Props { step: number; }

const SLOPES = [
  { name: "初級", pct: 0.5, km: "2.1km" },
  { name: "中級", pct: 0.85, km: "3.6km" },
  { name: "高級", pct: 1.0, km: "4.3km" },
];

const TIMELINE = [
  { time: "08:00", title: "飯店退房，出發", sub: "行李上車，往宮城藏王 Eboshi", delay: "0ms" },
  { time: "09:30", title: "抵達 Eboshi", sub: "現場辦雪具租借 + 購買纜車券", delay: "120ms" },
  { time: "16:30", title: "歸還雪具，出發", sub: "翻越山脈前往山形藏王溫泉", delay: "240ms" },
  { time: "18:00", title: "溫泉飯店入住", sub: "晚餐 + 溫泉", delay: "360ms" },
];

const TIPS = [
  "結伴滑雪，互相照應",
  "注意體力分配，還有後面兩天",
  "纜車 12 月通常 16:30 視天色關閉",
];

export default function Day2({ step }: Props) {
  return (
    <div className="d2-stage">
      <div className="d2-header">
        <div className="d2-day-tag">DAY 02 &nbsp;·&nbsp; 12.21 MON</div>
        <div className="d2-day-title">宮城藏王 Eboshi 衝鋒・翻山越嶺</div>
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

      {/* Step 1: Eboshi 雪場介紹 */}
      {step === 1 && (
        <div className="d2-eboshi">
          <div className="d2-resort-card">
            <div className="d2-resort-name">みやぎ蔵王<br />えぼしリゾート</div>
            <div className="d2-resort-en">MIYAGI ZAO EBOSHI RESORT</div>
            <div className="d2-stats-grid">
              {[
                { num: "4.3", unit: "km", label: "最長滑道" },
                { num: "22", unit: "條", label: "滑道數量" },
                { num: "930", unit: "m", label: "最高標高" },
                { num: "60", unit: "min", label: "距市區車程" },
              ].map((s, i) => (
                <div key={i} className="d2-stat-box">
                  <div><span className="d2-stat-num">{s.num}</span><span className="d2-stat-unit">{s.unit}</span></div>
                  <div className="d2-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="d2-slope-visual">
            <div className="d2-slope-label">SLOPE LENGTH</div>
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
            <div className="d2-time-big">09:30</div>
            <div className="d2-time-sep">→</div>
            <div className="d2-time-big">16:00</div>
            <div className="d2-time-label">全日飆雪<br />約 6.5 小時</div>
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

      {/* Step 3: 翻山越嶺 */}
      {step === 3 && (
        <div className="d2-drive">
          <div className="d2-route-arrow">
            <div className="d2-route-place">
              <div className="d2-route-name">宮城藏王<br />Eboshi</div>
              <div className="d2-route-sub">16:30 出發</div>
            </div>
            <div className="d2-route-mid">
              <div className="d2-route-line-h" />
              <div className="d2-route-dur">60–70 min</div>
            </div>
            <div className="d2-route-place">
              <div className="d2-route-name">山形藏王<br />溫泉街</div>
              <div className="d2-route-sub">18:00 抵達</div>
            </div>
          </div>
          <div className="d2-warn-box">
            <div className="d2-warn-title">⚠ 山路自駕注意</div>
            <div className="d2-warn-text">
              傍晚翻越山脈極易起霧或降大雪<br />
              開啟霧燈，拉大與前車距離，慢慢開
            </div>
          </div>
        </div>
      )}

      {/* Step 4: 山形牛晚餐 */}
      {step === 4 && (
        <div className="d2-dinner">
          <div className="d2-dinner-visual">
            <div className="d2-dinner-icon">🥩</div>
            <div className="d2-dinner-cn">山形牛壽喜燒</div>
          </div>
          <div className="d2-dinner-info">
            <div className="d2-dinner-name">山形牛<br />壽喜燒</div>
            <div className="d2-dinner-tags">
              <span className="d2-dtag">山形 A5 和牛</span>
              <span className="d2-dtag">飯店會席料理</span>
              <span className="d2-dtag">入口即化</span>
            </div>
            <div className="d2-tl-sub" style={{ fontSize: 14, color: "var(--text-mute)" }}>
              換上浴衣，享用飯店精心準備的極致晚餐
            </div>
          </div>
        </div>
      )}

      {/* Step 5: 溫泉 */}
      {step === 5 && (
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
              <div className="d2-onsen-name">純天然<br />強酸性白濁<br />硫磺泉</div>
              <div className="d2-onsen-desc">
                泡進去，第一天滑雪的疲憊<br />瞬間化解
              </div>
            </div>
          </div>
          <div className="d2-onsen-note">
            睡前可至溫泉街散步，體驗充滿昭和風味的雪景小鎮
          </div>
        </div>
      )}
    </div>
  );
}
