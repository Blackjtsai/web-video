import { useEffect, useRef, useState } from "react";
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

/* ── 41 段口播 ── */
const SEGMENTS = [
  { id: "coldopen",  step: 1, cardId: "mp-s-hero" },
  { id: "coldopen",  step: 2, cardId: "mp-s-hero" },
  { id: "coldopen",  step: 3, cardId: "mp-s-hero" },
  { id: "coldopen",  step: 4, cardId: "mp-s-hero" },
  { id: "day1",      step: 1, cardId: "mp-s-day1" },
  { id: "day1",      step: 2, cardId: "mp-c-d1-flight" },
  { id: "day1",      step: 3, cardId: "mp-c-d1-spots" },
  { id: "day1",      step: 4, cardId: "mp-c-d1-dinner" },
  { id: "day2",      step: 1, cardId: "mp-s-day2" },
  { id: "day2",      step: 2, cardId: "mp-c-d2-koibito" },
  { id: "day2",      step: 3, cardId: "mp-c-d2-t38" },
  { id: "day2",      step: 4, cardId: "mp-c-d2-dining" },
  { id: "day3",      step: 1, cardId: "mp-s-day3" },
  { id: "day3",      step: 2, cardId: "mp-c-d3-market" },
  { id: "day3",      step: 3, cardId: "mp-c-d3-jozankei" },
  { id: "day3",      step: 4, cardId: "mp-c-d3-dining" },
  { id: "day4",      step: 1, cardId: "mp-s-day4" },
  { id: "day4",      step: 2, cardId: "mp-c-d4-car" },
  { id: "day4",      step: 3, cardId: "mp-c-d4-crab" },
  { id: "day4",      step: 4, cardId: "mp-c-d4-pass" },
  { id: "day4",      step: 5, cardId: "mp-c-d4-toya" },
  { id: "day5",      step: 1, cardId: "mp-s-day5" },
  { id: "day5",      step: 2, cardId: "mp-c-d5-farm" },
  { id: "day5",      step: 3, cardId: "mp-c-d5-numa" },
  { id: "day5",      step: 4, cardId: "mp-c-d5-dining" },
  { id: "day6",      step: 1, cardId: "mp-s-day6" },
  { id: "day6",      step: 2, cardId: "mp-c-d6-shakotan" },
  { id: "day6",      step: 3, cardId: "mp-c-d6-glow" },
  { id: "day6",      step: 4, cardId: "mp-c-d6-bbq" },
  { id: "day7",      step: 1, cardId: "mp-s-day7" },
  { id: "day7",      step: 2, cardId: "mp-c-d7-canal" },
  { id: "day7",      step: 3, cardId: "mp-c-d7-shop" },
  { id: "day7",      step: 4, cardId: "mp-c-d7-wagyu" },
  { id: "day8",      step: 1, cardId: "mp-s-day8" },
  { id: "day8",      step: 2, cardId: "mp-c-d8-shopping" },
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
            <label className="mp-fb-label">你是誰？</label>
            <input
              className="mp-fb-input"
              type="text"
              placeholder="輸入你的名字"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <label className="mp-fb-label">你的想法</label>
            <textarea
              className="mp-fb-textarea"
              placeholder="對這次北海道行程有什麼期待或建議？"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              rows={4}
            />
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

interface Props { baseUrl: string; }

export function MobilePage({ baseUrl }: Props) {
  const img = (name: string) => `${baseUrl}images-mobile/${name}`;
  const [scrollLocked,  setScrollLocked]  = useState(false);
  const [feedbackOpen,  setFeedbackOpen]  = useState(false);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    root.style.overflowY = "auto";
    root.style.overflowX = "hidden";
    root.style.height    = "100dvh";
    root.scrollTop = 0;
    return () => {
      root.style.overflowY = "";
      root.style.overflowX = "";
      root.style.height    = "";
    };
  }, []);

  const isLineBrowser = navigator.userAgent.indexOf("Line/") > -1;

  return (
    <div className="mp-root">

      {/* ── 滑動鎖定遮罩：播放時攔截手動捲動，點擊解鎖 ── */}
      {scrollLocked && (
        <div className="mp-scroll-lock" onClick={() => setScrollLocked(false)}>
          <div className="mp-unlock-hint">點此自由瀏覽</div>
        </div>
      )}

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
            <span className="mp-badge">自駕四天</span>
          </div>
          <div className="mp-scroll-hint">▼ 滑動查看行程</div>
        </div>
      </div>

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
              <div className="mp-flight-time">09:15</div>
            </div>
            <div className="mp-flight-mid">IT 234 → 約 3.5h</div>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">新千歲機場</div>
              <div className="mp-flight-time">13:50</div>
            </div>
          </div>
          <div className="mp-tag-inline">台灣虎航</div>
        </div>

        <div id="mp-c-d1-spots" className="mp-card">
          <div className="mp-card-title">🚃 抵達後 · 市區慢活</div>
          {[
            { name: "JR 快速 Airport 入市區", sub: "新千歲 → 札幌 約 38 分" },
            { name: "入住飯店 · 放行李", sub: "建議 Dormy Inn / Vessel Hotel" },
            { name: "麒麟啤酒廠（含長輩）", sub: "免費導覽 + 試飲，室內不用走遠" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              <div className="mp-list-sub">{i.sub}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-d1-dinner" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🍜 晚餐 · 薄野拉麵橫丁</span>
            <MapBtn q="Susukino Ramen Alley Sapporo" />
          </div>
          <div className="mp-highlight">薄野拉麵橫丁</div>
          <div className="mp-muted">北海道必吃濃厚味噌拉麵，暖胃補體力</div>
        </div>
      </section>

      {/* ── Day 2 ── */}
      <section id="mp-s-day2" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day2.jpg")} alt="Day 2" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 2</span>
              <span className="mp-day-date">10/07（三）室內免走路日</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d2-koibito" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🍪 白色戀人公園</span>
            <MapBtn q="白い恋人パーク 札幌" />
          </div>
          <img className="mp-spot-img" src={img("koibito-park.jpg")} alt="白色戀人公園" />
          <div className="mp-two-col" style={{ marginTop: 10 }}>
            <div className="mp-col-item">
              <div className="mp-col-label">長輩</div>
              <div className="mp-col-val">無障礙電梯、室內咖啡廳、落地窗看紅葉</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">年輕人</div>
              <div className="mp-col-val">英式花園紅葉打卡、歐式建築出片</div>
            </div>
          </div>
        </div>

        <div id="mp-c-d2-t38" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🗼 JR 塔 T38 展望室</span>
            <MapBtn q="JR Tower T38 Sapporo" />
          </div>
          <div className="mp-highlight">傍晚登頂 · 看夕陽夜景</div>
          <div className="mp-muted">直達電梯至 38F，坐著俯瞰全市楓紅與夜景，免吹風</div>
        </div>

        <div id="mp-c-d2-dining" className="mp-card">
          <div className="mp-card-title">🍽️ 今日餐飲</div>
          {[
            { name: "午餐：札幌湯咖哩", sub: "北海道必吃，濃郁湯底暖胃" },
            { name: "晚餐：百貨天婦羅 / 壽司", sub: "JR 塔車站共構，長輩省力" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              <div className="mp-list-sub">{i.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Day 3 ── */}
      <section id="mp-s-day3" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day3.jpg")} alt="Day 3" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 3</span>
              <span className="mp-day-date">10/08（四）海鮮 × 紅葉泡湯</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d3-market" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🦀 二条市場 08:30</span>
            <MapBtn q="Nijo Market Sapporo" />
          </div>
          <div className="mp-highlight">帝王蟹・海膽・海鮮丼</div>
          <div className="mp-muted">早上八點半開市，奢華海鮮早午餐</div>
          <div className="mp-note">長輩不吃生食 → 現烤熟魚定食可選</div>
        </div>

        <div id="mp-c-d3-jozankei" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>♨️ 定山溪溫泉</span>
            <MapBtn q="定山渓温泉 北海道" />
          </div>
          <img className="mp-spot-img" src={img("jozankei.jpg")} alt="定山溪溫泉" />
          <div className="mp-muted" style={{ marginTop: 8 }}>
            Kappa Liner 巴士約 1 小時直達。10 月正值紅葉巔峰，
            長輩入住溫泉旅館日歸泡湯，不需走路。
          </div>
        </div>

        <div id="mp-c-d3-dining" className="mp-card">
          <div className="mp-card-title">🍽️ 今日餐飲</div>
          {[
            { name: "早午餐：二条市場海鮮丼", sub: "帝王蟹 + 海膽，奢華主食" },
            { name: "晚餐：回札幌・極品拉麵", sub: "暖胃完美收尾" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              <div className="mp-list-sub">{i.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Day 4 ── */}
      <section id="mp-s-day4" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day4.jpg")} alt="Day 4" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 4</span>
              <span className="mp-day-date">10/09（五）自駕第一天！螃蟹 × 花火</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d4-car" className="mp-card">
          <div className="mp-card-title">🚗 取車 · 自駕開始</div>
          <div className="mp-highlight">Toyota Hiace 10 人座</div>
          <div className="mp-muted">六人 + 行李全塞得下 · 10/09–10/12 四天</div>
        </div>

        <div id="mp-c-d4-crab" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🦀 螃蟹大宴 11:30</span>
            <MapBtn q="札幌蟹家本店" />
          </div>
          <div className="mp-tags-row">
            {["螃蟹家", "蝦蟹合戰"].map(r => (
              <span key={r} className="mp-tag-chip">{r}</span>
            ))}
          </div>
          <div className="mp-highlight">帝王蟹・松葉蟹・懷石料理</div>
          <div className="mp-note">提早一個月訂位！六人含長輩</div>
        </div>

        <div id="mp-c-d4-pass" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏔️ 中山峠・遠眺羊蹄山</span>
            <MapBtn q="中山峠 北海道" />
          </div>
          <div className="mp-muted">途中短暫停留，遠眺「蝦夷富士」，完美錐形輪廓</div>
        </div>

        <div id="mp-c-d4-toya" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">🎆 洞爺湖萬世閣</div>
          <img className="mp-spot-img" src={img("toya-lake.jpg")} alt="洞爺湖" />
          <div className="mp-two-col" style={{ marginTop: 10 }}>
            <div className="mp-col-item mp-col-item--dark">
              <div className="mp-col-label-light">入住</div>
              <div className="mp-col-val-light">頂級溫泉晚宴<br />飯店附早晚餐</div>
            </div>
            <div className="mp-col-item mp-col-item--dark">
              <div className="mp-col-label-light">夜間</div>
              <div className="mp-col-val-light">洞爺湖花火大會<br />在房間輕鬆觀賞</div>
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
              <span className="mp-day-date">10/10（六）如畫秋景孝親日</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d5-farm" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🐄 Lake Hill Farm</span>
            <MapBtn q="Lake Hill Farm Kimobetsu Hokkaido" />
          </div>
          <div className="mp-highlight">網美牧場 · 冰淇淋 × 羊蹄山</div>
          <div className="mp-muted">北海道鮮乳義式冰淇淋，配大草皮和羊蹄山全景</div>
        </div>

        <div id="mp-c-d5-numa" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🌿 二世谷神仙沼</span>
            <MapBtn q="神仙沼 二世谷 北海道" />
          </div>
          <img className="mp-spot-img" src={img("senen-numa.jpg")} alt="神仙沼" />
          <div className="mp-muted" style={{ marginTop: 8 }}>
            全程無障礙木棧道，無台階無陡坡。秋季濕地楓紅，帶長輩散步如沐畫中。
          </div>
          <div className="mp-note">孝親首選！長輩零障礙</div>
        </div>

        <div id="mp-c-d5-dining" className="mp-card">
          <div className="mp-card-title">🍽️ 今日餐飲</div>
          {[
            { name: "午餐：二世谷在地蔬食 / 手作漢堡", sub: "在地食材，清爽自然" },
            { name: "晚餐：Torifito 附近居酒屋", sub: "步行即達，道地北海道味" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              <div className="mp-list-sub">{i.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Day 6 ── */}
      <section id="mp-s-day6" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day6.jpg")} alt="Day 6" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 6</span>
              <span className="mp-day-date">10/11（日）積丹藍 × 家族 BBQ</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d6-shakotan" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🌊 積丹半島自駕</span>
            <MapBtn q="積丹岬 北海道" />
          </div>
          <img className="mp-spot-img" src={img("shakotan.jpg")} alt="積丹" />
          <div className="mp-muted" style={{ marginTop: 8 }}>
            沿積丹半島海岸線自駕，秋季特有的「積丹藍」——清澈湛藍海色，北海道限定風景。
          </div>
        </div>

        <div id="mp-c-d6-glow" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏡 Glow 包棟別墅</span>
            <MapBtn q="Glow villa Otaru Hokkaido" />
          </div>
          <div className="mp-highlight">小樽近郊質感別墅</div>
          <div className="mp-muted">下午提早入住，傍晚全家開車去生鮮超市採買</div>
          <div className="mp-tags-row">
            {["北海道鮮乳", "手作麵包", "麝香葡萄", "頂級和牛"].map(t => (
              <span key={t} className="mp-tag-chip">{t}</span>
            ))}
          </div>
          <div className="mp-note">別墅無附早餐！需自行採買</div>
        </div>

        <div id="mp-c-d6-bbq" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">🔥 家族和牛 BBQ</div>
          <div className="mp-big-light">頂級和牛私廚饗宴</div>
          <div className="mp-muted-light">全家在別墅廚房一起下廚——這種感覺，任何飯店都吃不到</div>
        </div>
      </section>

      {/* ── Day 7 ── */}
      <section id="mp-s-day7" className="mp-day">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("day7.jpg")} alt="Day 7" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">Day 7</span>
              <span className="mp-day-date">10/12（一）小樽遊船 × 和牛慶功宴</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div id="mp-c-d7-canal" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>⛵ 小樽運河遊船</span>
            <MapBtn q="小樽運河クルーズ" />
          </div>
          <img className="mp-spot-img" src={img("otaru-canal.jpg")} alt="小樽運河" />
          <div className="mp-muted" style={{ marginTop: 8 }}>
            坐船俯瞰浪漫紅磚倉庫群，長輩免走路。拍出的照片比岸上還好看。
          </div>
        </div>

        <div id="mp-c-d7-shop" className="mp-card">
          <div className="mp-card-title">🛍️ 下船後採購</div>
          <div className="mp-tags-row">
            {["音樂盒堂", "北菓樓"].map(s => (
              <span key={s} className="mp-tag-chip">{s}</span>
            ))}
          </div>
          <div className="mp-muted">最後一次在小樽採買伴手禮</div>
          <div className="mp-note">還車前加油！10/12 四天自駕結束</div>
        </div>

        <div id="mp-c-d7-wagyu" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">🥩 和牛慶功宴</div>
          <div className="mp-big-light">自駕四天圓滿成功！</div>
          <div className="mp-muted-light">札幌頂級燒肉名店，慶祝自駕完結</div>
          <div className="mp-tags-row" style={{ marginTop: 10 }}>
            {["燒肉世界肉之兵衛", "德壽"].map(r => (
              <span key={r} className="mp-tag-chip mp-tag-chip--light">{r}</span>
            ))}
          </div>
          <div className="mp-muted-light" style={{ marginTop: 8, fontWeight: 700, color: "#ffcc88" }}>
            ⚠️ 全員不吃羊肉！訂位前確認菜單
          </div>
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

        <div id="mp-c-d8-shopping" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🛒 新千歲機場最後大補貨</span>
            <MapBtn q="New Chitose Airport Hokkaido" />
          </div>
          <div className="mp-muted">辦完登機手續後，國際線出發廳掃貨</div>
          <div className="mp-souvenir-grid">
            {[
              { name: "白色戀人", img: "souvenir-shiroi-koibito.jpg" },
              { name: "六花亭 Marusei", img: "souvenir-rokkatei.jpg" },
            ].map(s => (
              <div className="mp-souvenir-item" key={s.name}>
                <img className="mp-souvenir-img" src={img(s.img)} alt={s.name} />
                <div className="mp-souvenir-name">{s.name}</div>
              </div>
            ))}
          </div>
          <div className="mp-tags-row" style={{ marginTop: 8 }}>
            {["薯條三兄弟", "北海道起司蛋糕"].map(t => (
              <span key={t} className="mp-tag-chip">{t}</span>
            ))}
          </div>
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
          {[
            { date: "10/09 (Thu)", name: "螃蟹大宴", note: "螃蟹家 / 蝦蟹合戰" },
            { date: "10/12 (Sun)", name: "和牛慶功宴", note: "肉之兵衛 / 德壽" },
          ].map(b => (
            <div className="mp-list-item" key={b.date}>
              <div className="mp-list-name">{b.date} · {b.name}</div>
              <div className="mp-list-sub">{b.note} · 請提早至少一個月網路訂位</div>
            </div>
          ))}
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
          <div className="mp-note">防風防潑水外套必備！洞爺湖 &amp; 二世谷山區更冷</div>
        </div>

        <div id="mp-c-mk-notes" className="mp-card">
          <div className="mp-card-title">⚠️ 飲食 &amp; 出行注意</div>
          {[
            { name: "全員不吃羊肉", sub: "訂任何餐廳前確認菜單，和牛燒肉選非羊肉套餐" },
            { name: "長輩交通：計程車代步", sub: "六人分兩台，省力且免爬地鐵樓梯" },
            { name: "10/11 Glow 別墅無早餐", sub: "傍晚需去附近生鮮超市採買 BBQ 食材" },
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
            {["薯條三兄弟・北海道限定", "北海道起司蛋糕・新鮮冷藏", "帝王蟹味噌湯包"].map(t => (
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

      {/* 意見回饋按鈕（左下角，暫時性） */}
      <button className="mp-feedback-btn" onClick={() => setFeedbackOpen(true)}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
        <span>意見</span>
      </button>
      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}

      <MobileAudioFab
        baseUrl={baseUrl}
        onLock={() => setScrollLocked(true)}
        onUnlock={() => setScrollLocked(false)}
      />
    </div>
  );
}
