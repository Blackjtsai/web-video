import { useCallback, useEffect, useRef, useState } from "react";
import "./MobilePage.css";

/* ── Google Maps 小按鈕 ── */
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

/* ── 30 段口播 ── */
const SEGMENTS = [
  { id: "coldopen",  step: 1, cardId: "mp-s-hero" },
  { id: "coldopen",  step: 2, cardId: "mp-s-hero" },
  { id: "coldopen",  step: 3, cardId: "mp-s-hero" },
  { id: "coldopen",  step: 4, cardId: "mp-s-hero" },
  { id: "nagano-overview", step: 1, cardId: "mp-s-nagano" },
  { id: "nagano-overview", step: 2, cardId: "mp-c-no-hakuba" },
  { id: "nagano-overview", step: 3, cardId: "mp-c-no-shiga" },
  { id: "nagano-overview", step: 4, cardId: "mp-c-no-nozawa" },
  { id: "day1",      step: 1, cardId: "mp-s-day1" },
  { id: "day1",      step: 2, cardId: "mp-c-d1-flight" },
  { id: "day1",      step: 3, cardId: "mp-c-d1-transit" },
  { id: "day1",      step: 4, cardId: "mp-c-d1-hotel" },
  { id: "day1",      step: 5, cardId: "mp-c-d1-nightski" },
  { id: "day2",      step: 1, cardId: "mp-s-day2" },
  { id: "day2",      step: 2, cardId: "mp-c-d2-central" },
  { id: "day2",      step: 3, cardId: "mp-c-d2-higashidate" },
  { id: "day2",      step: 4, cardId: "mp-c-d2-hotel" },
  { id: "day3",      step: 1, cardId: "mp-s-day3" },
  { id: "day3",      step: 2, cardId: "mp-c-d3-ichinose" },
  { id: "day3",      step: 3, cardId: "mp-c-d3-yakebitai" },
  { id: "day3",      step: 4, cardId: "mp-c-d3-hotel" },
  { id: "day4",      step: 1, cardId: "mp-s-day4" },
  { id: "day4",      step: 2, cardId: "mp-c-d4-checkout" },
  { id: "day4",      step: 3, cardId: "mp-c-d4-transit" },
  { id: "day5",      step: 1, cardId: "mp-c-d5-flight" },
  { id: "must-know", step: 1, cardId: "mp-s-know" },
  { id: "must-know", step: 2, cardId: "mp-c-mk-checklist" },
  { id: "must-know", step: 3, cardId: "mp-c-mk-warn" },
  { id: "must-know", step: 4, cardId: "mp-c-mk-onsen" },
  { id: "must-know", step: 5, cardId: "mp-c-mk-souvenir" },
  { id: "must-know", step: 6, cardId: "mp-c-mk-budget" },
  { id: "must-know", step: 7, cardId: "mp-c-mk-map" },
];

const CHAPTER_GROUPS = [
  { label: "開場",   start: 0,  end: 3  },
  { label: "長野雪場", start: 4,  end: 7  },
  { label: "Day 1",  start: 8,  end: 12 },
  { label: "Day 2",  start: 13, end: 16 },
  { label: "Day 3",  start: 17, end: 20 },
  { label: "Day 4",  start: 21, end: 23 },
  { label: "出發前", start: 24, end: 30 },
];

