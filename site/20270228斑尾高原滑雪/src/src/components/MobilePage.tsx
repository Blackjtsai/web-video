import { useCallback, useEffect, useRef, useState } from "react";
import "./MobilePage.css";

/* 12 段口播，對應頁面各節主卡片 id */
const SEGMENTS = [
  { id: "coldopen",  step: 1, cardId: "mp-s-hero" },
  { id: "overview",  step: 1, cardId: "mp-s-overview" },
  { id: "day1",      step: 1, cardId: "mp-s-day1" },
  { id: "day1",      step: 2, cardId: "mp-c-d1-ski" },
  { id: "day2",      step: 1, cardId: "mp-s-day2" },
  { id: "day3",      step: 1, cardId: "mp-s-day3" },
  { id: "day4",      step: 1, cardId: "mp-s-day4" },
  { id: "day4",      step: 2, cardId: "mp-c-d4-return" },
  { id: "budget",    step: 1, cardId: "mp-s-budget" },
  { id: "budget",    step: 2, cardId: "mp-c-budget-table" },
  { id: "must-know", step: 1, cardId: "mp-s-know" },
  { id: "must-know", step: 2, cardId: "mp-c-mk-2" },
];

const CHAPTER_GROUPS = [
  { label: "開場",     start: 0,  end: 0  },
  { label: "總覽",     start: 1,  end: 1  },
  { label: "Day 1",    start: 2,  end: 3  },
  { label: "Day 2",    start: 4,  end: 4  },
  { label: "Day 3",    start: 5,  end: 5  },
  { label: "Day 4",    start: 6,  end: 7  },
  { label: "住宿預算", start: 8,  end: 9  },
  { label: "出發前",   start: 10, end: 11 },
];

function scrollToCard(idx: number) {
  const seg = SEGMENTS[idx];
  if (!seg) return;
  const el = document.getElementById(seg.cardId);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

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
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    </a>
  );
}

/* ── 右下角圓形 FAB + 長按 Scrubber ── */
interface FabProps { baseUrl: string; onLock: () => void; onUnlock: () => void; }
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
    if (playing) onLock(); else onUnlock();
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
        aria-label={playing ? "暫停" : "播放語音導讀"}
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

/* ── 逐日行程資料 ── */
interface DayInfo {
  tag: string;
  date: string;
  gradientClass: string;
  time: string;
  focus: string;
}

const DAYS: DayInfo[] = [
  { tag: "Day 1", date: "2/28（日）Madarao 初探",   gradientClass: "mp-grad--dawn",  time: "約 10:30～16:30", focus: "熟悉主雪場與主要 Lift" },
  { tag: "Day 2", date: "3/1（一）Madarao 全山攻略", gradientClass: "mp-grad--forest", time: "08:30～16:30",   focus: "Tree Run · Powder · 森林地形" },
  { tag: "Day 3", date: "3/2（二）Madarao → Tangram", gradientClass: "mp-grad--dusk",  time: "08:30～16:30",   focus: "共通 Mountain Pass 雙雪場" },
  { tag: "Day 4", date: "3/3（三）Best Snow Day",     gradientClass: "mp-grad--night", time: "08:30～15:00",   focus: "依雪況重刷最愛區域" },
];

const BUDGET_ITEMS = [
  { label: "機票",              amount: "NT$9,000" },
  { label: "住宿",              amount: "NT$3,691" },
  { label: "羽田↔斑尾交通",     amount: "約 NT$4,000" },
  { label: "4 日雪票",          amount: "約 NT$6,600" },
  { label: "保險",              amount: "NT$1,000" },
  { label: "午餐＋晚餐 4 天",   amount: "NT$4,000" },
  { label: "雪具",              amount: "飯店可租，比自備划算" },
];

