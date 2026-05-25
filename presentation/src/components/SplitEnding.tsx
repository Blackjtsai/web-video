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
  { label: "夏天正涼民宿",        q: "澎湖縣馬公市安宅里宅腳嶼93之23號 夏天正涼民宿" },
  { label: "岐頭遊客中心（員貝集合）", q: "澎湖縣白沙鄉岐頭村16-5號 岐頭遊客中心" },
  { label: "澎湖水族館",           q: "澎湖縣白沙鄉岐頭村58號 澎湖水族館" },
  { label: "晶翔號（沙港碼頭）",    q: "澎湖白沙鄉沙港東村漁港 晶翔號" },
  { label: "觀音亭（花火節）",      q: "澎湖縣馬公市介壽路7號 觀音亭" },
  { label: "阿東餐廳",             q: "澎湖縣馬公市新店路6巷6號 阿東海鮮餐廳" },
  { label: "順順租車行",            q: "順順租車行 澎湖馬公" },
];

export function SplitEnding({ baseUrl }: Props) {
  return (
    <div className="se-root">

      {/* ── 左：封面圖 + END 文字 ── */}
      <div className="se-left">
        <img className="se-bg" src={`${baseUrl}images/cover.jpg`} alt="" />
        <div className="se-overlay" />
        <div className="se-left-content">
          <div className="se-end-tag">END</div>
          <div className="se-end-title">澎湖，我們來了。</div>
          <div className="se-end-date">2026 · 05 · 28 — 31</div>
        </div>
      </div>

      {/* ── 右：資源面板 ── */}
      <div className="se-right">
        <div className="se-right-content">

          {/* PDF 下載 */}
          <div className="se-block">
            <div className="se-block-label">行程手冊</div>
            <a
              className="se-pdf-btn"
              href={`${baseUrl}澎湖家族旅遊行程手冊.pdf`}
              download="澎湖家族旅遊行程手冊.pdf"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5v-2z"/>
              </svg>
              下載行程手冊 PDF
            </a>
          </div>

          {/* 民宿聯絡 */}
          <div className="se-block">
            <div className="se-block-label">住宿聯絡</div>
            <div className="se-hotel-card">
              <div className="se-hotel-name">夏天正涼民宿</div>
              <div className="se-hotel-phone">📞 0933-372550 &nbsp;·&nbsp; 0910-884413</div>
            </div>
          </div>

          {/* 地圖導航 */}
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
