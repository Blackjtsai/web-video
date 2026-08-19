import "./SplitEnding.css";

interface Props {
  baseUrl: string;
}

function MapLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="se-map-link" href={href} target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      {label}
    </a>
  );
}

const MAPS = [
  { label: "斑尾高原滑雪場", q: "Madarao Kogen Ski Resort" },
  { label: "Tangram Ski Circus", q: "Tangram Ski Circus Nagano" },
  { label: "Hotel Madam Mirei", q: "Hotel Madam Mirei Madarao" },
  { label: "飯山站", q: "Iiyama Station Japan" },
  { label: "羽田機場", q: "Haneda Airport Japan" },
];

export function SplitEnding({ baseUrl }: Props) {
  return (
    <div className="se-root">
      <div className="se-left">
        <img className="se-bg" src={`${baseUrl}images/hero.jpg`} alt="" />
        <div className="se-overlay" />
        <div className="se-left-content">
          <div className="se-end-tag">END</div>
          <div className="se-end-title">斑尾高原，我們來了。</div>
          <div className="se-end-date">2027 · 02 · 28 — 03 · 03</div>
        </div>
      </div>
      <div className="se-right">
        <div className="se-right-content">
          <div className="se-block">
            <div className="se-block-label">行程手冊</div>
            <a
              className="se-pdf-btn"
              href={`${baseUrl}2027斑尾高原滑雪行程_V1.pdf`}
              download="2027斑尾高原滑雪行程_V1.pdf"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5v-2z"/>
              </svg>
              下載行程手冊 PDF
            </a>
          </div>
          <div className="se-block">
            <div className="se-block-label">住宿聯絡</div>
            <div className="se-hotel-card">
              <div className="se-hotel-name">Hotel Madam Mirei</div>
              <div className="se-hotel-phone">2/28 – 3/3（連住 3 晚）・步行數分鐘達斑尾高原滑雪場</div>
            </div>
          </div>
          <div className="se-block">
            <div className="se-block-label">地圖導航</div>
            <div className="se-maps">
              {MAPS.map(m => (
                <MapLink
                  key={m.label}
                  href={`https://maps.google.com/?q=${encodeURIComponent(m.q)}`}
                  label={m.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