const MUST_KNOW = [
  { emoji: "🧳", title: "虎航行李規定", desc: "廉航手提與託運行李皆有嚴格重量限制，雪板雪靴通常需另外加購託運額度，訂票時務必確認清楚，避免機場臨櫃加價。" },
  { emoji: "🎿", title: "雪具建議直接飯店租", desc: "Hotel Madam Mirei 現場就能租雪板雪靴，比自己扛雪具搭機更省事也更便宜，不用額外加購廉航託運額度，出發前先確認尺寸與租借價目。" },
  { emoji: "🛡️", title: "保險別漏了滑雪項目", desc: "務必投保涵蓋雪上活動意外的旅遊平安險，一般旅平險未必自動涵蓋滑雪，出發前確認保單條款。" },
  { emoji: "📅", title: "V1 班表僅供參考", desc: "目前交通與雪票資訊以 2025/26 季北陸新幹線、斑尾冬季巴士估算，2026/27 正式班表、夜滑日期與新雪票價公布後仍需再次確認。" },
  { emoji: "💴", title: "日幣現金要備妥", desc: "斑尾山區小店與部分巴士只收現金，建議先在東京站換好足額日幣，避免山區找不到 ATM 或刷卡機。" },
  { emoji: "🚌", title: "交通卡＋巴士票分開", desc: "東京市區段可用 Suica / Pasmo 交通卡轉乘更方便，但斑尾當地巴士通常需要另外購票，別忘了預留現金與時間。" },
];

