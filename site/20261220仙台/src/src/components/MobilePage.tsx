import { useEffect, useRef, useState } from "react";
import "./MobilePage.css";
import TrailMap from "./TrailMap";

function MapBtn({ q }: { q: string }) {
  return (
    <a
      href={`https://maps.google.com/?q=${encodeURIComponent(q)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mp-map-btn"
      aria-label="開啟 Google 地圖"
      onClick={e => e.stopPropagation()}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </a>
  );
}

function DocBtn({ href, download }: { href: string; download: string }) {
  return (
    <a
      href={href}
      download={download}
      className="mp-map-btn"
      aria-label="下載訂單 PDF"
      onClick={e => e.stopPropagation()}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5v-2z"/>
      </svg>
    </a>
  );
}

/* 32 段口播，對應頁面卡片 */
const SEGMENTS = [
  // coldopen 1-4
  { id: "coldopen", step: 1, cardId: "mp-s-hero" },
  { id: "coldopen", step: 2, cardId: "mp-s-hero" },
  { id: "coldopen", step: 3, cardId: "mp-s-hero" },
  { id: "coldopen", step: 4, cardId: "mp-s-hero" },
  // day1 1-4
  { id: "day1", step: 1, cardId: "mp-c-d1-arrive" },
  { id: "day1", step: 2, cardId: "mp-c-d1-hotel" },
  { id: "day1", step: 3, cardId: "mp-c-d1-drive" },
  { id: "day1", step: 4, cardId: "mp-c-d1-checkin" },
  // day2 1-5
  { id: "day2", step: 1, cardId: "mp-s-day2" },
  { id: "day2", step: 2, cardId: "mp-c-d2-eboshi" },
  { id: "day2", step: 3, cardId: "mp-c-d2-skiday" },
  { id: "day2", step: 4, cardId: "mp-c-d2-dinner" },
  { id: "day2", step: 5, cardId: "mp-c-d2-onsen" },
  // day3 1-5
  { id: "day3", step: 1, cardId: "mp-s-day3" },
  { id: "day3", step: 2, cardId: "mp-c-d3-zao" },
  { id: "day3", step: 3, cardId: "mp-c-d3-zao" },
  { id: "day3", step: 4, cardId: "mp-c-d3-bath" },
  { id: "day3", step: 5, cardId: "mp-c-d3-genghis" },
  // day4 1-5
  { id: "day4", step: 1, cardId: "mp-s-day4" },
  { id: "day4", step: 2, cardId: "mp-c-d4-lunch" },
  { id: "day4", step: 3, cardId: "mp-c-d4-valley" },
  { id: "day4", step: 4, cardId: "mp-c-d4-valley" },
  { id: "day4", step: 5, cardId: "mp-c-d4-ramen" },
  // day5 1-4
  { id: "day5", step: 1, cardId: "mp-s-day5" },
  { id: "day5", step: 2, cardId: "mp-c-d5-outlet" },
  { id: "day5", step: 3, cardId: "mp-c-d5-return" },
  { id: "day5", step: 4, cardId: "mp-c-d5-farewell" },
  // must-know 1-5
  { id: "must-know", step: 1, cardId: "mp-c-mk-license" },
  { id: "must-know", step: 2, cardId: "mp-c-mk-rental" },
  { id: "must-know", step: 3, cardId: "mp-c-mk-drive" },
  { id: "must-know", step: 4, cardId: "mp-c-mk-ski" },
  { id: "must-know", step: 5, cardId: "mp-c-mk-food" },
];

const CHAPTER_GROUPS = [
  { label: "開場",   start: 0,  end: 3  },
  { label: "Day 1",  start: 4,  end: 7  },
  { label: "Day 2",  start: 8,  end: 12 },
  { label: "Day 3",  start: 13, end: 17 },
  { label: "Day 4",  start: 18, end: 22 },
  { label: "Day 5",  start: 23, end: 26 },
  { label: "出發前", start: 27, end: 31 },
];

function scrollToCard(idx: number) {
  const seg = SEGMENTS[idx];
  if (!seg) return;
  const el = document.getElementById(seg.cardId);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function MobileAudioFab({ baseUrl }: { baseUrl: string }) {
  const [playing, setPlaying]       = useState(false);
  const [index, setIndex]           = useState(0);
  const [showScrubber, setShowScrubber] = useState(false);
  const [scrubIdx, setScrubIdx]     = useState(0);
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const indexRef    = useRef(index);
  const lpTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  indexRef.current  = index;

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.addEventListener("ended", () => {
      const next = indexRef.current + 1;
      if (next < SEGMENTS.length) setIndex(next);
      else { setPlaying(false); setIndex(0); }
    });
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  useEffect(() => { scrollToCard(index); }, [index]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const seg = SEGMENTS[index];
    if (!seg) return;
    if (playing) { audio.src = `${baseUrl}audio/${seg.id}/${seg.step}.mp3`; audio.play().catch(() => {}); }
    else audio.pause();
  }, [index, playing, baseUrl]);

  const longFired  = useRef(false);
  const startPos   = useRef<{ x: number; y: number } | null>(null);

  const openScrubber = () => {
    longFired.current = true;
    setPlaying(false);
    setScrubIdx(index);
    setShowScrubber(true);
    if (navigator.vibrate) navigator.vibrate(40);
  };
  const cancelLongPress = () => {
    if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; }
  };
  const handlePointerDown = (e: React.PointerEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    longFired.current = false;
    lpTimer.current = setTimeout(openScrubber, 500);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startPos.current || !lpTimer.current) return;
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);
    if (dx > 8 || dy > 8) cancelLongPress();
  };
  const handlePointerUp = () => cancelLongPress();
  const handleClick = () => {
    if (longFired.current) { longFired.current = false; return; }
    if (!showScrubber) setPlaying(p => !p);
  };
  const confirmScrub = (idx: number) => {
    setShowScrubber(false);
    setIndex(idx);
    setPlaying(true);
  };

  const circ = 125.7;
  const dash = circ - (index / SEGMENTS.length) * circ;

  return (
    <>
      <button
        className={`mp-audio-fab ${playing ? "mp-audio-fab--playing" : ""}`}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={cancelLongPress}
        onPointerCancel={cancelLongPress}
        aria-label={playing ? "暫停" : "播放口播導覽"}
        style={{ touchAction: "none" }}
      >
        <svg className="mp-fab-ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle cx="22" cy="22" r="20" className="mp-fab-ring-bg" />
          <circle cx="22" cy="22" r="20" className="mp-fab-ring-fill"
            strokeDasharray={circ} strokeDashoffset={dash} />
        </svg>
        <span className="mp-fab-icon">{playing ? "⏸" : "🔊"}</span>
      </button>
      {showScrubber && (
        <div className="mp-scrubber-overlay" onPointerDown={() => setShowScrubber(false)}>
          <div className="mp-scrubber-sheet" onPointerDown={e => e.stopPropagation()}>
            <div className="mp-scrubber-handle" />
            <div className="mp-scrubber-current">
              <span className="mp-scrubber-current-ch">
                {CHAPTER_GROUPS.find(c => scrubIdx >= c.start && scrubIdx <= c.end)?.label}
              </span>
              <span className="mp-scrubber-current-num">{scrubIdx + 1} / {SEGMENTS.length}</span>
            </div>
            <div className="mp-scrubber-chips">
              {CHAPTER_GROUPS.map(ch => (
                <button
                  key={ch.label}
                  className={`mp-scrubber-chip ${scrubIdx >= ch.start && scrubIdx <= ch.end ? "mp-scrubber-chip--active" : ""}`}
                  onPointerDown={e => { e.stopPropagation(); setScrubIdx(ch.start); scrollToCard(ch.start); }}
                >{ch.label}</button>
              ))}
            </div>
            <input
              type="range" className="mp-scrubber-range"
              min={0} max={SEGMENTS.length - 1} value={scrubIdx}
              onChange={e => { const v = Number(e.target.value); setScrubIdx(v); scrollToCard(v); }}
            />
            <div className="mp-scrubber-ticks">
              {CHAPTER_GROUPS.map(ch => (
                <span key={ch.label} className="mp-scrubber-tick"
                  style={{ left: `${(ch.start / (SEGMENTS.length - 1)) * 100}%` }}>
                  {ch.label}
                </span>
              ))}
            </div>
            <button className="mp-scrubber-confirm" onPointerDown={() => confirmScrub(scrubIdx)}>
              從這裡播放
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface Props { baseUrl: string; }

export function MobilePage({ baseUrl }: Props) {
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    root.style.overflowY = "auto";
    root.style.overflowX = "hidden";
    root.style.height    = "100dvh";
    root.scrollTop = 0;
    return () => { root.style.overflowY = ""; root.style.overflowX = ""; root.style.height = ""; };
  }, []);

  const isLineBrowser = navigator.userAgent.indexOf('Line/') > -1;

  return (
    <div className="mp-root">
      {isLineBrowser && (
        <div className="mp-line-banner">
          請點右上角<strong> ··· </strong>→<strong> 在瀏覽器中開啟 </strong>以獲得最佳體驗
        </div>
      )}

      {/* ── Hero ── */}
      <div id="mp-s-hero" className="mp-hero">
        <div className="mp-hero-gradient" style={{ ["--hero-bg-image" as string]: `url('${import.meta.env.BASE_URL}images/spots/zao.jpg') center/cover no-repeat` }}>
          {/* 雪花 */}
          <div className="mp-hero-snow" aria-hidden="true">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="mp-hero-flake"
                style={{
                  left: `${(i * 5.2 + 2) % 98}%`,
                  width:  i % 3 === 0 ? "5px" : i % 3 === 1 ? "3px" : "2px",
                  height: i % 3 === 0 ? "5px" : i % 3 === 1 ? "3px" : "2px",
                  animationDelay:    `${(i * 0.35) % 4}s`,
                  animationDuration: `${4 + (i % 5) * 0.6}s`,
                }}
              />
            ))}
          </div>

          <div className="mp-hero-text">
            <div className="mp-hero-sub">純爺們東北雪季自駕</div>
            <div className="mp-hero-title">仙台滑雪</div>
            <div className="mp-hero-dates">2026 / 12 / 20 &nbsp;—&nbsp; 12 / 24</div>
            <div className="mp-hero-badges">
              <span className="mp-badge">五人成行</span>
              <span className="mp-badge">五天四夜</span>
              <span className="mp-badge">滑雪三日</span>
            </div>
          </div>

          {/* 五位滑雪小人 */}
          <div className="mp-hero-members">
            {[
              { icon: "🏂", label: "型男一號" },
              { icon: "⛷️", label: "型男二號" },
              { icon: "🎿", label: "型男三號" },
              { icon: "🏔️", label: "型男四號" },
              { icon: "❄️", label: "型男五號" },
            ].map((m, i) => (
              <div key={i} className="mp-hero-member" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="mp-hero-member-avatar">
                  <span className="mp-hero-member-icon">{m.icon}</span>
                </div>
                <div className="mp-hero-member-num">0{i + 1}</div>
                <div className="mp-hero-member-label">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="mp-hero-members-tag">FIVE MEN · ONE MISSION · PURE POWDER</div>
        </div>
      </div>

      {/* ── Day 1 ── */}
      <section id="mp-s-day1" className="mp-day">
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 1</span>
          <span className="mp-day-date">12月20日（日）・直奔藏王</span>
        </div>

        <div id="mp-c-d1-arrive" className="mp-card">
          <img src="images/spots/sendai-airport.jpg" alt="仙台機場" className="mp-card-img" />
          <div className="mp-card-title">✈️ IT254 去程班機</div>
          <div className="mp-row-between mp-vcenter" style={{ padding: "14px 0", marginTop: 14, borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">TPE 桃園</div>
              <div className="mp-flight-time">14:35</div>
            </div>
            <div className="mp-flight-mid">虎航 · 3h10m →</div>
            <div className="mp-flight-node" style={{ textAlign: "right" }}>
              <div className="mp-flight-airport">SDJ 仙台</div>
              <div className="mp-flight-time">18:45</div>
            </div>
          </div>
          <div className="mp-muted" style={{ marginBottom: 8 }}>落地後直衝 1F 租車，勿在機場逗留</div>
          <div className="mp-card-title mp-card-title--row" style={{ marginTop: 10 }}>
            <span>🚗 機場取車</span>
            <div style={{ display: "flex", gap: 8 }}>
              <MapBtn q="日産レンタカー仙台空港店 宮城県名取市下増田字小沼28-1" />
              <DocBtn href={`${baseUrl}docs/仙台租車訂單.pdf`} download="仙台租車訂單.pdf" />
            </div>
          </div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">取車門市</div>
              <div className="mp-col-val">Nissan Rent-A-Car<br />仙台機場店</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">實際車型</div>
              <div className="mp-col-val">NISSAN SERENA<br />(W4)・4WD + 無釘雪胎</div>
            </div>
          </div>
          <div className="mp-note" style={{ color: "var(--text)", fontWeight: 600 }}>出關 → 1F 到達大廳租車櫃檯 → 辦手續 → 免費接駁車 ~5 min → 仙台機場店取車</div>
          <div className="mp-muted" style={{ marginTop: 4 }}>宮城縣名取市下增田字小沼28-1・022-383-2823・營業 08:00–20:00</div>
          <div className="mp-muted" style={{ marginTop: 6, fontWeight: 600 }}>取車確認清單</div>
          {["雪胎（Studless Tires）確認", "4WD / AWD 確認", "ETC 卡租借", "右駕手感熱身", "20:00 取車卡在收班邊緣，班機延誤務必電話聯繫店家"].map((c, i) => (
            <div key={i} className="mp-list-item">
              <div className="mp-list-name">✓ {c}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-d1-hotel" className="mp-card">
          <img src="images/spots/zao-onsen.jpg" alt="オーベルジュ樹氷" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--row">
            <span>🏨 藏王溫泉飯店（連住3晚）</span>
            <MapBtn q="Auberge Juhyo 山形県山形市蔵王温泉" />
          </div>
          <div className="mp-highlight">オーベルジュ樹氷 Auberge Juhyo</div>
          <div className="mp-muted">藏王溫泉現地・滑雪場旁・5人5套雪具，行李從容</div>
        </div>

        <div id="mp-c-d1-drive" className="mp-card">
          <img src="images/spots/snow-road.jpg" alt="直奔藏王" className="mp-card-img" />
          <div className="mp-card-title">🚗 不進仙台市區，直奔藏王</div>
          <div className="mp-row-between mp-vcenter" style={{ padding: "14px 0", marginTop: 14, borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">仙台機場</div>
              <div className="mp-flight-time">20:20</div>
            </div>
            <div className="mp-flight-mid">約 90km · 1h20m →</div>
            <div className="mp-flight-node" style={{ textAlign: "right" }}>
              <div className="mp-flight-airport">藏王溫泉</div>
              <div className="mp-flight-time">21:40</div>
            </div>
          </div>
          <div className="mp-note">冬季山路建議抓 1.5 小時以上・注意黑冰、拉大車距</div>
        </div>

        <div id="mp-c-d1-checkin" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">🔑 第一晚不能漏掉的確認</div>
          {[
            "住宿是否接受 21:30 後入住",
            "飯店停車場積雪時的入口與位置",
            "若櫃檯關閉，鑰匙如何領取",
            "附近餐廳很可能已打烊，先在機場補給",
          ].map((c, i) => (
            <div key={i} className="mp-list-item">
              <div className="mp-list-name" style={{ color: "var(--text-2)" }}>✓ {c}</div>
            </div>
          ))}
          <div className="mp-big-light" style={{ marginTop: 10 }}>08:00 出發</div>
          <div className="mp-muted-light">簡單晚餐、早點休息，連續三天高強度衝山，體能是本錢</div>
        </div>
      </section>

      {/* ── Day 2 ── */}
      <section id="mp-s-day2" className="mp-day">
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 2</span>
          <span className="mp-day-date">12月21日（一）・藏王溫泉 熟悉日</span>
        </div>

        <div id="mp-c-d2-sched" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">🗓 今日行程（不用開車）</div>
          {[
            { time: "07:30", title: "飯店早餐、換裝", sub: "確認雪場與纜車開放狀況" },
            { time: "08:30", title: "前往租借店／纜車站", sub: "租裝備、購 Lift 券" },
            { time: "09:00", title: "上午滑行", sub: "熟悉雪況與回飯店方向" },
            { time: "16:00", title: "收板回飯店", sub: "就在雪場旁，不用開車" },
          ].map((t, i) => (
            <div key={i} className="mp-list-item">
              <div className="mp-list-name"><span style={{ color: "var(--accent)", fontWeight: 700, marginRight: 8 }}>{t.time}</span>{t.title}</div>
              <div className="mp-list-sub">{t.sub}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-d2-eboshi" className="mp-card">
          <img src="images/spots/zao.jpg" alt="山形藏王溫泉滑雪場" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--row">
            <span>⛷️ 山形藏王溫泉滑雪場（Day 1 熟悉）</span>
            <MapBtn q="蔵王温泉スキー場 山形県山形市蔵王温泉" />
          </div>
          <div className="mp-row-between mp-time-row">
            <div className="mp-flight-node">
              <div className="mp-flight-airport">09:00 出發</div>
              <div className="mp-flight-time-sm">飯店步行可達</div>
            </div>
            <div className="mp-flight-mid">熟悉雪場</div>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">16:00 收板</div>
              <div className="mp-flight-time-sm">中央・橫倉區</div>
            </div>
          </div>
          <div className="mp-two-col" style={{ marginTop: 4 }}>
            <div className="mp-col-item">
              <div className="mp-col-label">今日區域</div>
              <div className="mp-col-val">中央區・橫倉區</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">最高標高</div>
              <div className="mp-col-val">1661 m</div>
            </div>
          </div>
          <div className="mp-note">藏王溫泉滑雪場 · 連住 3 晚就在雪場旁 · 現場可租借全套雪具</div>
        </div>

        <div id="mp-c-d2-skiday" className="mp-card">
          <div className="mp-card-title">🎿 熟悉雪場 · 先滑主要路線</div>
          {[
            "第一天先熟悉，別急著攻頂",
            "把中央區、橫倉區主要路線滑順",
            "體力留給明天進階、後天夜滑",
          ].map((t, i) => (
            <div key={i} className="mp-list-item">
              <div className="mp-list-name">{t}</div>
            </div>
          ))}
          <div className="mp-note">中午在雪場餐廳 · 日式拉麵或咖哩飯補足能量</div>
        </div>

        <div id="mp-c-d2-dinner" className="mp-card">
          <img src="images/spots/izakaya.jpg" alt="藏王溫泉街晚餐" className="mp-card-img" />
          <div className="mp-card-title">🍶 藏王溫泉街晚餐</div>
          <div className="mp-highlight">溫泉街小食堂</div>
          <div className="mp-muted">步行可達 · 在地家常料理 · 不用開車</div>
          <div className="mp-note">就住在溫泉街上，晚餐後直接回飯店</div>
        </div>

        <div id="mp-c-d2-onsen" className="mp-card mp-card--dark">
          <img src="images/spots/zao-onsen.jpg" alt="藏王溫泉" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--light">♨️ 回飯店泡湯放鬆</div>
          <div className="mp-big-light">洗去一天疲憊</div>
          <div className="mp-muted-light">藏王強酸性硫磺泉，溫泉街公共浴場留到明天滑完雪再逛</div>
        </div>
      </section>

      {/* ── Day 3 ── */}
      <section id="mp-s-day3" className="mp-day">
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 3</span>
          <span className="mp-day-date">12月22日（二）・藏王 進階攻頂</span>
        </div>

        <div id="mp-c-d3-sched" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">🗓 今日行程（不用開車）</div>
          {[
            { time: "08:00", title: "飯店早餐", sub: "檢查天候，步行到纜車站" },
            { time: "09:00", title: "攻頂進階", sub: "地藏山頂・樹冰區・Long Cruise（雪具昨已租）" },
            { time: "17:00", title: "公共浴場", sub: "上湯 / 下湯巡禮 · 歷史名湯泡完再說" },
            { time: "19:00", title: "成吉思汗", sub: "烤生羊肉 + 生啤酒 · 男人的痛快晚餐" },
          ].map((t, i) => (
            <div key={i} className="mp-list-item">
              <div className="mp-list-name"><span style={{ color: "var(--accent)", fontWeight: 700, marginRight: 8 }}>{t.time}</span>{t.title}</div>
              <div className="mp-list-sub">{t.sub}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-d3-zao" className="mp-card">
          <img src="images/spots/zao.jpg" alt="山形藏王溫泉滑雪場" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--row">
            <span>🏔️ 山形藏王溫泉滑雪場</span>
            <MapBtn q="蔵王温泉スキー場 山形県山形市蔵王温泉" />
          </div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">雪場規模</div>
              <div className="mp-col-val">43 條滑道<br />最高 1661m · 落差 855m</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">12月限定</div>
              <div className="mp-col-val">樹冰奇景<br />橫跨多個山頭</div>
            </div>
          </div>
          <div className="mp-note">山頂樹木被雪與冰霧層層包覆，形成巨大「雪怪」造型 · 全世界僅此一地</div>
          <div className="mp-muted" style={{ marginTop: 4 }}>搭巨大纜車衝上頂峰 · 可下至溫泉街的「樹冰原滑道」</div>
          <div className="mp-note" style={{ marginTop: 4 }}>中午在山頂餐廳喝杯熱可可 + 大碗豬肉味噌湯飯</div>
        </div>

        <div id="mp-c-d3-bath" className="mp-card">
          <div className="mp-card-title">♨️ 溫泉街公共浴場巡禮</div>
          <div className="mp-tags-row">
            {["上湯（かみのゆ）", "下湯（しものゆ）"].map(b => (
              <span key={b} className="mp-tag-chip">{b}</span>
            ))}
          </div>
          <div className="mp-note">⚠ 強酸性溫泉，銀飾務必取下</div>
        </div>

        <div id="mp-c-d3-genghis" className="mp-card mp-card--dark">
          <img src="images/spots/genghis-khan.jpg" alt="成吉思汗烤羊肉" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--light">🔥 成吉思汗烤生羊肉</div>
          <div className="mp-big-light">ろばた（溫泉街）</div>
          <div className="mp-muted-light">圍著炭火 + 生啤酒，男人聚會最棒的氛圍</div>
        </div>
      </section>

      {/* ── Day 4 ── */}
      <section id="mp-s-day4" className="mp-day">
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 4</span>
          <span className="mp-day-date">12月23日（三）・仙台泉夜滑</span>
        </div>

        <div id="mp-c-d4-farewell" className="mp-card">
          <img src="images/spots/snow-road.jpg" alt="告別藏王" className="mp-card-img" />
          <div className="mp-card-title">🏔️ 告別藏王・返回仙台</div>
          <div className="mp-row-between mp-time-row">
            <div className="mp-flight-node">
              <div className="mp-flight-airport">09:30 退房</div>
              <div className="mp-flight-time-sm">藏王溫泉出發</div>
            </div>
            <div className="mp-flight-mid">車程 1.5-2h</div>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">12:30 抵達</div>
              <div className="mp-flight-time-sm">國分町大露台入住</div>
            </div>
          </div>
          <div className="mp-note">連住三晚，一次整理行李退房 · 白天路程充裕，輪流開車</div>
        </div>

        <div id="mp-c-d4-lunch" className="mp-card">
          <img src="images/spots/sendai-beef.jpg" alt="仙台牛高級燒肉" className="mp-card-img" />
          <div className="mp-card-title">🥩 午餐升級</div>
          <div className="mp-highlight">仙台牛高級燒肉</div>
          <div className="mp-muted">A5 仙台牛 · 12:30 補足夜滑熱量</div>
          <div className="mp-note">或選擇高評價海鮮丼</div>
        </div>

        <div id="mp-c-d4-valley" className="mp-card mp-card--dark">
          <img src="images/spots/spring-valley.jpg" alt="Spring Valley 夜滑" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--light mp-card-title--row">
            <span>🌙 Spring Valley 仙台泉夜滑</span>
            <MapBtn q="スプリングバレー仙台泉 宮城県仙台市" />
          </div>
          <div className="mp-row-between mp-time-row">
            <div className="mp-flight-node">
              <div className="mp-flight-time-light">15:30</div>
              <div className="mp-flight-airport-light">出發</div>
            </div>
            <div className="mp-flight-mid-light">夜滑時段</div>
            <div className="mp-flight-node">
              <div className="mp-flight-time-light">17:00~22:00</div>
              <div className="mp-flight-airport-light">開燈</div>
            </div>
          </div>
          <div className="mp-muted-light">距市區 40min · 燈光探照 · 極速感</div>
          {[
            "浪漫燈光探照下的夜間雪坡",
            "低溫讓雪質更酥脆，速度感極強",
            "大型人工造雪 + 高品質公園區",
          ].map((t, i) => (
            <div key={i} className="mp-list-item">
              <div className="mp-list-name" style={{ color: "var(--text-2)" }}>{t}</div>
            </div>
          ))}
          <div className="mp-note" style={{ marginTop: 4 }}>⚠ 夜間視線較不清晰，氣溫驟降 · 必須加穿保暖層與面罩</div>
        </div>

        <div id="mp-c-d4-ramen" className="mp-card">
          <img src="images/spots/ramen.jpg" alt="深夜拉麵" className="mp-card-img" />
          <div className="mp-card-title">🍜 深夜拉麵宵夜</div>
          <div className="mp-highlight">22:00 下山</div>
          <div className="mp-muted">三連戰完結的最好句點</div>
        </div>
      </section>

      {/* ── Day 5 ── */}
      <section id="mp-s-day5" className="mp-day">
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 5</span>
          <span className="mp-day-date">12月24日（四）平安夜・返台</span>
        </div>

        <div id="mp-c-d5-souvenir" className="mp-card">
          <img src="images/spots/souvenirs.jpg" alt="東北名產" className="mp-card-img" />
          <div className="mp-card-title">🎁 東北名產採購</div>
          {[
            { name: "萩の月", note: "仙台最具代表性的奶油夾心蛋糕" },
            { name: "一口毛豆麻糬", note: "東北限定，Q 彈好吃" },
            { name: "在地清酒", note: "宮城縣名酒，送禮首選" },
          ].map(s => (
            <div className="mp-list-item" key={s.name}>
              <div className="mp-list-name">{s.name}</div>
              <div className="mp-list-sub">{s.note}</div>
            </div>
          ))}
          <div className="mp-note">仙台車站商圈 · 男子漢亦不可空手回</div>
        </div>

        <div id="mp-c-d5-outlet" className="mp-card">
          <img src="images/spots/outlet.jpg" alt="仙台港三井 Outlet" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--row">
            <span>🛍️ 仙台港三井 Outlet</span>
            <MapBtn q="三井アウトレットパーク仙台港" />
          </div>
          <div className="mp-muted">距機場 25 分鐘・大型戶外用品店</div>
          <div className="mp-note">Gore-Tex 外套、滑雪裝備、最後尋寶</div>
        </div>

        <div id="mp-c-d5-return" className="mp-card mp-card--warn">
          <div className="mp-card-title">⛽ 還車流程</div>
          {[
            "在營業所附近加油站將油箱加滿（Regular 汽油）",
            "保留加油收據備查",
            "結算 ETC 過路費",
            "搭接駁車到仙台機場航廈辦理登機",
          ].map((s, i) => (
            <div key={i} className="mp-list-item">
              <div className="mp-list-name"><span style={{ color: "var(--accent)", fontWeight: 700, marginRight: 8 }}>{String(i + 1).padStart(2, "0")}</span>{s}</div>
            </div>
          ))}
          <div className="mp-note">提早 2 至 2.5 小時抵達機場，確保大型雪具 / 行李託運時間充裕</div>
        </div>

        <div id="mp-c-d5-farewell" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">✈️ IT255 回程班機</div>
          <div className="mp-row-between mp-vcenter" style={{ padding: "14px 0", marginTop: 14, borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">SDJ 仙台</div>
              <div className="mp-flight-time">19:40</div>
            </div>
            <div className="mp-flight-mid">虎航 · 3h20m →</div>
            <div className="mp-flight-node" style={{ textAlign: "right" }}>
              <div className="mp-flight-airport">TPE 桃園</div>
              <div className="mp-flight-time">23:00</div>
            </div>
          </div>
          <div className="mp-muted" style={{ marginBottom: 8 }}>17:10 前抵達機場・提早 2.5h 完成大件行李託運</div>
          <div className="mp-finale" style={{ marginTop: 10 }}>仙台滑雪，圓滿落幕</div>
          <div className="mp-tags-row" style={{ marginTop: 8 }}>
            {["5天4夜", "滑雪三日", "藏王溫泉", "成吉思汗羊肉", "夜滑", "深夜拉麵", "硫磺溫泉"].map(r => (
              <span key={r} className="mp-tag-chip">{r}</span>
            ))}
          </div>
          <div className="mp-muted-light" style={{ marginTop: 8 }}>SENDAI · 2026 · 12 · 20–24 · SEE YOU NEXT TIME</div>
        </div>
      </section>

      {/* ── Must-Know ── */}
      <section id="mp-s-know" className="mp-day">
        <div className="mp-day-header mp-day-header--nophoto">
          <span className="mp-day-tag">出發前</span>
          <span className="mp-day-date">必知事項 & 雪地自駕攻略</span>
        </div>

        <div id="mp-c-mk-license" className="mp-card">
          <div className="mp-card-title">📋 必備文件</div>
          {[
            { name: "台灣駕照正本", note: "確認有效期限" },
            { name: "日文譯本正本", note: "監理所辦，NT$100" },
            { name: "護照 + 信用卡", note: "與訂位時使用的信用卡" },
          ].map(d => (
            <div className="mp-list-item" key={d.name}>
              <div className="mp-list-name">{d.name}</div>
              <div className="mp-list-sub">{d.note}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-mk-rental" className="mp-card">
          <div className="mp-card-title">🚗 實際租車（NISSAN SERENA）</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">配備</div>
              <div className="mp-col-val">雪胎（無釘）<br />4WD・ETC 卡</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">取還時間</div>
              <div className="mp-col-val">12/20 20:00 取<br />12/24 18:00 還</div>
            </div>
          </div>
          <div className="mp-two-col" style={{ marginTop: 4 }}>
            <div className="mp-col-item">
              <div className="mp-col-label">總費用</div>
              <div className="mp-col-val">¥83,424</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">明細</div>
              <div className="mp-col-val">基本+四驅+保險<br />+ 稅金</div>
            </div>
          </div>
        </div>

        <div id="mp-c-mk-drive" className="mp-card mp-card--warn">
          <div className="mp-card-title">⚠️ 雪地自駕原則</div>
          {[
            "Black Ice — 拉大車距，切勿急煞",
            "起霧大雪 — 開霧燈減速",
            "開車不喝酒",
          ].map((r, i) => (
            <div className="mp-list-item" key={i}>
              <div className="mp-list-name" style={{ fontSize: 14 }}>{r}</div>
            </div>
          ))}
        </div>

        {/* ── 雪場實用資訊（地圖留底，避免與 Day2–4 內容重複） ── */}
        <div id="mp-c-mk-ski" className="mp-card">
          <div className="mp-card-title">⛷️ 滑雪場實用資訊</div>
          <div className="mp-muted">
            藏王溫泉滑雪場連滑兩天，纜車券買全日最划算，租一次雪具用兩天，
            飯店就在雪場旁不用來回開車。Spring Valley 仙台泉夜滑要帶面罩，風很大。
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            <TrailMap src="images/spots/zao-trail-map.jpg" label="藏王雪場滑道地圖" />
            <TrailMap src="images/spots/spring-valley-trail-map.png" label="Spring Valley 滑道地圖" />
          </div>
        </div>

        {/* ── 美食清單（詳情見各 Day 卡片） ── */}
        <div id="mp-c-mk-food" className="mp-card">
          <div className="mp-card-title">🍜 東北美食清單</div>
          <div className="mp-muted">
            藏王溫泉街晚餐找當地小食堂，成吉思汗烤羊肉找溫泉街ろばた，
            仙台牛燒肉在市區名店安排 Day4 午餐，深夜拉麵仙台市區隨便走都有。
          </div>
        </div>
      </section>

      <div className="mp-footer">仙台，我們來了。</div>

      <div className="mp-pdf-section">
        <a href={`${baseUrl}20261220仙台.pdf`} download="20261220仙台.pdf" className="mp-pdf-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5v-2z"/>
          </svg>
          下載行程手冊 PDF
        </a>
        <div className="mp-pdf-date">2026 / 12 / 20 ~ 2026 / 12 / 24</div>
      </div>

      <MobileAudioFab baseUrl={baseUrl} />
    </div>
  );
}
