import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

/* 意見回饋按鈕開關：行程確認前設 true 開放家人留言（Formspree），目前隱藏 */
const SHOW_FEEDBACK = false;

/* ── 41 段口播（= narrations.ts 段數 = mp3 數量） ── */
const SEGMENTS = [
  { id: "coldopen",  step: 1, cardId: "mp-s-hero" },
  { id: "coldopen",  step: 2, cardId: "mp-s-hero" },
  { id: "coldopen",  step: 3, cardId: "mp-c-route-map" },
  { id: "coldopen",  step: 4, cardId: "mp-s-hero" },
  { id: "day1",      step: 1, cardId: "mp-s-day1" },
  { id: "day1",      step: 2, cardId: "mp-c-d1-flight" },
  { id: "day1",      step: 3, cardId: "mp-c-d1-spots" },
  { id: "day1",      step: 4, cardId: "mp-c-d1-dinner" },
  { id: "day2",      step: 1, cardId: "mp-s-day2" },
  { id: "day2",      step: 2, cardId: "mp-c-d2-city" },
  { id: "day2",      step: 3, cardId: "mp-c-d2-moiwa" },
  { id: "day2",      step: 4, cardId: "mp-c-d2-dining" },
  { id: "day3",      step: 1, cardId: "mp-s-day3" },
  { id: "day3",      step: 2, cardId: "mp-c-d3-jingu" },
  { id: "day3",      step: 3, cardId: "mp-c-d3-koibito" },
  { id: "day3",      step: 4, cardId: "mp-c-d3-dining" },
  { id: "day4",      step: 1, cardId: "mp-s-day4" },
  { id: "day4",      step: 2, cardId: "mp-c-d4-car" },
  { id: "day4",      step: 3, cardId: "mp-c-d4-jozankei" },
  { id: "day4",      step: 4, cardId: "mp-c-d4-shikotsu" },
  { id: "day4",      step: 5, cardId: "mp-c-d4-toya" },
  { id: "day5",      step: 1, cardId: "mp-s-day5" },
  { id: "day5",      step: 2, cardId: "mp-c-d5-usu" },
  { id: "day5",      step: 3, cardId: "mp-c-d5-numa" },
  { id: "day5",      step: 4, cardId: "mp-c-d5-dining" },
  { id: "day6",      step: 1, cardId: "mp-s-day6" },
  { id: "day6",      step: 2, cardId: "mp-c-d6-shakotan" },
  { id: "day6",      step: 3, cardId: "mp-c-d6-glow" },
  { id: "day6",      step: 4, cardId: "mp-c-d6-bbq" },
  { id: "day7",      step: 1, cardId: "mp-s-day7" },
  { id: "day7",      step: 2, cardId: "mp-c-d7-market" },
  { id: "day7",      step: 3, cardId: "mp-c-d7-canal" },
  { id: "day7",      step: 4, cardId: "mp-c-d7-back" },
  { id: "day8",      step: 1, cardId: "mp-s-day8" },
  { id: "day8",      step: 2, cardId: "mp-c-d8-jr" },
  { id: "day8",      step: 3, cardId: "mp-c-d8-depart" },
  { id: "must-know", step: 1, cardId: "mp-s-know" },
  { id: "must-know", step: 2, cardId: "mp-c-mk-booking" },
  { id: "must-know", step: 3, cardId: "mp-c-mk-warm" },
  { id: "must-know", step: 4, cardId: "mp-c-mk-notes" },
  { id: "must-know", step: 5, cardId: "mp-c-mk-souvenir" },
];

