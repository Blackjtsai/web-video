import "./MustKnow.css";

interface Props { step: number; }

const DOCS = [
  { name: "台灣駕照正本", note: "出國前確認有效期限", hint: "必備" },
  { name: "日文譯本正本", note: "監理所辦理，規費 NT$100", hint: "必備" },
  { name: "駕駛人護照", note: "與訂位時使用的信用卡", hint: "必備" },
];

const MUST_ITEMS = [
  "雪胎（Studless Tires） — 宮城/山形12月全面入雪季",
  "4WD / AWD — 山路結冰陡坡的安全保障",
  "ETC 卡 — 建議加購，可辦東北高速公路護照省過路費",
];

const DRIVE_RULES = [
  { num: "01", text: "進山區可能出現黑冰（Black Ice）\n拉大與前車距離，切勿急煞" },
  { num: "02", text: "傍晚翻越山脈極易起霧或降大雪\n開啟霧燈並減速慢行" },
  { num: "03", text: "開車不喝酒，喝酒不開車\n市區晚餐請步行或搭地鐵" },
];

const SKI_INFO = [
  { resort: "Eboshi", lift: "5小時 / 全日", gear: "可現場租借", note: "宮城縣最大，4.3km 超長滑道" },
  { resort: "山形藏王", lift: "全日（推薦）", gear: "溫泉街配合店", note: "橫跨多山頭，12月樹冰奇景" },
  { resort: "Spring Valley", lift: "夜滑 17:00-22:00", gear: "現場租借", note: "人工造雪 + 公園區，極速感" },
];

const FOOD_LIST = [
  { name: "仙台牛舌", shop: "司（Tsukasa）", note: "厚切炭火燒，多汁有嚼勁", delay: "0ms" },
  { name: "山形牛壽喜燒", shop: "藏王溫泉飯店", note: "A5 和牛，飯後泡溫泉", delay: "100ms" },
  { name: "成吉思汗烤羊肉", shop: "ろばた（溫泉街）", note: "東北名物，搭配生啤酒", delay: "200ms" },
  { name: "深夜拉麵", shop: "仙台市區隨便走", note: "三連戰後的最好句點", delay: "300ms" },
];

export default function MustKnow({ step }: Props) {
  return (
    <div className="mk-stage">
      <div className="mk-header">
        <div className="mk-chapter-tag">MUST-KNOW &nbsp;·&nbsp; 出發前必知</div>
        <div className="mk-chapter-title">自駕攻略 & 東北美食</div>
      </div>

      {/* Step 0: 必備證件 */}
      {step === 0 && (
        <div className="mk-license">
          <div className="mk-docs-row">
            {DOCS.map((d, i) => (
              <div
                key={i}
                className="mk-doc-card mk-doc-card--visible"
                style={{ animationDelay: `${i * 130}ms` }}
              >
                <div className="mk-doc-name">{d.name}</div>
                <div className="mk-doc-note">{d.note}</div>
                <div className="mk-doc-hint">{d.hint}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: 租車攻略 */}
      {step === 1 && (
        <div className="mk-rental">
          <div className="mk-rental-row">
            <div className="mk-car-block">
              <div className="mk-car-label">推薦車型</div>
              <div className="mk-car-name">中型 SUV</div>
              <div className="mk-car-sub">
                Toyota RAV4 / Subaru Forester<br />
                3人 + 3套滑雪板 + 大型行李箱<br />
                後車廂空間必須充足
              </div>
            </div>
            <div className="mk-car-block">
              <div className="mk-car-label">費用參考</div>
              <div className="mk-car-name">租車費用</div>
              <div className="mk-car-sub">
                5天約 ¥60,000–80,000<br />
                Winter Season Fee（雪胎費）<br />
                另加 ETC 卡租金
              </div>
            </div>
          </div>
          <div className="mk-must-items">
            <div className="mk-must-label">必選配備</div>
            {MUST_ITEMS.map((item, i) => (
              <div
                key={i}
                className="mk-must-item mk-must-item--visible"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="mk-must-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: 雪地自駕 */}
      {step === 2 && (
        <div className="mk-drive">
          <div className="mk-drive-title">雪地自駕<br />三個原則</div>
          <div className="mk-rules">
            {DRIVE_RULES.map((r, i) => (
              <div
                key={i}
                className="mk-rule-item mk-rule-item--visible"
                style={{ animationDelay: `${i * 130}ms` }}
              >
                <div className="mk-rule-num">{r.num}</div>
                <div className="mk-rule-text" style={{ whiteSpace: "pre-line" }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: 滑雪場資訊 */}
      {step === 3 && (
        <div className="mk-ski">
          <table className="mk-sv1-table">
            <thead>
              <tr>
                <th>雪場</th>
                <th>纜車券</th>
                <th>雪具租借</th>
                <th>特色</th>
              </tr>
            </thead>
            <tbody>
              {SKI_INFO.map((s, i) => (
                <tr key={i}>
                  <td>{s.resort}</td>
                  <td>{s.lift}</td>
                  <td>{s.gear}</td>
                  <td>{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mk-ski-tip">
            ⚠ 夜滑要帶面罩，風很大；強酸性溫泉記得取下銀飾
          </div>
        </div>
      )}

      {/* Step 4: 東北美食 */}
      {step === 4 && (
        <div className="mk-food">
          <div className="mk-food-grid">
            {FOOD_LIST.map((f, i) => (
              <div
                key={i}
                className="mk-food-card mk-food-card--visible"
                style={{ animationDelay: f.delay }}
              >
                <div className="mk-food-name">{f.name}</div>
                <div className="mk-food-shop">{f.shop}</div>
                <div className="mk-food-note">{f.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
