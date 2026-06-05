import "./Day3.css";

interface Props { step: number; }

export default function Day3({ step }: Props) {
  return (
    <div className="d3-stage">
      <div className="d3-header">
        <div className="d3-day-tag">DAY 03 &nbsp;·&nbsp; 12.22 TUE</div>
        <div className="d3-day-title">制霸日本最大藏王雪場・溫泉名湯</div>
      </div>

      {/* Step 0: 今天不用開車 */}
      {step === 0 && (
        <div className="d3-noDrive">
          <div className="d3-no-car-badge">
            <span style={{ fontSize: 24 }}>🚗</span>
            <div className="d3-no-car-text">今天不用開車！車停飯店，大夥放鬆暢滑</div>
          </div>
          <div className="d3-schedule-row">
            {[
              { time: "08:30", title: "溫泉早餐", sub: "豐盛日式溫泉早餐\n溫泉街配合店鋪租借雪具", delay: "0ms" },
              { time: "09:00", title: "直衝藏王", sub: "步行到大門\n全日纜車券衝上頂峰", delay: "150ms" },
              { time: "17:00", title: "公共浴場", sub: "上湯 / 下湯巡禮\n歷史名湯泡完再說", delay: "300ms" },
              { time: "19:00", title: "成吉思汗", sub: "烤生羊肉＋生啤酒\n男人的痛快晚餐", delay: "450ms" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
                <div className="d3-sched-item d3-sched-item--visible" style={{ animationDelay: s.delay }}>
                  <div className="d3-sched-time">{s.time}</div>
                  <div className="d3-sched-title">{s.title}</div>
                  <div className="d3-sched-sub" style={{ whiteSpace: "pre-line" }}>{s.sub}</div>
                </div>
                {i < 3 && <div className="d3-sched-sep">→</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: 藏王滑雪場介紹 */}
      {step === 1 && (
        <div className="d3-zao">
          <div className="d3-zao-card">
            <div className="d3-zao-name">山形藏王<br />溫泉滑雪場</div>
            <div className="d3-zao-en">YAMAGATA ZAO ONSEN SKI RESORT</div>
            <div className="d3-zao-stats">
              {[
                { num: "43", unit: "條", label: "滑道數量" },
                { num: "1661", unit: "m", label: "最高標高" },
                { num: "855", unit: "m", label: "最大落差" },
              ].map((s, i) => (
                <div key={i} className="d3-z-stat">
                  <div><span className="d3-z-num">{s.num}</span><span className="d3-z-unit">{s.unit}</span></div>
                  <div className="d3-z-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="d3-tree-ice">
            <div className="d3-tree-label">12月限定奇景</div>
            <div className="d3-tree-title">樹冰</div>
            <div className="d3-tree-sub">
              山頂樹木被雪與冰霧層層包覆<br />
              形成巨大「雪怪」造型<br />
              全世界僅此一地的壯觀景象
            </div>
            <svg className="d3-tree-ice-svg" width="260" height="80" viewBox="0 0 260 80">
              {[20,55,90,125,160,195,230].map((x,i) => (
                <g key={i} transform={`translate(${x},80)`}>
                  <polygon
                    points={`0,-${40+i%3*10} ${-12-i%2*4},0 ${12+i%2*4},0`}
                    fill={`rgba(79,195,247,${0.15 + (i%3)*0.1})`}
                    stroke="rgba(79,195,247,0.3)"
                    strokeWidth="0.5"
                  />
                  <polygon
                    points={`0,-${25+i%2*8} ${-8-i%3*2},0 ${8+i%3*2},0`}
                    fill={`rgba(79,195,247,${0.2 + (i%2)*0.1})`}
                    stroke="rgba(79,195,247,0.4)"
                    strokeWidth="0.5"
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}

      {/* Step 2: 全日滑雪 */}
      {step === 2 && (
        <div className="d3-ski-full">
          <div className="d3-lift-block">
            <div className="d3-lift-icon">🚡</div>
            <div className="d3-lift-info">
              <div className="d3-lift-title">搭巨大纜車衝上頂峰</div>
              <div className="d3-lift-sub">
                橫跨多個山頭的特色滑道<br />
                可下至溫泉街的「樹冰原滑道」<br />
                雪場極大，務必拿地圖，免得滑到另一個山頭
              </div>
            </div>
          </div>
          <div className="d3-lunch-note">
            中午在山頂餐廳 · 喝杯熱可可 + 大碗豬肉味噌湯飯<br />
            這就是雪山上的男人幸福
          </div>
        </div>
      )}

      {/* Step 3: 公共浴場 */}
      {step === 3 && (
        <div className="d3-bath">
          <div className="d3-bath-row">
            {[
              { name: "上湯（かみのゆ）", desc: "溫泉街上方\n清澈透明的歷史名湯" },
              { name: "下湯（しものゆ）", desc: "溫泉街下方\n在地居民最常使用" },
            ].map((b, i) => (
              <div
                key={i}
                className="d3-bath-place d3-bath-place--visible"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="d3-bath-name" style={{ whiteSpace: "pre-line" }}>{b.name}</div>
                <div className="d3-bath-desc" style={{ whiteSpace: "pre-line" }}>{b.desc}</div>
              </div>
            ))}
          </div>
          <div className="d3-bath-warn">
            ⚠ 強酸性溫泉注意不要弄到眼睛<br />
            金屬飾品（銀飾）務必取下以免發黑
          </div>
        </div>
      )}

      {/* Step 4: 成吉思汗烤羊肉 */}
      {step === 4 && (
        <div className="d3-genghis">
          <div className="d3-grill-visual">
            <div className="d3-grill-glow" />
            <div className="d3-grill-icon">🔥</div>
            <div className="d3-grill-cn">ろばた / 成吉思汗</div>
          </div>
          <div className="d3-genghis-info">
            <div className="d3-genghis-name">成吉思汗<br />烤生羊肉</div>
            <div className="d3-genghis-tags">
              <span className="d3-gtag">東北名物</span>
              <span className="d3-gtag">炭火直烤</span>
              <span className="d3-gtag">搭配生啤酒</span>
            </div>
            <div className="d3-genghis-desc">
              圍著炭火烤肉<br />
              是男人聚會最棒的氛圍<br />
              <span style={{ color: "var(--text-faint)", fontSize: "13px" }}>
                推薦：溫泉街名店「ろばた」
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
