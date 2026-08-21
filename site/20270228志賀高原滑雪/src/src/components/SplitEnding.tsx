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
  { label: "高天原巴士站",     q: "Kotanbara Bus Terminal Shiga Kogen Nagano" },
  { label: "志賀百樂酒店",     q: "Shiga Park Hotel Nagano" },
  { label: "中央區・東館山",   q: "Shiga Kogen Chuo Ski Area Nagano" },
  { label: "寺小屋雪場",       q: "Terakoya Ski Area Shiga Kogen Nagano" },
  { label: "一之瀨雪場",       q: "Ichinose Ski Area Shiga Kogen Nagano" },
  { label: "燒額山雪場",       q: "Yakebitaiyama Ski Area Shiga Kogen Nagano" },
  { label: "奧志賀高原雪場",   q: "Okushiga Kogen Ski Area Nagano" },
  { label: "長野站",           q: "Nagano Station Japan" },
];

export function SplitEnding({ baseUrl }: Props) {
  return (
    <div className="se-root">
      <div className="se-left">
        <img className="se-bg" src={`${baseUrl}images/cover.jpg`} alt="" />
        <div className="se-overlay" />
        <div className="se-left-content">
          <div className="se-end-tag">END</div>
          <div className="se-end-title">志賀高原，我們來了。</div>
          <div className="se-end-date">2027 · 02 · 28 — 03 · 04</div>
        </div>
      </div>
      <div className="se-right">
        <div className="se-right-content">
          <div className="se-block">
            <div className="se-block-label">行程手冊</div>
            <a
              className="se-pdf-btn"
              href={`${baseUrl}2027志賀高原滑雪行程_V4.pdf`}
              download="2027志賀高原滑雪行程_V4.pdf"
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
              <div className="se-hotel-name">志賀百樂酒店 Shiga Park Hotel</div>
              <div className="se-hotel-phone">2/28 – 3/3（連住 3 晚）・高天原溫泉現地・含早晚餐</div>
              <div className="se-hotel-phone">〒381-0401 長野縣下高井郡山之內町大字平穩7149・+81-269-34-2811</div>
            </div>
            <div className="se-pdf-row">
              {["房間1", "房間2", "房間3"].map(r => (
                <a key={r} className="se-pdf-btn se-pdf-btn--mini"
                  href={`${baseUrl}志賀百樂酒店訂房確認_${r}.pdf`}
                  download={`志賀百樂酒店訂房確認_${r}.pdf`}>
                  📄 訂房確認・{r}
                </a>
              ))}
            </div>
            <div className="se-pdf-row">
              <a className="se-pdf-btn se-pdf-btn--mini" target="_blank" rel="noopener noreferrer"
                href="https://www.google.com/maps/dir/?api=1&origin=Nagano+Station+Japan&destination=Shiga+Park+Hotel&travelmode=transit">
                🚌 長野站上車路線
              </a>
              <a className="se-pdf-btn se-pdf-btn--mini" target="_blank" rel="noopener noreferrer"
                href="https://www.google.com/maps/dir/?api=1&origin=Yudanaka+Station+Japan&destination=Shiga+Park+Hotel&travelmode=transit">
                🚌 湯田中站上車路線
              </a>
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
