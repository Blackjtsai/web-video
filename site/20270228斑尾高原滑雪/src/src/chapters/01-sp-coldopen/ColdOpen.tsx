import "./ColdOpen.css";

interface Props { step: number; }

const HIGHLIGHTS = [
  { label: "飯山 → 斑尾", value: "約 30 分鐘車程" },
  { label: "第一天開滑", value: "理想約 10:30" },
  { label: "住宿基地", value: "Hotel Madam Mirei" },
  { label: "距滑雪場", value: "步行數分鐘" },
];

export default function ColdOpen({ step }: Props) {
  const base = import.meta.env.BASE_URL;

  return (
    <div className="co-stage">
      {step === 0 && (
        <div className="co-hero">
          <img className="co-hero-bg" src={`${base}images/hero.jpg`} aria-hidden alt="" />
          <img className="co-hero-img" src={`${base}images/hero.jpg`} alt="斑尾高原雪景" />
          <div className="co-hero-overlay">
            <div className="co-hero-sub">Madarao Kogen · Nagano · 2027.02.28 — 03.03</div>
            <div className="co-hero-title">斑尾高原<br />四日滑雪</div>
            <div className="co-hero-badges">
              <span className="co-badge">6 人成行</span>
              <span className="co-badge">3 晚 4 日</span>
              <span className="co-badge">虎航羽田直飛</span>
              <span className="co-badge">約 NT$28,300／人</span>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="co-overview">
          <img className="co-overview-bg" src={`${base}images/overview.jpg`} alt="斑尾高原村莊與纜車" />
          <div className="co-overview-scrim" />
          <div className="co-overview-content">
            <div className="co-overview-title">全程公共交通，把雪季時光用到最極致</div>
            <div className="co-overview-note">
              第一天抵達羽田後直衝斑尾，最後一天滑到下午再撤回機場——
              飯山到雪場只要約 30 分鐘，是本行程最大的優勢。
            </div>
            <div className="co-overview-grid">
              {HIGHLIGHTS.map(h => (
                <div key={h.label} className="co-overview-item">
                  <div className="co-overview-item-label">{h.label}</div>
                  <div className="co-overview-item-value">{h.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