const CHAPTER_GROUPS = [
  { label: "開場",   start: 0,  end: 3  },
  { label: "Day 1",  start: 4,  end: 7  },
  { label: "Day 2",  start: 8,  end: 11 },
  { label: "Day 3",  start: 12, end: 15 },
  { label: "Day 4",  start: 16, end: 20 },
  { label: "Day 5",  start: 21, end: 24 },
  { label: "Day 6",  start: 25, end: 28 },
  { label: "Day 7",  start: 29, end: 32 },
  { label: "Day 8",  start: 33, end: 35 },
  { label: "出發前", start: 36, end: 40 },
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

  /* playing 狀態決定鎖定 */
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

/* ── 行程意見回饋 Modal（暫時性功能，確認行程後可移除） ── */
function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [name, setName]       = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus]   = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xvznkbjo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mp-fb-overlay" onClick={onClose}>
      <div className="mp-fb-sheet" onClick={e => e.stopPropagation()}>
        {status === 'success' ? (
          <div className="mp-fb-success">
            <div className="mp-fb-check">✓</div>
            <div className="mp-fb-success-title">謝謝你的意見！</div>
            <div className="mp-fb-success-sub">我們會認真參考的 🍁</div>
            <button className="mp-fb-done-btn" onClick={onClose}>關閉</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mp-fb-header">
              <div className="mp-fb-title">行程意見回饋</div>
              <button type="button" className="mp-fb-x" onClick={onClose}>✕</button>
            </div>
            <div className="mp-fb-trip-info">
              ✈️ 出發 2026/10/06 · 回程 2026/10/13
            </div>
            <label className="mp-fb-label">你是誰？</label>
            <input
              className="mp-fb-input"
              type="text"
              placeholder="輸入你的名字"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              required
            />
            <div className="mp-fb-counter">{name.length} / 20</div>
            <label className="mp-fb-label">你的想法</label>
            <textarea
              className="mp-fb-textarea"
              placeholder="對這次北海道行程有什麼期待或建議？"
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={300}
              required
              rows={4}
            />
            <div className="mp-fb-counter">{message.length} / 300</div>
            {status === 'error' && (
              <div className="mp-fb-error">送出失敗，請再試一次</div>
            )}
            <button type="submit" className="mp-fb-submit" disabled={status === 'sending'}>
              {status === 'sending' ? '送出中…' : '送出意見'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── 路線地圖放大燈箱（portal 到 body，避免被卡片 transform 鎖住 fixed 定位） ── */
function MapLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return createPortal(
    <div className="mp-lb-overlay" onClick={onClose}>
      <button className="mp-lb-close" onClick={onClose} aria-label="關閉">✕</button>
      <img className="mp-lb-img" src={src} alt="北海道 8 天自駕路線地圖" onClick={e => e.stopPropagation()} />
    </div>,
    document.body,
  );
}

interface Props { baseUrl: string; }

export function MobilePage({ baseUrl }: Props) {
  const img = (name: string) => `${baseUrl}images-mobile/${name}`;
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

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

    /* 播放時攔截手動捲動（passive: false 才能 preventDefault） */
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
        <img className="mp-hero-img" src={img("cover.jpg")} alt="北海道家族行" />
        <div className="mp-hero-text">
          <div className="mp-hero-sub">六人同行，秋楓盛宴</div>
          <div className="mp-hero-title">北海道八日遊</div>
          <div className="mp-hero-badges">
            <span className="mp-badge">六人成行</span>
            <span className="mp-badge">八天七夜</span>
            <span className="mp-badge">2026 · 十月</span>
            <span className="mp-badge">Day 4 起自駕</span>
          </div>
          <div className="mp-scroll-hint">▼ 滑動查看行程</div>
        </div>
      </div>

      {/* ── 路線總覽 ── */}
      <section className="mp-day">
        <div id="mp-c-route-map" className="mp-card">
          <div className="mp-card-title">🗺️ 8 天路線總覽</div>
          <img
            className="mp-spot-img mp-route-img"
            src={img("route-map.jpg")}
            alt="北海道 8 天自駕路線地圖"
            onClick={() => setMapOpen(true)}
            style={{ cursor: "zoom-in" }}
          />
          <div className="mp-muted" style={{ marginTop: 8 }}>
            點圖可放大。札幌 → 洞爺湖 → 二世谷 → 積丹・余市 → 小樽 → 札幌 → 新千歲（路線為示意）
          </div>
        </div>
      </section>

      {/* ── Day 1 ── */}
      <section id="mp-s-day1" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day1.jpg")} alt="Day 1" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 1</span>
              <span className="mp-day-date">10/06（二）抵達札幌</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d1-flight" className="mp-card">
          <div className="mp-card-title">✈️ 去程航班</div>
          <div className="mp-row-between">
            <div className="mp-flight-node">
              <div className="mp-flight-airport">桃園機場</div>
              <div className="mp-flight-time">06:20</div>
            </div>
            <div className="mp-flight-mid">IT 236 → 約 3 小時 45 分</div>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">新千歲機場</div>
              <div className="mp-flight-time">11:05</div>
            </div>
          </div>
          <div className="mp-tag-inline">台灣虎航 · 03:40 出發前往桃園機場</div>
        </div>

        <div id="mp-c-d1-spots" className="mp-card">
          <div className="mp-card-title">🚃 抵達後 · 前往札幌</div>
          {[
            { name: "12:15 出關 · 國內線航廈 3 樓午餐", sub: "出關後步行約 5–8 分鐘（沿 2 樓平面電扶梯）" },
            { name: "14:19 JR 快速 Airport 號", sub: "約 40 分鐘，自由席 ¥1,230" },
            { name: "15:30 Check-in · 稍作休息", sub: "札幌京急 EX 酒店" },
            { name: "16:30 JR 塔觀景台", sub: "傍晚登高看札幌" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              <div className="mp-list-sub">{i.sub}</div>
            </div>
          ))}
          <div className="mp-card-title mp-card-title--row" style={{ marginTop: 10, marginBottom: 0 }}>
            <span>📍 JR 塔 T38</span>
            <MapBtn q="JR Tower Observation Deck T38 Sapporo" />
          </div>
        </div>

        <div id="mp-c-d1-hotel" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏨 今晚住宿（連住 3 晚）</span>
            <MapBtn q="Sapporo Keikyu EX Hotel" />
          </div>
          <div className="mp-hotel-name">札幌京急 EX 酒店</div>
          <div className="mp-hotel-en">Sapporo Keikyu EX Hotel</div>
          <span className="mp-meal-badge mp-meal-badge--bf">🍳 附早餐</span>
        </div>

        <div id="mp-c-d1-dinner" className="mp-card">
          <div className="mp-card-title">🍽️ 今日餐飲</div>
          {[
            { name: "早餐：機上", sub: "" },
            { name: "午餐：新千歲機場國內線航廈", sub: "出關後步行前往 3 樓" },
            { name: "晚餐 18:00：根室花丸 或 奧芝湯咖哩", sub: "二選一" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              {i.sub && <div className="mp-list-sub">{i.sub}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Day 2 ── */}
      <section id="mp-s-day2" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day2.jpg")} alt="Day 2" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 2</span>
              <span className="mp-day-date">10/07（三）札幌市區慢遊</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d2-city" className="mp-card">
          <div className="mp-card-title">🚶 市區步行 · 地鐵 · 路面電車</div>
          {[
            { name: "二條市場", sub: "", q: "Nijo Market Sapporo" },
            { name: "札幌電視塔 · 大通公園", sub: "", q: "Sapporo TV Tower" },
            { name: "狸小路商店街", sub: "", q: "Tanukikoji Shopping Street Sapporo" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{i.name}</span>
                <MapBtn q={i.q} />
              </div>
            </div>
          ))}
        </div>

        <div id="mp-c-d2-moiwa" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🌃 藻岩山夜景</span>
            <MapBtn q="Mt. Moiwa Ropeway Sapporo" />
          </div>
          <div className="mp-highlight">搭路面電車 → 纜車入口站</div>
          <div className="mp-muted">
            下車後步行約 7–10 分鐘；也可搭免費接駁車到藻岩山麓站購票上山。有興趣的人再上山。
          </div>
        </div>

        <div id="mp-c-d2-dining" className="mp-card">
          <div className="mp-card-title">🍽️ 今日餐飲</div>
          {[
            { name: "早餐：飯店", sub: "" },
            { name: "午餐：Dekitateya 時計台店", sub: "Dekitateya Tokeidai Branch" },
            { name: "晚餐 17:30：蟹座", sub: "建議提早訂位" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              {i.sub && <div className="mp-list-sub">{i.sub}</div>}
            </div>
          ))}
        </div>

        <div id="mp-c-d2-hotel" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏨 今晚住宿</span>
            <MapBtn q="Sapporo Keikyu EX Hotel" />
          </div>
          <div className="mp-hotel-name">札幌京急 EX 酒店</div>
          <div className="mp-hotel-en">Sapporo Keikyu EX Hotel</div>
          <span className="mp-meal-badge mp-meal-badge--bf">🍳 附早餐</span>
        </div>
      </section>

      {/* ── Day 3 ── */}
      <section id="mp-s-day3" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day3.jpg")} alt="Day 3" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 3</span>
              <span className="mp-day-date">10/08（四）札幌經典景點</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d3-jingu" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>⛩️ 北海道神宮 · 場外市場</span>
            <MapBtn q="Hokkaido Jingu Shrine" />
          </div>
          {[
            { name: "北海道神宮", sub: "圓山公園站（T06）步行約 14 分鐘" },
            { name: "場外市場", sub: "二十四軒站（T04）步行約 10 分鐘；或 JR 桑園站西剪票口步行 8–12 分鐘" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              <div className="mp-list-sub">{i.sub}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-d3-koibito" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🍪 白色戀人公園</span>
            <MapBtn q="Shiroi Koibito Park Sapporo" />
          </div>
          <img className="mp-spot-img" src={img("koibito-park.jpg")} alt="白色戀人公園" />
          <div className="mp-muted" style={{ marginTop: 8 }}>宮之澤站（T01）下車。</div>
          <div className="mp-list-item" style={{ marginTop: 8 }}>
            <div className="mp-list-name" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>發寒 AEON Mall</span>
              <MapBtn q="AEON Mall Sapporo Hassamu" />
            </div>
            <div className="mp-list-sub">發寒南站（T02）</div>
          </div>
        </div>

        <div id="mp-c-d3-dining" className="mp-card">
          <div className="mp-card-title">🍽️ 今日餐飲</div>
          {[
            { name: "早餐：飯店", sub: "" },
            { name: "午餐：場外市場 或 AEON Mall", sub: "" },
            { name: "晚餐：札幌車站附近", sub: "" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-d3-hotel" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏨 今晚住宿</span>
            <MapBtn q="Sapporo Keikyu EX Hotel" />
          </div>
          <div className="mp-hotel-name">札幌京急 EX 酒店</div>
          <div className="mp-hotel-en">Sapporo Keikyu EX Hotel</div>
          <span className="mp-meal-badge mp-meal-badge--bf">🍳 附早餐</span>
        </div>
      </section>

      {/* ── Day 4 ── */}
      <section id="mp-s-day4" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day4.jpg")} alt="Day 4" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 4</span>
              <span className="mp-day-date">10/09（五）取車自駕 · 定山溪到洞爺湖</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d4-car" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🚗 08:30 WNR 取車 · 自駕開始</span>
            <MapBtn q="WNR Rent a Car Sapporo" />
          </div>
          <div className="mp-highlight">出發前先確認</div>
          <div className="mp-muted">取車資料、駕照與日文譯本、導航設定</div>
        </div>

        <div id="mp-c-d4-jozankei" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🍁 定山溪散步</span>
            <MapBtn q="Jozankei Onsen Hokkaido" />
          </div>
          <img className="mp-spot-img" src={img("jozankei.jpg")} alt="定山溪" />
          <div className="mp-muted" style={{ marginTop: 8 }}>
            二見公園、二見吊橋、河童淵。停車：定山溪公共停車場（¥500）。再看定山湖大壩（豐平峽水庫）。
          </div>
          <div className="mp-note">午餐：Konno 拉麵店 或 紅葉亭（蕎麥麵、天丼）</div>
        </div>

        <div id="mp-c-d4-shikotsu" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🍰 支笏湖 · 洞爺湖展望台</span>
            <MapBtn q="Lake Shikotsu Patissier Labo" />
          </div>
          <div className="mp-muted">
            支笏湖的 Patissier Labo 甜品店；傍晚經過道之驛洞爺湖展望台，先看看洞爺湖。
          </div>
        </div>

        <div id="mp-c-d4-toya" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--row mp-card-title--light">
            <span>🏨 洞爺湖萬世閣</span>
            <MapBtn q="Toya Manseikaku Hotel Hokkaido" />
          </div>
          <div className="mp-hotel-en" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Toya Manseikaku Hotel</div>
          <span className="mp-meal-badge mp-meal-badge--bfdn-dark">🍳🥩 附早晚餐</span>
          <img className="mp-spot-img" src={img("toya-lake.jpg")} alt="洞爺湖" style={{ marginTop: 12 }} />
          <div className="mp-two-col" style={{ marginTop: 10 }}>
            <div className="mp-col-item mp-col-item--dark">
              <div className="mp-col-label-light">晚餐</div>
              <div className="mp-col-val-light">飯店自助餐</div>
            </div>
            <div className="mp-col-item mp-col-item--dark">
              <div className="mp-col-label-light">溫泉</div>
              <div className="mp-col-val-light">洞爺湖溫泉住宿</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Day 5 ── */}
      <section id="mp-s-day5" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day5.jpg")} alt="Day 5" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 5</span>
              <span className="mp-day-date">10/10（六）有珠山 · 神仙沼</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d5-usu" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🚠 有珠山纜車</span>
            <MapBtn q="Usuzan Ropeway Showa Shinzan Parking" />
          </div>
          <div className="mp-highlight">導航：「有珠山 昭和新山駐車場」</div>
          <div className="mp-muted">纜車約每 15 分鐘一班（00、15、30、45 分）。下山後到道之驛洞爺湖展望台看湖景。</div>
        </div>

        <div id="mp-c-d5-numa" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🌿 二世谷 · 神仙沼</span>
            <MapBtn q="Shinsennuma Niseko Hokkaido" />
          </div>
          <img className="mp-spot-img" src={img("senen-numa.jpg")} alt="神仙沼" />
          <div className="mp-muted" style={{ marginTop: 8 }}>
            沿途停 Niseko View Plaza 道路休息站、高橋牧場，最後沿木棧道走神仙沼，欣賞秋季濕地與楓紅。
          </div>
        </div>

        <div id="mp-c-d5-dining" className="mp-card">
          <div className="mp-card-title">🍽️ 今日餐飲</div>
          {[
            { name: "早餐：飯店（洞爺湖萬世閣）", sub: "" },
            { name: "午餐：行程中彈性安排", sub: "" },
            { name: "晚餐：札幌らーめん 大心 ニセコ店", sub: "Sapporo Ramen Daishin Niseko", q: "Sapporo Ramen Daishin Niseko" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{i.name}</span>
                {"q" in i && i.q && <MapBtn q={i.q} />}
              </div>
            </div>
          ))}
        </div>

        <div id="mp-c-d5-hotel" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏨 今晚住宿</span>
            <MapBtn q="Torifito Hotel & Pod Niseko" />
          </div>
          <div className="mp-hotel-name">Torifito Hotel &amp; Pod Niseko</div>
          <div className="mp-hotel-en">二世谷</div>
          <span className="mp-meal-badge mp-meal-badge--bf">🍳 附早餐</span>
        </div>
      </section>

      {/* ── Day 6 ── */}
      <section id="mp-s-day6" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day6.jpg")} alt="Day 6" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 6</span>
              <span className="mp-day-date">10/11（日）積丹 · 余市 · 小樽</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d6-shakotan" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🌊 積丹半島 · 余市</span>
            <MapBtn q="Kamui Misaki Shakotan Hokkaido" />
          </div>
          <img className="mp-spot-img" src={img("shakotan.jpg")} alt="積丹" />
          {[
            { name: "島武意海岸", q: "Shimamui Coast Shakotan" },
            { name: "神威岬", q: "Cape Kamui Shakotan" },
            { name: "余市威士忌蒸餾所", q: "Nikka Whisky Yoichi Distillery" },
            { name: "柿崎商店與對面的余市", q: "Kakizaki Shoten Yoichi" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{i.name}</span>
                <MapBtn q={i.q} />
              </div>
            </div>
          ))}
        </div>

        <div id="mp-c-d6-glow" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏡 小樽天狗山 · Glow 別墅</span>
            <MapBtn q="Glow villa Otaru Hokkaido" />
          </div>
          <div className="mp-list-item">
            <div className="mp-list-name" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>小樽天狗山觀景台</span>
              <MapBtn q="Tenguyama Observation Deck Otaru" />
            </div>
          </div>
          <div className="mp-hotel-en" style={{ marginTop: 8 }}>Glow — 小樽近郊包棟別墅</div>
          <span className="mp-meal-badge mp-meal-badge--none">⭕ 不含餐</span>
          <div className="mp-note">Glow 不含餐，餐食需自行安排</div>
        </div>

        <div id="mp-c-d6-bbq" className="mp-card">
          <div className="mp-card-title">🍽️ 今日餐飲</div>
          {[
            { name: "早餐：飯店（Torifito）", sub: "" },
            { name: "午餐：行程中彈性安排", sub: "" },
            { name: "晚餐：行程中彈性安排", sub: "可依當天進度選擇小樽市區餐廳" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              {i.sub && <div className="mp-list-sub">{i.sub}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Day 7 ── */}
      <section id="mp-s-day7" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day7.jpg")} alt="Day 7" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 7</span>
              <span className="mp-day-date">10/12（一）小樽慢遊 · 返回札幌</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d7-market" className="mp-card">
          <div className="mp-card-title">🛍️ 三角市場 · 堺町通</div>
          {[
            { name: "三角市場", q: "Sankaku Market Otaru" },
            { name: "堺町通商店街", q: "Sakaimachi Street Otaru" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{i.name}</span>
                <MapBtn q={i.q} />
              </div>
            </div>
          ))}
          <div className="mp-muted" style={{ marginTop: 8 }}>早餐自理。順便買伴手禮。</div>
        </div>

        <div id="mp-c-d7-canal" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏮 小樽運河</span>
            <MapBtn q="Otaru Canal" />
          </div>
          <img className="mp-spot-img" src={img("otaru-canal.jpg")} alt="小樽運河" />
          <div className="mp-muted" style={{ marginTop: 8 }}>
            沿水岸慢慢走，欣賞紅磚倉庫群。
          </div>
        </div>

        <div id="mp-c-d7-back" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏨 返回札幌 · 今晚住宿</span>
            <MapBtn q="Sapporo Keikyu EX Hotel" />
          </div>
          <div className="mp-hotel-name">札幌京急 EX 酒店</div>
          <div className="mp-hotel-en">Sapporo Keikyu EX Hotel</div>
          <div className="mp-muted" style={{ marginTop: 4, marginBottom: 6 }}>傍晚回札幌，還車後入住</div>
          <span className="mp-meal-badge mp-meal-badge--bf">🍳 附早餐</span>
          <div className="mp-list-item" style={{ marginTop: 10 }}>
            <div className="mp-list-name">午餐 / 晚餐：行程中彈性安排</div>
          </div>
          <div className="mp-note">⚠️ 全員不吃羊肉！選餐廳前確認菜單</div>
        </div>
      </section>

      {/* ── Day 8 ── */}
      <section id="mp-s-day8" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day8.jpg")} alt="Day 8" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 8</span>
              <span className="mp-day-date">10/13（二）快樂賦歸</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d8-jr" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🚃 08:45 出發 · JR 前往機場</span>
            <MapBtn q="New Chitose Airport Hokkaido" />
          </div>
          <div className="mp-muted">07:00 飯店早餐。JR 班次參考（發車 → 抵達）：</div>
          {["09:00 → 09:37", "09:04 → 09:48", "09:18 → 09:57"].map(t => (
            <div className="mp-list-item" key={t}>
              <div className="mp-list-name">{t}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-d8-depart" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">✈️ 返程</div>
          <div className="mp-row-between">
            <div className="mp-flight-node">
              <div className="mp-flight-airport-light">新千歲機場</div>
              <div className="mp-flight-time-light">12:05</div>
              <div className="mp-flight-airport-light">IT 235</div>
            </div>
            <div className="mp-flight-mid-light">→</div>
            <div className="mp-flight-node">
              <div className="mp-flight-time-light">15:20</div>
              <div className="mp-flight-airport-light">桃園機場</div>
            </div>
          </div>
          <div className="mp-muted-light" style={{ marginTop: 8 }}>午餐：機上</div>
          <div className="mp-finale">北海道，謝謝你。帶著滿行李箱的回憶圓滿賦歸。</div>
        </div>
      </section>

      {/* ── 出發前必知 ── */}
      <section id="mp-s-know" className="mp-day">
        <div className="mp-day-header--nophoto">
          <span className="mp-day-tag mp-day-tag--dark">出發前</span>
          <span className="mp-day-date mp-day-date--dark">必知事項 &amp; 伴手禮攻略</span>
        </div>

        <div id="mp-c-mk-booking" className="mp-card mp-card--warn">
          <div className="mp-card-title">📋 提早訂位！</div>
          <div className="mp-list-item">
            <div className="mp-list-name">10/07 (Wed) 17:30 · 蟹座</div>
            <div className="mp-list-sub">Day 2 晚餐 · 六人含長輩，請提早上網訂位</div>
          </div>
        </div>

        <div id="mp-c-mk-warm" className="mp-card">
          <div className="mp-card-title">🧥 保暖衣物必備</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">白天氣溫</div>
              <div className="mp-col-val" style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>~15°C</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">早晚氣溫</div>
              <div className="mp-col-val" style={{ fontSize: 22, fontWeight: 700, color: "#2a7fbd" }}>~5°C</div>
            </div>
          </div>
          <div className="mp-note">早晚溫差大！洞爺湖、二世谷、積丹等戶外景點，帶保暖防風外套</div>
        </div>

        <div id="mp-c-mk-notes" className="mp-card">
          <div className="mp-card-title">⚠️ 注意事項</div>
          {[
            { name: "全員不吃羊肉", sub: "訂任何餐廳前確認菜單" },
            { name: "Day 4 起自駕", sub: "出發前確認 WNR 取車資料、駕照 / 日文譯本、導航設定" },
            { name: "10/11 Glow 別墅不含餐", sub: "不含餐，餐食需自行安排" },
          ].map(n => (
            <div className="mp-list-item" key={n.name}>
              <div className="mp-list-name">{n.name}</div>
              <div className="mp-list-sub">{n.sub}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-mk-souvenir" className="mp-card">
          <div className="mp-card-title">🎁 北海道伴手禮攻略</div>
          <div className="mp-souvenir-grid">
            {[
              { name: "白色戀人", shops: "石屋製菓・必買首選", img: "souvenir-shiroi-koibito.jpg" },
              { name: "六花亭", shops: "奶油葡萄乾夾心餅", img: "souvenir-rokkatei.jpg" },
            ].map(s => (
              <div className="mp-souvenir-item" key={s.name}>
                <img className="mp-souvenir-img" src={img(s.img)} alt={s.name} />
                <div className="mp-souvenir-name">{s.name}</div>
                <div className="mp-souvenir-shops">{s.shops}</div>
              </div>
            ))}
          </div>
          <div className="mp-tags-row" style={{ marginTop: 10 }}>
            {["薯條三兄弟・北海道限定", "北海道起司蛋糕・新鮮冷藏"].map(t => (
              <span key={t} className="mp-tag-chip">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="mp-footer">北海道，我們來了。</div>

      <div className="mp-pdf-section">
        <a
          href={`${baseUrl}北海道家族旅遊行程手冊.pdf`}
          download="北海道家族旅遊行程手冊.pdf"
          className="mp-pdf-btn"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5v-2z"/>
          </svg>
          下載行程手冊 PDF
        </a>
        <div className="mp-pdf-date">2026 / 10 / 06 ~ 2026 / 10 / 13</div>
      </div>

      {SHOW_FEEDBACK && (
        <button className="mp-feedback-fab" onClick={() => setFeedbackOpen(true)} aria-label="意見回饋">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden>
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </button>
      )}
      {mapOpen && <MapLightbox src={img("route-map.jpg")} onClose={() => setMapOpen(false)} />}
      {SHOW_FEEDBACK && feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}

      <MobileAudioFab
        baseUrl={baseUrl}
        onLock={handleLock}
        onUnlock={handleUnlock}
      />
    </div>
  );
}
