import "./Day1.css";

interface Props { step: number; }

export default function Day1({ step }: Props) {
  return (
    <div className="d1-stage">
      <div className="d1-header">
        <div className="d1-day-tag">DAY 01 &nbsp;·&nbsp; 02.28 SUN</div>
        <div className="d1-day-title">紅眼班機・直奔志賀高原高天原</div>
      </div>

      {step === 0 && (
        <div className="d1-block">
          <div className="d1-flight-row">
            <div className="d1-node">
              <div className="d1-node-name">TPE 桃園</div>
              <div className="d1-node-time">00:10</div>
            </div>
            <div className="d1-arrow">
              <div className="d1-arrow-line" />
              <div className="d1-arrow-dur">虎航 IT</div>
            </div>
            <div className="d1-node">
              <div className="d1-node-name">HND 羽田</div>
              <div className="d1-node-time">04:00</div>
            </div>
          </div>
          <div className="d1-note-box">
            <div className="d1-note-label">紅眼班機</div>
            <div className="d1-note-text">04:00 落地，05:00–05:30 出關拿行李——凌晨落地，一整天都還在，直接接電車，不浪費半天。</div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="d1-block">
          <ul className="d1-timeline">
            <li className="d1-timeline-item">
              <span className="d1-timeline-time">05:30–06:00</span>
              <span className="d1-timeline-text">羽田機場 → 東京站</span>
            </li>
            <li className="d1-timeline-item">
              <span className="d1-timeline-time">06:30–07:00</span>
              <span className="d1-timeline-text">抵達東京站</span>
            </li>
            <li className="d1-timeline-item">
              <span className="d1-timeline-time">早班北陸新幹線</span>
              <span className="d1-timeline-text">東京 → 長野</span>
            </li>
            <li className="d1-timeline-item">
              <span className="d1-timeline-time">08:30–09:00</span>
              <span className="d1-timeline-text">抵達長野站</span>
            </li>
          </ul>
          <div className="d1-note-box">
            <div className="d1-note-label">補眠時段</div>
            <div className="d1-note-text">新幹線這段車程長，是全天唯一能好好補眠的時間，座位坐穩就閉眼。</div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="d1-block">
          <ul className="d1-timeline">
            <li className="d1-timeline-item">
              <span className="d1-timeline-time">約 09:45</span>
              <span className="d1-timeline-text">接志賀高原急行巴士</span>
            </li>
            <li className="d1-timeline-item">
              <span className="d1-timeline-time">約 1 小時 30–50 分</span>
              <span className="d1-timeline-text">長野 → 高天原</span>
            </li>
            <li className="d1-timeline-item">
              <span className="d1-timeline-time">11:20–11:40</span>
              <span className="d1-timeline-text">抵達高天原</span>
            </li>
            <li className="d1-timeline-item">
              <span className="d1-timeline-time">步行 1–2 分鐘</span>
              <span className="d1-timeline-text">巴士站 → 志賀百樂酒店</span>
            </li>
          </ul>
          <div className="d1-note-box">
            <div className="d1-note-label">抵達高天原</div>
            <div className="d1-note-text">寄行李、換裝、稍作休息。實際新幹線與巴士班次，需等 2026/27 冬季志賀高原巴士班表公布後再微調。</div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="d1-block">
          <div className="d1-hotel">
            <div className="d1-hotel-name">志賀百樂酒店</div>
            <div className="d1-hotel-en">Shiga Park Hotel</div>
            <div className="d1-hotel-tags">
              <span className="d1-tag">高天原溫泉</span>
              <span className="d1-tag">步行 2 分鐘達巴士站</span>
              <span className="d1-tag">含早晚餐</span>
            </div>
          </div>
          <div className="d1-note-box">
            <div className="d1-note-label">Check-in</div>
            <div className="d1-note-text">放下行李，先去溫泉把一天的疲勞泡掉——接下來三天是連續衝山。</div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="d1-block d1-sleep">
          <div className="d1-sleep-icon">🎿</div>
          <div className="d1-sleep-title">租裝備・休息為主</div>
          <div className="d1-sleep-sub">
            第一天以租借雪具和休息為主，養足體力應付接下來三天連滑。是否夜滑，依當季志賀高原營業規定而定，不強排。
          </div>
          <div className="d1-rental-callout">
            <div className="d1-rental-callout-label">🎿 沒帶雪具？志賀百樂酒店館內就能租（住宿客價）</div>
            <div className="d1-rental-callout-row">
              <span>Snowboard 套裝</span>
              <span>1 日 ¥3,500・2 日 ¥5,500</span>
            </div>
            <div className="d1-rental-callout-row">
              <span>Full Set（含雪衣）</span>
              <span>1 日 ¥7,000・2 日 ¥11,000</span>
            </div>
            <div className="d1-rental-callout-note">完整價目與比價，詳見「出發前必知」章節 ↓</div>
          </div>
        </div>
      )}
    </div>
  );
}
