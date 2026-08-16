import "./NaganoOverview.css";

interface Props { step: number; }

type ResortKey = "hakuba" | "shiga" | "nozawa";

const RESORTS: { key: ResortKey; name: string; en: string; img?: string; tag: string; desc: string; picked?: boolean }[] = [
  {
    key: "hakuba",
    name: "白馬山谷",
    en: "Hakuba Valley",
    img: "hakuba.jpg",
    tag: "1998 冬奧主場",
    desc: "雪道多樣、極具挑戰性，歐美度假村氛圍與豐富夜生活，國際化程度最高。",
  },
  {
    key: "nozawa",
    name: "野澤溫泉",
    en: "Nozawa Onsen",
    img: "nozawa.jpg",
    tag: "傳統溫泉街",
    desc: "長達 5 公里林間雪道，滑雪後漫步日式溫泉街，享受天然足湯。",
  },
  {
    key: "shiga",
    name: "志賀高原",
    en: "Shiga Kogen",
    img: "day1.jpg",
    tag: "本次行程",
    desc: "日本最大且海拔最高的連通滑雪區域，高海拔造就極佳粉雪，雪季 11 月下旬～隔年 5 月。",
    picked: true,
  },
];

export default function NaganoOverview({ step }: Props) {
  const base = import.meta.env.BASE_URL;
  const activeKey: ResortKey | null =
    step === 1 ? "hakuba" : step === 2 ? "shiga" : step === 3 ? "nozawa" : null;

  return (
    <div className="no-stage">
      {step === 0 && (
        <div className="no-intro">
          <div className="no-intro-sub">Nagano · Before Shiga Kogen</div>
          <div className="no-intro-title">長野縣，日本滑雪的心臟地帶</div>
          <div className="no-intro-stats">
            <div className="no-stat">
              <div className="no-stat-num">70+</div>
              <div className="no-stat-label">世界級滑雪場</div>
            </div>
            <div className="no-stat">
              <div className="no-stat-num">80–110</div>
              <div className="no-stat-label">新幹線抵達分鐘數</div>
            </div>
            <div className="no-stat">
              <div className="no-stat-num">3</div>
              <div className="no-stat-label">三大核心滑雪勝地</div>
            </div>
          </div>
          <div className="no-intro-note">
            東京搭北陸新幹線直達，三大核心勝地各有個性——白馬村、野澤溫泉、志賀高原。
          </div>
        </div>
      )}

      {step > 0 && (
        <div className="no-compare">
          <div className="no-compare-title">三大核心雪場，為什麼選志賀高原</div>
          <div className="no-compare-row">
            {RESORTS.map((r) => (
              <div
                key={r.key}
                className={`no-card ${r.picked ? "no-card--picked" : ""} ${
                  activeKey === r.key ? "no-card--active" : activeKey ? "no-card--dim" : ""
                }`}
              >
                <div className="no-card-imgwrap">
                  <img className="no-card-img" src={`${base}images/${r.img}`} alt={r.name} />
                  <span className={`no-card-tag ${r.picked ? "no-card-tag--picked" : ""}`}>{r.tag}</span>
                </div>
                <div className="no-card-body">
                  <div className="no-card-name">{r.name}</div>
                  <div className="no-card-en">{r.en}</div>
                  <div className="no-card-desc">{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
