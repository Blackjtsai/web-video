import "./Day1.css";

interface Props { step: number; }

const CHECKS = [
  "雪胎（Studless Tires）確認",
  "4WD / AWD 確認",
  "ETC 卡租借",
  "右駕手感熱身",
];

export default function Day1({ step }: Props) {
  return (
    <div className="d1-stage">
      <div className="d1-header">
        <div className="d1-day-tag">DAY 01 &nbsp;·&nbsp; 12.20 SUN</div>
        <div className="d1-day-title">抵達仙台・啟動雪國自駕</div>
      </div>

      {/* Step 0: 機場抵達 */}
      {step === 0 && (
        <div className="d1-arrive">
          <div className="d1-flight-row">
            <div className="d1-airport-node">
              <div className="d1-airport-name">仙台機場</div>
              <div className="d1-airport-time">落地</div>
            </div>
            <div className="d1-flight-arrow">
              <div className="d1-flight-line" />
              <div className="d1-flight-dur">下午班機</div>
            </div>
            <div className="d1-airport-node">
              <div className="d1-airport-name">仙台市區</div>
              <div className="d1-airport-time">40 min</div>
            </div>
          </div>
          <div className="d1-note-box">
            <div className="d1-note-label">機場取車流程</div>
            <div className="d1-note-text">
              出關 → 1 樓租車櫃檯（Toyota / Nippon）<br />
              搭免費接駁車 ~5 分鐘 → 營業所辦手續
            </div>
          </div>
        </div>
      )}

      {/* Step 1: 取車確認清單 */}
      {step === 1 && (
        <div className="d1-hotel-block">
          <div className="d1-info-row">
            <div className="d1-info-item">
              <div className="d1-info-label">車型</div>
              <div className="d1-info-value">中型 SUV</div>
              <div className="d1-info-sub">Toyota RAV4 / Subaru Forester<br />後車廂容納 3 套滑雪板 + 行李</div>
            </div>
            <div className="d1-info-item">
              <div className="d1-info-label">飯店</div>
              <div className="d1-info-value">仙台市區</div>
              <div className="d1-info-sub">Hotel Metropolitan Sendai<br />或同級市區飯店</div>
            </div>
          </div>
          <div className="d1-checklist">
            <div className="d1-note-label" style={{ marginBottom: 4 }}>取車必確認清單</div>
            {CHECKS.map((c, i) => (
              <div
                key={i}
                className="d1-check-item d1-check-item--visible"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="d1-check-icon">✓</div>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: 牛舌盛宴 */}
      {step === 2 && (
        <div className="d1-beef">
          <div className="d1-dish-showcase">
            <div className="d1-dish-visual">
              <div className="d1-dish-icon">🥩</div>
              <div className="d1-dish-cn">炭火燒牛舌</div>
            </div>
            <div className="d1-dish-info">
              <div className="d1-dish-name">厚切牛舌<br />定食</div>
              <div className="d1-dish-tags">
                <span className="d1-tag">炭火直烤</span>
                <span className="d1-tag">仙台名物</span>
                <span className="d1-tag">多汁有嚼勁</span>
              </div>
            </div>
          </div>
          <div className="d1-restaurant-list">
            <div className="d1-note-label">推薦名店</div>
            {["司（Tsukasa）", "伊達の牛たん本舗"].map((r, i) => (
              <div
                key={i}
                className="d1-rest-item d1-rest-item--visible"
                style={{ animationDelay: `${200 + i * 150}ms` }}
              >
                <div className="d1-rest-dot" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: 居酒屋 */}
      {step === 3 && (
        <div className="d1-izakaya">
          <div className="d1-izakaya-hero">
            <div className="d1-izakaya-visual">
              <div className="d1-izakaya-icon">🍺</div>
              <div className="d1-izakaya-cn">國分町居酒屋</div>
            </div>
            <div className="d1-izakaya-info">
              <div className="d1-izakaya-name">男子漢<br />型男盛宴</div>
              <div className="d1-izakaya-sub">
                吃完牛舌，續攤居酒屋<br />
                暢聊男人話題，替明天滑雪暖身<br />
                <br />
                <span style={{ color: "var(--text-faint)", fontSize: "13px" }}>
                  市區晚餐建議步行或搭地鐵<br />
                  開車不喝酒，喝酒不開車
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: 早點睡 */}
      {step === 4 && (
        <div className="d1-sleep">
          <div className="d1-sleep-icon">🛌</div>
          <div className="d1-sleep-title">早點睡</div>
          <div className="d1-time-badge">08:00</div>
          <div className="d1-sleep-sub">
            明天早上八點出發<br />
            連續三天高強度衝山<br />
            體能是本錢
          </div>
        </div>
      )}
    </div>
  );
}
