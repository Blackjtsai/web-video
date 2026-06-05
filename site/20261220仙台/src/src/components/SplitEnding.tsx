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
  { label: "仙台機場",            q: "仙台空港 宮城県名取市" },
  { label: "仙台大都會飯店",       q: "Hotel Metropolitan Sendai 仙台駅" },
  { label: "みやぎ藏王 Eboshi",   q: "みやぎ蔵王えぼしリゾート 宮城県刈田郡蔵王町" },
  { label: "藏王溫泉飯店",        q: "蔵王国際ホテル 山形県山形市蔵王温泉" },
  { label: "山形藏王溫泉滑雪場",  q: "蔵王温泉スキー場 山形県山形市蔵王温泉" },
  { label: "Spring Valley 仙台泉", q: "スプリングバレー仙台泉 宮城県仙台市" },
  { label: "仙台港三井 Outlet",   q: "三井アウトレットパーク仙台港" },
];

export function SplitEnding({ baseUrl }: Props) {
  return (
    <div className="se-root">
      <div className="se-left">
        <div className="se-bg-gradient" />
        <div className="se-left-content">
          <div className="se-end-tag">END</div>
          <div className="se-end-title">仙台，我們來了。</div>
          <div className="se-end-date">2026 · 12 · 20 — 24</div>
        </div>
      </div>
      <div className="se-right">
        <div className="se-right-content">
          <div className="se-block">
            <div className="se-block-label">行程手冊</div>
            <a
              className="se-pdf-btn"
              href={`${baseUrl}20261220仙台.pdf`}
              download="20261220仙台.pdf"
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
              <div className="se-hotel-name">Hotel Metropolitan Sendai</div>
              <div className="se-hotel-phone">仙台市青葉区中央1丁目1-1</div>
            </div>
            <div className="se-hotel-card">
              <div className="se-hotel-name">蔵王国際ホテル</div>
              <div className="se-hotel-phone">山形市蔵王温泉951</div>
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