function scrollToCard(idx: number) {
  const seg = SEGMENTS[idx];
  if (!seg) return;
  const el = document.getElementById(seg.cardId);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── FAB ── */
interface FabProps {
  baseUrl: string;
  onLock: () => void;
  onUnlock: () => void;
}

function MobileAudioFab({ baseUrl, onLock, onUnlock }: FabProps) {
  const [playing, setPlaying]           = useState(false);
  const [index, setIndex]               = useState(0);
  const [showScrubber, setShowScrubber] = useState(false);
  const [scrubIdx, setScrubIdx]         = useState(0);
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const indexRef   = useRef(index);
  const lpTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  indexRef.current = index;

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

  useEffect(() => {
    if (playing) onLock();
    else onUnlock();
  }, [playing, onLock, onUnlock]);

  useEffect(() => { scrollToCard(index); }, [index]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const seg = SEGMENTS[index];
    if (!seg) return;
    if (playing) { audio.src = `${baseUrl}audio/${seg.id}/${seg.step}.mp3`; audio.play().catch(() => {}); }
    else audio.pause();
  }, [index, playing, baseUrl]);

  const longFired = useRef(false);
  const startPos  = useRef<{ x: number; y: number } | null>(null);

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
                >
                  {ch.label}
                </button>
              ))}
            </div>
            <input
              type="range"
              className="mp-scrubber-range"
              min={0} max={SEGMENTS.length - 1}
              value={scrubIdx}
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
  const img = (name: string) => `${baseUrl}images-mobile/${name}`;

  const scrollLockedRef = useRef(false);
  const handleLock   = useCallback(() => { scrollLockedRef.current = true;  }, []);
  const handleUnlock = useCallback(() => { scrollLockedRef.current = false; }, []);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    root.style.overflowY = "auto";
    root.style.overflowX = "hidden";
    root.style.height    = "100dvh";
    root.scrollTop = 0;

    const preventScroll = (e: TouchEvent) => {
      if (scrollLockedRef.current) e.preventDefault();
    };
    root.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      root.style.overflowY = "";
      root.style.overflowX = "";
      root.style.height    = "";
      root.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  const isLineBrowser = navigator.userAgent.indexOf("Line/") > -1;

  return (
    <div className="mp-root">

      {isLineBrowser && (
        <div className="mp-line-banner">
          <span>請點右上角</span>
          <strong> ··· </strong>
          <span>→</span>
          <strong> 在瀏覽器中開啟 </strong>
          <span>以獲得最佳體驗</span>
        </div>
      )}

      {/* ── Hero ── */}
      <div id="mp-s-hero" className="mp-hero">
        <img className="mp-hero-img" src={img("cover.jpg")} alt="志賀高原滑雪" />
        <div className="mp-hero-text">
          <div className="mp-hero-sub">高天原基地・3日券連滑三天</div>
          <div className="mp-hero-title">志賀高原滑雪</div>
          <div className="mp-hero-badges">
            <span className="mp-badge">6 人成行</span>
            <span className="mp-badge">4 天 3 夜</span>
            <span className="mp-badge">2027 · 2/28–3/4</span>
          </div>
          <div className="mp-scroll-hint">▼ 滑動查看行程</div>
        </div>
      </div>

      {/* ── 長野雪場總覽 ── */}
      <section id="mp-s-nagano" className="mp-day">
        <div className="mp-day-header--nophoto">
          <span className="mp-day-tag">長野雪場</span>
          <span className="mp-day-date">70+ 雪場・三大核心勝地</span>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🗻 長野縣，日本滑雪心臟地帶</div>
          <div className="mp-muted">
            70 多家世界級滑雪場，東京搭北陸新幹線約 80–110 分鐘即達。
            三大核心勝地——白馬村、野澤溫泉、志賀高原，各有各的個性。
          </div>
        </div>

        <div id="mp-c-no-hakuba" className="mp-card">
          <div className="mp-card-title">🏔️ 白馬山谷 Hakuba Valley</div>
          <img className="mp-inline-img" src={img("hakuba.jpg")} alt="白馬山谷" />
          <div className="mp-muted">1998 長野冬奧主場。雪道多樣、極具挑戰性，歐美度假村氛圍與豐富夜生活。</div>
        </div>

        <div id="mp-c-no-nozawa" className="mp-card">
          <div className="mp-card-title">♨️ 野澤溫泉 Nozawa Onsen</div>
          <img className="mp-inline-img" src={img("nozawa.jpg")} alt="野澤溫泉" />
          <div className="mp-muted">長達 5 公里林間雪道，滑雪後漫步日式溫泉街，享受天然足湯。</div>
        </div>

        <div id="mp-c-no-shiga" className="mp-card mp-card--warn">
          <div className="mp-card-title">🎿 志賀高原 Shiga Kogen　<span className="mp-tag-inline mp-tag-inline--accent">本次行程</span></div>
          <img className="mp-inline-img" src={img("day1.jpg")} alt="志賀高原" />
          <div className="mp-muted">日本最大且海拔最高的連通滑雪區域，高海拔造就極佳粉雪，雪季 11 月下旬～隔年 5 月。</div>
        </div>
      </section>

      {/* ── Day 1 ── */}
      <section id="mp-s-day1" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day1.jpg")} alt="Day 1" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 1</span>
              <span className="mp-day-date">2/28（日）抵達・直奔志賀高原高天原</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d1-flight" className="mp-card">
          <div className="mp-card-title">✈️ 去程航班</div>
          <div className="mp-row-between">
            <div className="mp-flight-node">
              <div className="mp-flight-airport">桃園機場</div>
              <div className="mp-flight-time">00:10</div>
            </div>
            <div className="mp-flight-mid">虎航 IT → 紅眼班機</div>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">羽田機場</div>
              <div className="mp-flight-time">04:00</div>
            </div>
          </div>
          <div className="mp-tag-inline">台灣虎航</div>
          <div className="mp-muted">05:00–05:30 出關拿行李</div>
        </div>

        <div id="mp-c-d1-transit" className="mp-card">
          <div className="mp-card-title">🚄 電車轉乘・巴士上山</div>
          {[
            { name: "05:30–06:00　羽田 → 東京站", sub: "" },
            { name: "06:30–07:00　抵達東京站", sub: "" },
            { name: "早班北陸新幹線　東京 → 長野", sub: "全天唯一能好好補眠的時段" },
            { name: "08:30–09:00　抵達長野站", sub: "" },
            { name: "約 09:45　接志賀高原急行巴士", sub: "" },
            { name: "長野 → 高天原　約 1 小時 30–50 分", sub: "" },
            { name: "11:20–11:40　抵達高天原", sub: "步行 1–2 分鐘到志賀百樂酒店" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              {i.sub && <div className="mp-list-sub">{i.sub}</div>}
            </div>
          ))}
          <div className="mp-muted">實際新幹線與巴士班次，需等冬季志賀高原巴士班表公布後再微調</div>
        </div>

        <div id="mp-c-d1-hotel" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏨 今晚住宿</span>
            <MapBtn q="Shiga Park Hotel Nagano" />
          </div>
          <div className="mp-hotel-name">志賀百樂酒店</div>
          <div className="mp-hotel-en">Shiga Park Hotel</div>
          <span className="mp-meal-badge mp-meal-badge--bfdn">🍳🥩 附早晚餐</span>
        </div>

        <div id="mp-c-d1-nightski" className="mp-card">
          <div className="mp-card-title">🎿 租裝備・休息為主</div>
          <div className="mp-muted">第一天以租借雪具和休息為主，養足體力應付接下來三天連滑。是否夜滑，依當季志賀高原營業規定而定，不強排。</div>
        </div>
      </section>

      {/* ── Day 2 ── */}
      <section id="mp-s-day2" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day2.jpg")} alt="Day 2" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 2</span>
              <span className="mp-day-date">3/1（一）高天原・中央區全天滑</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d2-central" className="mp-card">
          <div className="mp-card-title">🎫 3日券 Day 1 / 3</div>
          <div className="mp-highlight">高天原・中央區</div>
          <div className="mp-muted">坡度平緩、雪道寬，上午先熱身找回滑雪感覺</div>
        </div>

        <div id="mp-c-d2-higashidate" className="mp-card">
          <div className="mp-card-title">🚡 東館山・寺小屋・串一之瀨</div>
          {[
            { name: "東館山・寺小屋", sub: "纜車直達，坡度拉高，適合中階路線" },
            { name: "串到一之瀨", sub: "替明天長程路線先探路" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              <div className="mp-list-sub">{i.sub}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-d2-hotel" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏨 今晚住宿</span>
            <MapBtn q="Shiga Park Hotel Nagano" />
          </div>
          <div className="mp-hotel-name">志賀百樂酒店</div>
          <div className="mp-hotel-en">Shiga Park Hotel</div>
          <span className="mp-meal-badge mp-meal-badge--bfdn">🍳🥩 附早晚餐</span>
        </div>
      </section>

      {/* ── Day 3 ── */}
      <section id="mp-s-day3" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day3.jpg")} alt="Day 3" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 3</span>
              <span className="mp-day-date">3/2（二）一之瀨・燒額山・奧志賀</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d3-ichinose" className="mp-card">
          <div className="mp-card-title">🎫 3日券 Day 2 / 3</div>
          <div className="mp-highlight">一之瀨 → 燒額山</div>
          <div className="mp-muted">一之瀨是志賀高原最大雪場區塊，纜車網密集；燒額山是 1998 長野冬奧滑降賽道，雪質紮實</div>
        </div>

        <div id="mp-c-d3-yakebitai" className="mp-card">
          <div className="mp-card-title">🏔️ 奧志賀・下午預留回程</div>
          <div className="mp-highlight">奧志賀高原</div>
          <div className="mp-muted">志賀高原最深處，遊客少、雪況原始，主力巡航日，下午預留回程時間</div>
        </div>

        <div id="mp-c-d3-hotel" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏨 今晚住宿</span>
            <MapBtn q="Shiga Park Hotel Nagano" />
          </div>
          <div className="mp-hotel-name">志賀百樂酒店</div>
          <div className="mp-hotel-en">Shiga Park Hotel</div>
          <span className="mp-meal-badge mp-meal-badge--bfdn">🍳🥩 附早晚餐</span>
        </div>
      </section>

      {/* ── Day 4 ── */}
      <section id="mp-s-day4" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day4.jpg")} alt="Day 4" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 4</span>
              <span className="mp-day-date">3/3（三）機動滑雪日</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d4-checkout" className="mp-card">
          <div className="mp-card-title">🎫 3日券 Day 3 / 3・自由路線</div>
          <div className="mp-highlight">約 14:00–15:00 收板</div>
          <div className="mp-muted">退房、寄放行李、取行李／更衣，時間抓得太緊會手忙腳亂</div>
        </div>

        <div id="mp-c-d4-transit" className="mp-card">
          <div className="mp-card-title">🚌 下山回程</div>
          {[
            { name: "滑完回飯店拿行李", sub: "若飯店允許可洗澡換衣" },
            { name: "約 15:30–16:00　離開飯店", sub: "" },
            { name: "巴士下山　高天原 → 長野", sub: "" },
            { name: "約 17:30–18:00　抵達長野站", sub: "" },
            { name: "新幹線　長野 → 東京 → 轉羽田", sub: "" },
            { name: "約 21:00–22:30　抵達羽田機場", sub: "" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              {i.sub && <div className="mp-list-sub">{i.sub}</div>}
            </div>
          ))}
          <div className="mp-highlight">不訂東京住宿，直接在羽田等隔天 05:00 班機</div>
          <div className="mp-muted">實際巴士與新幹線班次，需等冬季志賀高原巴士班表公布後再微調</div>
        </div>
      </section>

      {/* ── Day 5 ── */}
      <section id="mp-s-day5" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day4.jpg")} alt="Day 5" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 5</span>
              <span className="mp-day-date">3/4（四）歸途</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d5-flight" className="mp-card">
          <div className="mp-card-title">✈️ 回程航班</div>
          <div className="mp-row-between">
            <div className="mp-flight-node">
              <div className="mp-flight-airport">羽田機場</div>
              <div className="mp-flight-time">05:00</div>
            </div>
            <div className="mp-flight-mid">虎航 IT · 3/4</div>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">桃園機場</div>
              <div className="mp-flight-time">07:55</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 出發前必知 ── */}
      <section id="mp-s-know" className="mp-day">
        <div className="mp-day-header--nophoto">
          <span className="mp-day-tag mp-day-tag--dark">出發前</span>
          <span className="mp-day-date mp-day-date--dark">必知事項 &amp; 伴手禮</span>
        </div>

        <div id="mp-c-mk-checklist" className="mp-card">
          <div className="mp-card-title">📋 必備清單</div>
          {[
            { name: "護照效期六個月以上", sub: "出發前再次確認護照效期" },
            { name: "雪具自備", sub: "滑雪服、雪鏡、手套——現場租借選擇少、較貴" },
            { name: "旅遊保險", sub: "雪上運動風險比一般旅遊高，別漏保" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              <div className="mp-list-sub">{i.sub}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-mk-warn" className="mp-card mp-card--warn">
          <div className="mp-card-title">⚠️ 出發前務必再確認</div>
          <div className="mp-muted">
            2026/27 冬季巴士班表、夜滑日期與雪票價格截至目前尚未正式公布，
            別憑去年的資訊出發，出發前一定要再查一次。
          </div>
        </div>

        <div id="mp-c-mk-onsen" className="mp-card">
          <div className="mp-card-title">♨️ 溫泉飯店須知</div>
          <div className="mp-muted">浴巾、拖鞋飯店都會提供，但貴重物品要自己保管——泡湯前先鎖好。</div>
        </div>

        <div id="mp-c-mk-souvenir" className="mp-card">
          <div className="mp-card-title">🎁 伴手禮清單</div>
          <div className="mp-tags-row">
            {["長野蕎麥麵", "信州味噌", "當地地酒", "滑雪場限定周邊"].map(t => (
              <span key={t} className="mp-tag-chip">{t}</span>
            ))}
          </div>
        </div>

        <div id="mp-c-mk-budget" className="mp-card">
          <div className="mp-card-title">💰 參考預算・每人</div>
          {[
            { name: "機票", sub: "NT$9,000" },
            { name: "住宿", sub: "NT$8,000" },
            { name: "交通", sub: "約 NT$5,200" },
            { name: "雪票", sub: "約 NT$5,200" },
            { name: "保險", sub: "NT$1,000" },
            { name: "餐費", sub: "NT$4,000" },
          ].map(i => (
            <div className="mp-row-between" key={i.name}>
              <span className="mp-list-name">{i.name}</span>
              <span className="mp-list-sub">{i.sub}</span>
            </div>
          ))}
          <div className="mp-note">合計約 NT$32,400・建議準備 NT$35,000（含機動金）</div>
        </div>

        <div id="mp-c-mk-map" className="mp-card">
          <div className="mp-card-title">🗺️ 志賀高原全山雪道地圖</div>
          <a href={img("trail-map.jpg")} target="_blank" rel="noopener noreferrer">
            <img className="mp-map-img" src={img("trail-map.jpg")} alt="志賀高原全山雪道地圖" />
          </a>
          <div className="mp-muted">
            高天原・中央區・東館山・寺小屋・一之瀨・燒額山・奧志賀——本次行程雪場都在圖上，點圖可放大看細節。
          </div>
        </div>
      </section>

      <div className="mp-footer">志賀高原，我們來了。</div>

      <div className="mp-pdf-section">
        <a
          href={`${baseUrl}2027志賀高原滑雪行程_V4.pdf`}
          download="2027志賀高原滑雪行程_V4.pdf"
          className="mp-pdf-btn"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5v-2z"/>
          </svg>
          下載行程手冊 PDF
        </a>
        <div className="mp-pdf-date">2027 / 02 / 28 ~ 2027 / 03 / 04</div>
      </div>

      <MobileAudioFab
        baseUrl={baseUrl}
        onLock={handleLock}
        onUnlock={handleUnlock}
      />
    </div>
  );
}
