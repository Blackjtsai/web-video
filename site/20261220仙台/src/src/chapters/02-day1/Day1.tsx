import "./Day1.css";

interface Props { step: number; }

const CHECKS = [
  "雪胎（Studless Tires）確認",
  "4WD / AWD 確認",
  "ETC 卡租借",
  "右駕手感熱身",
  "20:00 取車卡在營業時間收班邊緣，班機若延誤務必電話聯繫店家",
];

const CHECKIN_CHECKS = [
  "住宿是否接受 21:30 後入住",
  "飯店停車場在積雪時的入口與位置",
  "若櫃檯關閉，鑰匙如何領取",
  "附近餐廳很可能已打烊，先在機場或途中補給",
];

export default function Day1({ step }: Props) {
  return (
    <div className="d1-stage">
      <div className="d1-header">
        <div className="d1-day-tag">DAY 01 &nbsp;·&nbsp; 12.20 SUN</div>
        <div className="d1-day-title">抵達仙台・直奔藏王</div>
      </div>

      {/* Step 0: 機場抵達 */}
      {step === 0 && (
        <div className="d1-arrive">
          <div className="d1-flight-row">
            <div className="d1-airport-node">
              <div className="d1-airport-name">TPE 桃園</div>
              <div className="d1-airport-time">14:35</div>
            </div>
            <div className="d1-flight-arrow">
              <div className="d1-flight-line" />
              <div className="d1-flight-dur">IT254 · 3h10m</div>
            </div>
            <div className="d1-airport-node">
              <div className="d1-airport-name">SDJ 仙台</div>
              <div className="d1-airport-time">18:45</div>
            </div>
          </div>
          <div className="d1-note-box">
            <div className="d1-note-label">機場取車流程</div>
            <div className="d1-note-text">
              出關 → 1 樓到達大廳租車櫃檯（Nissan Rent-A-Car）<br />
              辦手續 → 搭免費接駁車 ~5 分鐘 → 仙台機場店取車
            </div>
          </div>
          <div className="d1-route">
            <div className="d1-route-node">
              <div className="d1-route-icon">🛬</div>
              <div className="d1-route-label">到達大廳</div>
              <div className="d1-route-sub">1F 出關口</div>
            </div>
            <div className="d1-route-arrow">→</div>
            <div className="d1-route-node">
              <div className="d1-route-icon">🚗</div>
              <div className="d1-route-label">日產租車櫃檯</div>
              <div className="d1-route-sub">辦手續 / Check-in</div>
            </div>
            <div className="d1-route-arrow">→</div>
            <div className="d1-route-node">
              <div className="d1-route-icon">🚐</div>
              <div className="d1-route-label">免費接駁車</div>
              <div className="d1-route-sub">約 5 分鐘</div>
            </div>
            <div className="d1-route-arrow">→</div>
            <div className="d1-route-node">
              <div className="d1-route-icon">🏢</div>
              <div className="d1-route-label">仙台機場店</div>
              <div className="d1-route-sub">20:00 取車</div>
            </div>
          </div>
          <div className="d1-address">
            宮城縣名取市下增田字小沼28-1 ・ 022-383-2823 ・ 營業時間 08:00–20:00
          </div>
        </div>
      )}

      {/* Step 1: 取車確認清單 */}
      {step === 1 && (
        <div className="d1-hotel-block">
          <div className="d1-info-row">
            <div className="d1-info-item">
              <div className="d1-info-label">車型</div>
              <div className="d1-info-value">NISSAN SERENA</div>
              <div className="d1-info-sub">(W4) · 4WD + 無釘雪胎<br />5 人 5 套雪具 + 行李從容</div>
            </div>
            <div className="d1-info-item">
              <div className="d1-info-label">飯店</div>
              <div className="d1-info-value">オーベルジュ樹氷</div>
              <div className="d1-info-sub">Auberge Juhyo<br />藏王溫泉現地・滑雪場旁</div>
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

      {/* Step 2: 直奔藏王 */}
      {step === 2 && (
        <div className="d1-arrive">
          <div className="d1-flight-row">
            <div className="d1-airport-node">
              <div className="d1-airport-name">仙台機場</div>
              <div className="d1-airport-time">20:20</div>
            </div>
            <div className="d1-flight-arrow">
              <div className="d1-flight-line" />
              <div className="d1-flight-dur">約 90km · 1h20m</div>
            </div>
            <div className="d1-airport-node">
              <div className="d1-airport-name">藏王溫泉</div>
              <div className="d1-airport-time">21:40</div>
            </div>
          </div>
          <div className="d1-note-box">
            <div className="d1-note-label">夜間山路自駕注意</div>
            <div className="d1-note-text">
              不進仙台市區，出關取車後直接上山<br />
              冬季山路建議抓 1.5 小時以上，注意黑冰、拉大車距
            </div>
          </div>
        </div>
      )}

      {/* Step 3: 晚到入住 + 早點睡 */}
      {step === 3 && (
        <div className="d1-hotel-block">
          <div className="d1-checklist">
            <div className="d1-note-label" style={{ marginBottom: 4 }}>第一晚不能漏掉的確認</div>
            {CHECKIN_CHECKS.map((c, i) => (
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
          <div className="d1-sleep">
            <div className="d1-sleep-icon">🛌</div>
            <div className="d1-sleep-title">簡單晚餐・早點睡</div>
            <div className="d1-time-badge">08:00</div>
            <div className="d1-sleep-sub">
              明天早上八點出發<br />
              連續三天高強度衝山，體能是本錢
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
