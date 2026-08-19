import "./MustKnow.css";

interface Props { step: number; }

const BUDGET_ITEMS = [
  { label: "機票", amount: "NT$9,000" },
  { label: "住宿", amount: "NT$3,691" },
  { label: "羽田↔斑尾交通", amount: "約 NT$4,000" },
  { label: "4 日雪票", amount: "約 NT$6,600" },
  { label: "保險", amount: "NT$1,000" },
  { label: "午餐＋晚餐 4 天", amount: "NT$4,000" },
  { label: "雪具", amount: "飯店可租，比自備划算" },
];

export default function MustKnow({ step }: Props) {
  return (
    <div className="mk-stage">
      <div className="mk-header">
        <div className="mk-tag">住宿與出發前必知</div>
        <div className="mk-title">別到了雪場才手忙腳亂</div>
      </div>

      {step === 0 && (
        <div className="mk-block">
          <div className="mk-hotel">
            <div className="mk-hotel-name">Hotel Madam Mirei</div>
            <div className="mk-hotel-en">2/28 入住・3/3 退房・3 房 3 晚・6 人</div>
            <div className="mk-hotel-tags">
              <span className="mk-tag-pill">步行數分鐘達斑尾高原滑雪場</span>
              <span className="mk-tag-pill">斑尾高原口前巴士站步行可達</span>
              <span className="mk-tag-pill">簡單實用・便宜好入手</span>
            </div>
          </div>
          <div className="mk-note-box">
            <div className="mk-note-label">住宿費用</div>
            <div className="mk-note-text">總價約 NT$22,146，平均每人約 NT$3,691。</div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mk-block">
          <div className="mk-budget-card">
            <div className="mk-budget-label">參考預算・每人</div>
            <div className="mk-budget-table">
              {BUDGET_ITEMS.map(b => (
                <div key={b.label} className="mk-budget-row">
                  <span className="mk-budget-name">{b.label}</span>
                  <span className="mk-budget-amount">{b.amount}</span>
                </div>
              ))}
            </div>
            <div className="mk-budget-total">
              <span>目前合計約</span>
              <span className="mk-budget-total-amount">NT$28,300</span>
            </div>
            <div className="mk-budget-suggest">建議整數抓 NT$30,000／人，多留彈性空間應付飲料、超商消費、票價調整或夜滑等額外開銷。</div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mk-block">
          <div className="mk-warn">
            <div className="mk-warn-label">⚠ 行李與保險</div>
            <div className="mk-warn-text">
              虎航屬廉價航空，行李有嚴格的手提與託運重量限制，若自己攜帶雪板雪靴需另外加購託運額度，
              建議直接在 Hotel Madam Mirei 現場租借雪具，省去搭機扛裝備的麻煩也更便宜，出發前先確認尺寸與租借價目。
              滑雪保險也不能少，務必投保涵蓋雪上活動意外的旅遊平安險，出發前確認保單條款涵蓋滑雪項目。
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mk-block">
          <div className="mk-note-box">
            <div className="mk-note-label">V1 規劃基準・待確認</div>
            <div className="mk-note-text">
              本次 V1 規劃是以 2025、26 年季的新幹線班表、斑尾冬季巴士與雪票資訊估算，
              2026、27 正式班表、夜滑日期與新雪季票價公布後仍需要再次確認調整。
            </div>
          </div>
          <div className="mk-note-box">
            <div className="mk-note-label">現金與交通卡</div>
            <div className="mk-note-text">
              日幣現金要備妥，山區小店與部分巴士只收現金，建議先在東京站換好足額日幣；
              東京市區段可搭配 Suica 或 Pasmo 交通卡轉乘更方便，但斑尾當地巴士通常需要另外購票，別忘了預留足夠現金與時間。
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