/* ── 主組件 ── */
export function MobilePage({ baseUrl }: Props) {
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    root.style.overflowY = "auto";
    root.style.overflowX = "hidden";
    root.style.height = "100dvh";
    root.scrollTop = 0;
    return () => {
      root.style.overflowY = "";
      root.style.overflowX = "";
      root.style.height = "";
    };
  }, []);

  /* scroll lock：ref 即時更新，touchmove preventDefault 立刻生效，不等 React re-render
     勿用 position:fixed transparent overlay — iOS Safari 解除後 scroll 狀態有時不恢復 */
  const scrollLockedRef = useRef(false);
  const handleLock   = useCallback(() => { scrollLockedRef.current = true;  }, []);
  const handleUnlock = useCallback(() => { scrollLockedRef.current = false; }, []);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const preventScroll = (e: TouchEvent) => {
      if (scrollLockedRef.current) e.preventDefault();
    };
    root.addEventListener("touchmove", preventScroll, { passive: false });
    return () => root.removeEventListener("touchmove", preventScroll);
  }, []);

  const isLineBrowser = navigator.userAgent.indexOf("Line/") > -1;
  const img = (name: string) => `${baseUrl}images-mobile/${name}`;

  return (
    <div className="mp-root">
      {isLineBrowser && (
        <div className="mp-line-banner">
          請點右上角 <strong>···</strong> → <strong>在瀏覽器中開啟</strong>以獲得最佳體驗
        </div>
      )}

      {/* ── Hero ── */}
      <div id="mp-s-hero" className="mp-hero mp-grad--hero">
        <img className="mp-cover-img" src={img("hero.jpg")} alt="斑尾高原滑雪場" />
        <div className="mp-cover-scrim" />
        <div className="mp-hero-text">
          <div className="mp-hero-sub">2027 斑尾高原滑雪行程 · V1</div>
          <div className="mp-hero-title">斑尾高原<br />四日滑雪</div>
          <div className="mp-hero-badges">
            <span className="mp-badge">6 人成行</span>
            <span className="mp-badge">3 晚 4 日</span>
            <span className="mp-badge">虎航羽田</span>
            <span className="mp-badge">約 NT$28,300／人</span>
          </div>
          <div className="mp-scroll-hint">▼ 滑動查看行程</div>
        </div>
      </div>

      {/* ── Overview ── */}
      <section id="mp-s-overview" className="mp-section">
        <div className="mp-section-header">
          <span className="mp-day-tag">行程總覽</span>
          <span className="mp-day-date">MADARAO / IIYAMA</span>
        </div>
        <div className="mp-card">
          <div className="mp-card-title">核心玩法</div>
          <p className="mp-route-desc">
            羽田 → 東京 → 飯山 → 斑尾，飯山到雪場約 30 分鐘，是本行程最大優勢。
            第一天理想狀況約 10:30 開滑，最後一天滑到下午再撤回羽田，把雪季時光用到極致。
          </p>
        </div>
        <div className="mp-card">
          <div className="mp-card-title">住宿基地</div>
          <p className="mp-route-desc">
            Hotel Madam Mirei，距斑尾高原滑雪場約數分鐘步行，2/28 入住、3/3 退房，3 房 3 晚。
          </p>
        </div>
        <div className="mp-card mp-card--note">
          <div className="mp-card-title">V1 規劃基準</div>
          <p className="mp-route-desc">
            本版以目前可取得的 2025/26 北陸新幹線、斑尾冬季巴士與雪票資訊估算，
            2026/27 正式班表、夜滑日期與新季票價公布後需再確認。
          </p>
        </div>
      </section>

      {/* ── Day 1（含去程交通） ── */}
      <section id="mp-s-day1" className="mp-day">
        <div className={`mp-day-cover ${DAYS[0].gradientClass}`}>
          <img className="mp-cover-img" src={img("day1.jpg")} alt={DAYS[0].tag} />
          <div className="mp-cover-scrim" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">{DAYS[0].tag}</span>
              <span className="mp-day-date">{DAYS[0].date}</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">去程交通｜2/28（日）</div>
          <div className="mp-transit-list">
            <div className="mp-transit-row"><span className="mp-transit-time">04:00</span><span className="mp-transit-text">羽田 T3 抵達，入境＋領行李／雪板</span></div>
            <div className="mp-transit-row"><span className="mp-transit-time">05:15</span><span className="mp-transit-text">離開羽田，電車前往東京站</span></div>
            <div className="mp-transit-row"><span className="mp-transit-time">06:28</span><span className="mp-transit-text">東京 → 飯山，北陸新幹線 Hakutaka 551</span></div>
            <div className="mp-transit-row"><span className="mp-transit-time">08:16</span><span className="mp-transit-text">飯山站抵達，轉斑尾高原方向巴士</span></div>
            <div className="mp-transit-row"><span className="mp-transit-time">09:35</span><span className="mp-transit-text">斑尾高原口前下車，步行到飯店</span></div>
            <div className="mp-transit-row"><span className="mp-transit-time">10:30</span><span className="mp-transit-text">寄行李、換裝後，開始滑雪</span></div>
          </div>
        </div>

        <div id="mp-c-d1-ski" className="mp-card">
          <div className="mp-card-title">⛷ {DAYS[0].time}</div>
          <p className="mp-route-desc">{DAYS[0].focus}。若當季夜滑有開，可視體力加滑。</p>
          <MapBtn q="Madarao Kogen Ski Resort" />
        </div>
      </section>

      {/* ── Day 2 ── */}
      <section id="mp-s-day2" className="mp-day">
        <div className={`mp-day-cover ${DAYS[1].gradientClass}`}>
          <img className="mp-cover-img" src={img("day2.jpg")} alt={DAYS[1].tag} />
          <div className="mp-cover-scrim" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">{DAYS[1].tag}</span>
              <span className="mp-day-date">{DAYS[1].date}</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>
        <div className="mp-card">
          <div className="mp-card-title">⛷ {DAYS[1].time}</div>
          <p className="mp-route-desc">主攻斑尾特色 {DAYS[1].focus}，非壓雪地形是斑尾滑雪迷最推崇的一天。</p>
          <MapBtn q="Madarao Kogen Ski Resort" />
        </div>
      </section>

      {/* ── Day 3 ── */}
      <section id="mp-s-day3" className="mp-day">
        <div className={`mp-day-cover ${DAYS[2].gradientClass}`}>
          <img className="mp-cover-img" src={img("day3.jpg")} alt={DAYS[2].tag} />
          <div className="mp-cover-scrim" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">{DAYS[2].tag}</span>
              <span className="mp-day-date">{DAYS[2].date}</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>
        <div className="mp-card">
          <div className="mp-card-title">⛷ {DAYS[2].time}</div>
          <p className="mp-route-desc">使用{DAYS[2].focus}，從斑尾滑到 Tangram，再於下午滑回基地。</p>
          <MapBtn q="Tangram Ski Circus Nagano" />
        </div>
      </section>

      {/* ── Day 4（含回程交通） ── */}
      <section id="mp-s-day4" className="mp-day">
        <div className={`mp-day-cover ${DAYS[3].gradientClass}`}>
          <img className="mp-cover-img" src={img("day4.jpg")} alt={DAYS[3].tag} />
          <div className="mp-cover-scrim" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">{DAYS[3].tag}</span>
              <span className="mp-day-date">{DAYS[3].date}</span>
            </div>
            <div className="mp-scroll-hint">▼ 滑動查看行程</div>
          </div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">⛷ {DAYS[3].time}</div>
          <p className="mp-route-desc">{DAYS[3].focus}，下午收板後搭巴士回飯山。</p>
        </div>

        <div id="mp-c-d4-return" className="mp-card">
          <div className="mp-card-title">回程交通｜3/3（三）</div>
          <div className="mp-transit-list">
            <div className="mp-transit-row"><span className="mp-transit-time">15:00</span><span className="mp-transit-text">最後一天滑雪，下午收板</span></div>
            <div className="mp-transit-row"><span className="mp-transit-time">16:30</span><span className="mp-transit-text">回飯店拿行李、換衣，步行到斑尾高原口前</span></div>
            <div className="mp-transit-row"><span className="mp-transit-time">17:05</span><span className="mp-transit-text">斑尾 → 飯山，冬季班次巴士</span></div>
            <div className="mp-transit-row"><span className="mp-transit-time">17:35</span><span className="mp-transit-text">飯山站，轉北陸新幹線</span></div>
            <div className="mp-transit-row"><span className="mp-transit-time">18:30</span><span className="mp-transit-text">飯山 → 東京站</span></div>
            <div className="mp-transit-row"><span className="mp-transit-time">21:00</span><span className="mp-transit-text">抵達羽田機場，休息，3/4 05:00 起飛</span></div>
          </div>
          <div className="mp-day-note">交通預算：約 10,000 円／單程・約 20,000 円／人來回（約 NT$4,000）</div>
        </div>
      </section>

      {/* ── Budget ── */}
      <section id="mp-s-budget" className="mp-section">
        <div className="mp-section-header mp-section-header--gold">
          <span className="mp-day-tag mp-day-tag--gold">住宿與預算</span>
          <span className="mp-day-date">每人約 NT$28,300</span>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">Hotel Madam Mirei</div>
          <p className="mp-route-desc">
            2/28 入住、3/3 退房，3 房 3 晚，6 人。位置：斑尾高原滑雪場約數分鐘步行、
            斑尾高原口前巴士站步行可達。房間／公共區域較簡單，主打便宜實用。
          </p>
          <div className="mp-route-meta-row" style={{ marginTop: "10px" }}>
            <span className="mp-meta-chip">總價約 NT$22,146</span>
            <span className="mp-meta-chip">每人約 NT$3,691</span>
          </div>
          <MapBtn q="Hotel Madam Mirei Madarao" />
        </div>

        <div id="mp-c-budget-table" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">每人預算明細</div>
          <div className="mp-budget-list">
            {BUDGET_ITEMS.map(it => (
              <div key={it.label} className="mp-budget-row">
                <span className="mp-budget-label">{it.label}</span>
                <span className="mp-budget-amount">{it.amount}</span>
              </div>
            ))}
            <div className="mp-budget-row mp-budget-row--total">
              <span className="mp-budget-label">目前合計</span>
              <span className="mp-budget-amount">約 NT$28,300／人</span>
            </div>
          </div>
          <div className="mp-day-note">建議抓整數 NT$30,000／人，預留約 NT$1,700 給飲料、便利商店、票價調整、夜滑或其他雜支。</div>
        </div>
      </section>

      {/* ── Must-know ── */}
      <section id="mp-s-know" className="mp-section">
        <div className="mp-know-header">
          <div className="mp-know-tag">出發前</div>
          <div className="mp-know-title">必知事項</div>
        </div>
        {MUST_KNOW.slice(0, 4).map(item => (
          <div key={item.title} className="mp-card mp-card--know">
            <div className="mp-know-item-header">
              <span className="mp-know-emoji">{item.emoji}</span>
              <span className="mp-know-item-title">{item.title}</span>
            </div>
            <div className="mp-know-item-desc">{item.desc}</div>
          </div>
        ))}
        <div id="mp-c-mk-2">
          {MUST_KNOW.slice(4).map(item => (
            <div key={item.title} className="mp-card mp-card--know">
              <div className="mp-know-item-header">
                <span className="mp-know-emoji">{item.emoji}</span>
                <span className="mp-know-item-title">{item.title}</span>
              </div>
              <div className="mp-know-item-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PDF Footer ── */}
      <div className="mp-pdf-section">
        <div className="mp-footer-label">斑尾，粉雪見。</div>
        <a href={`${baseUrl}2027斑尾高原滑雪行程_V1.pdf`} download className="mp-pdf-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden>
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
          下載完整行程 PDF
        </a>
        <div className="mp-pdf-date">2027 斑尾高原 4 日滑雪行程 V1 · 資料如有異動以最終確認版為準</div>
        <div className="mp-photo-credit">雪場照片：Wikimedia Commons（CC BY-SA）</div>
      </div>

      {/* 右下角語音導讀 FAB */}
      <MobileAudioFab baseUrl={baseUrl} onLock={handleLock} onUnlock={handleUnlock} />
    </div>
  );
}
