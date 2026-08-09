import { useEffect, useRef, useState } from "react";
import "./MobilePage.css";

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

/* 34 段口播，對應頁面卡片 */
const SEGMENTS = [
  // coldopen 1-4
  { id: "coldopen", step: 1, cardId: "mp-s-hero" },
  { id: "coldopen", step: 2, cardId: "mp-s-hero" },
  { id: "coldopen", step: 3, cardId: "mp-s-hero" },
  { id: "coldopen", step: 4, cardId: "mp-s-hero" },
  // day1 1-5
  { id: "day1", step: 1, cardId: "mp-c-d1-arrive" },
  { id: "day1", step: 2, cardId: "mp-c-d1-hotel" },
  { id: "day1", step: 3, cardId: "mp-c-d1-beef" },
  { id: "day1", step: 4, cardId: "mp-c-d1-izakaya" },
  { id: "day1", step: 5, cardId: "mp-c-d1-sleep" },
  // day2 1-6
  { id: "day2", step: 1, cardId: "mp-s-day2" },
  { id: "day2", step: 2, cardId: "mp-c-d2-eboshi" },
  { id: "day2", step: 3, cardId: "mp-c-d2-eboshi" },
  { id: "day2", step: 4, cardId: "mp-c-d2-drive" },
  { id: "day2", step: 5, cardId: "mp-c-d2-dinner" },
  { id: "day2", step: 6, cardId: "mp-c-d2-onsen" },
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
  { label: "Day 1",  start: 4,  end: 8  },
  { label: "Day 2",  start: 9,  end: 14 },
  { label: "Day 3",  start: 15, end: 19 },
  { label: "Day 4",  start: 20, end: 24 },
  { label: "Day 5",  start: 25, end: 28 },
  { label: "出發前", start: 29, end: 33 },
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
              <span className="mp-badge">四人成行</span>
              <span className="mp-badge">五天四夜</span>
              <span className="mp-badge">3座雪場</span>
            </div>
          </div>

          {/* 四位滑雪小人 */}
          <div className="mp-hero-members">
            {[
              { icon: "🏂", label: "型男一號" },
              { icon: "⛷️", label: "型男二號" },
              { icon: "🎿", label: "型男三號" },
              { icon: "🏔️", label: "型男四號" },
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
          <div className="mp-hero-members-tag">FOUR MEN · ONE MISSION · PURE POWDER</div>
        </div>
      </div>

      {/* ── Day 1 ── */}
      <section id="mp-s-day1" className="mp-day">
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 1</span>
          <span className="mp-day-date">12月20日（日）・抵達仙台</span>
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
          <div className="mp-card-title" style={{ marginTop: 10 }}>🚗 機場取車</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">取車地點</div>
              <div className="mp-col-val">仙台機場 1F<br />Toyota / Nippon</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">推薦車型</div>
              <div className="mp-col-val">7-8 人座休旅<br />Alphard / Delica</div>
            </div>
          </div>
          <div className="mp-note">出關 → 1F 租車櫃檯 → 免費接駁車 ~5 min → 營業所辦手續</div>
          <div className="mp-muted" style={{ marginTop: 6, fontWeight: 600 }}>取車確認清單</div>
          {["雪胎（Studless Tires）確認", "4WD / AWD 確認", "ETC 卡租借", "右駕手感熱身"].map((c, i) => (
            <div key={i} className="mp-list-item">
              <div className="mp-list-name">✓ {c}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-d1-hotel" className="mp-card">
          <img src="images/spots/hotel-metropolitan.jpg" alt="The OneFive Sendai" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--row">
            <span>🏨 市區飯店入住</span>
            <MapBtn q="The OneFive Sendai 仙台市" />
          </div>
          <div className="mp-highlight">The OneFive Sendai</div>
          <div className="mp-muted">仙台市區 · 近仙台站 · 停車注意車高限制</div>
        </div>

        <div id="mp-c-d1-beef" className="mp-card">
          <img src="images/spots/beef-tongue.jpg" alt="仙台牛舌" className="mp-card-img" />
          <div className="mp-card-title">🥩 型男美食第一彈：牛舌</div>
          <div className="mp-highlight">炭火燒厚切牛舌</div>
          <div className="mp-muted">仙台名物 · 多汁有嚼勁</div>
          <div className="mp-tags-row" style={{ marginTop: 10 }}>
            {[
              { name: "司（Tsukasa）", q: "仙台 司 牛タン" },
              { name: "伊達の牛たん本舗", q: "伊達の牛たん本舗 仙台" },
            ].map(r => (
              <a key={r.name} href={`https://maps.google.com/?q=${encodeURIComponent(r.q)}`}
                target="_blank" rel="noopener noreferrer"
                className="mp-tag-chip mp-tag-chip--map">{r.name} 🗺</a>
            ))}
          </div>
        </div>

        <div id="mp-c-d1-izakaya" className="mp-card">
          <img src="images/spots/izakaya.jpg" alt="國分町居酒屋" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--row">
            <span>🍺 國分町居酒屋</span>
            <MapBtn q="仙台 国分町 居酒屋" />
          </div>
          <div className="mp-muted">吃完牛舌，續攤暢聊，替明天滑雪暖身</div>
          <div className="mp-note">市區晚餐建議步行或搭地鐵・開車不喝酒</div>
        </div>

        <div id="mp-c-d1-sleep" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">🛌 早點睡</div>
          <div className="mp-big-light">08:00 出發</div>
          <div className="mp-muted-light">連續三天高強度衝山，體能是本錢</div>
        </div>
      </section>

      {/* ── Day 2 ── */}
      <section id="mp-s-day2" className="mp-day">
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 2</span>
          <span className="mp-day-date">12月21日（一）・Eboshi 衝鋒</span>
        </div>

        <div id="mp-c-d2-sched" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">🗓 今日行程</div>
          {[
            { time: "08:00", title: "飯店退房，出發", sub: "行李上車，往宮城藏王 Eboshi" },
            { time: "09:30", title: "抵達 Eboshi", sub: "現場辦雪具租借 + 購買纜車券" },
            { time: "16:30", title: "歸還雪具，出發", sub: "翻越山脈前往山形市區" },
            { time: "18:00", title: "山形大飯店入住", sub: "山形市區米澤牛晚餐" },
          ].map((t, i) => (
            <div key={i} className="mp-list-item">
              <div className="mp-list-name"><span style={{ color: "var(--accent)", fontWeight: 700, marginRight: 8 }}>{t.time}</span>{t.title}</div>
              <div className="mp-list-sub">{t.sub}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-d2-eboshi" className="mp-card">
          <img src="images/spots/eboshi.jpg" alt="宮城藏王 Eboshi" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--row">
            <span>⛷️ 宮城藏王 Eboshi</span>
            <MapBtn q="みやぎ蔵王えぼしリゾート 宮城県刈田郡蔵王町" />
          </div>
          <div className="mp-row-between mp-time-row">
            <div className="mp-flight-node">
              <div className="mp-flight-airport">09:30 抵達</div>
              <div className="mp-flight-time-sm">市區出發 08:00</div>
            </div>
            <div className="mp-flight-mid">全日飆雪</div>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">16:00 結束</div>
              <div className="mp-flight-time-sm">最長 4.3km 滑道</div>
            </div>
          </div>
          <div className="mp-two-col" style={{ marginTop: 4 }}>
            <div className="mp-col-item">
              <div className="mp-col-label">滑道數量</div>
              <div className="mp-col-val">22 條</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">最高標高</div>
              <div className="mp-col-val">930 m</div>
            </div>
          </div>
          <div className="mp-note">宮城縣最大雪場 · 距市區 60min · 現場可租借全套雪具</div>
        </div>

        <div id="mp-c-d2-skiday" className="mp-card">
          <div className="mp-card-title">🎿 全日飆雪 6.5 小時</div>
          {[
            "結伴滑雪，互相照應",
            "注意體力分配，還有後面兩天",
            "纜車 12 月通常 16:30 視天色關閉",
          ].map((t, i) => (
            <div key={i} className="mp-list-item">
              <div className="mp-list-name">{t}</div>
            </div>
          ))}
          <div className="mp-note">中午在雪場餐廳 · 日式拉麵或咖哩飯補足能量</div>
        </div>

        <div id="mp-c-d2-drive" className="mp-card mp-card--warn">
          <img src="images/spots/snow-road.jpg" alt="翻越山脈雪路" className="mp-card-img" />
          <div className="mp-card-title">🚗 翻越山脈前往山形市區</div>
          <div className="mp-big-light">16:30 出發</div>
          <div className="mp-muted-light">⚠ 傍晚山路易起霧降雪，開霧燈、保持距離</div>
        </div>

        <div id="mp-c-d2-dinner" className="mp-card">
          <img src="images/spots/sukiyaki.jpg" alt="米澤牛燒肉" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--row">
            <span>🥩 米澤牛燒肉</span>
            <MapBtn q="米沢牛 焼肉 山形市" />
          </div>
          <div className="mp-highlight">山形市區名店</div>
          <div className="mp-muted">A5 米澤牛 · 山形名物 · 入口即化</div>
          <div className="mp-note">入住山形大飯店，到市區享用頂級米澤牛燒肉</div>
        </div>

        <div id="mp-c-d2-onsen" className="mp-card mp-card--dark">
          <img src="images/spots/zao-onsen.jpg" alt="山形溫泉" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--light">♨️ 回飯店泡湯放鬆</div>
          <div className="mp-big-light">洗去一天疲憊</div>
          <div className="mp-muted-light">藏王強酸性硫磺泉，留到明天滑完雪再享受</div>
        </div>
      </section>

      {/* ── Day 3 ── */}
      <section id="mp-s-day3" className="mp-day">
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 3</span>
          <span className="mp-day-date">12月22日（二）・制霸藏王大雪場</span>
        </div>

        <div id="mp-c-d3-sched" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">🗓 今日行程（開車 30 分上山）</div>
          {[
            { time: "08:00", title: "飯店早餐", sub: "山形大飯店早餐 · 驅車 30 分上藏王" },
            { time: "09:00", title: "直衝藏王", sub: "抵達雪場租雪具 · 全日纜車券衝上頂峰" },
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
          <img src="images/spots/snow-road.jpg" alt="告別山形" className="mp-card-img" />
          <div className="mp-card-title">🏔️ 告別山形・返回仙台</div>
          <div className="mp-row-between mp-time-row">
            <div className="mp-flight-node">
              <div className="mp-flight-airport">09:30 退房</div>
              <div className="mp-flight-time-sm">山形市區出發</div>
            </div>
            <div className="mp-flight-mid">途中可停</div>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">12:30 抵達</div>
              <div className="mp-flight-time-sm">國分町大露台入住</div>
            </div>
          </div>
          <div className="mp-note">可停山形城跡散步 · 白天路程充裕，輪流開車補眠</div>
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
            {["5天4夜", "3座雪場", "牛舌", "山形牛", "羊肉", "深夜拉麵", "硫磺溫泉"].map(r => (
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
          <div className="mp-card-title">🚗 租車必選配備</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">必選</div>
              <div className="mp-col-val">雪胎（Studless）<br />4WD / AWD</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">建議加購</div>
              <div className="mp-col-val">ETC 卡<br />東北高速護照</div>
            </div>
          </div>
          <div className="mp-two-col" style={{ marginTop: 4 }}>
            <div className="mp-col-item">
              <div className="mp-col-label">費用參考（5天）</div>
              <div className="mp-col-val">¥60,000–80,000</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">另計費用</div>
              <div className="mp-col-val">Winter Season Fee<br />+ ETC 卡租金</div>
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

        {/* ── 雪場 1：Eboshi ── */}
        <div id="mp-c-mk-ski" className="mp-card">
          <img src="images/spots/eboshi.jpg" alt="宮城藏王 Eboshi" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--row">
            <span>⛷️ Eboshi（Day 2）</span>
            <MapBtn q="みやぎ蔵王えぼしリゾート 宮城県刈田郡蔵王町" />
          </div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">滑道 / 最長</div>
              <div className="mp-col-val">22 條 · 4.3 km</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">最高標高</div>
              <div className="mp-col-val">930 m</div>
            </div>
          </div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">纜車券</div>
              <div className="mp-col-val">5h 或全日券</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">雪具租借</div>
              <div className="mp-col-val">現場可租借</div>
            </div>
          </div>
          <div className="mp-tags-row" style={{ marginTop: 8 }}>
            <a href="https://maps.google.com/?q=みやぎ蔵王えぼしリゾート" target="_blank" rel="noopener noreferrer" className="mp-tag-chip mp-tag-chip--map">地圖 🗺</a>
            <a href="https://www.eboshi.co.jp/" target="_blank" rel="noopener noreferrer" className="mp-tag-chip">🌐 官方網站</a>
          </div>
          <div className="mp-note">距仙台市區 60 min · 宮城縣最大雪場 · 適合各級滑手</div>
        </div>

        {/* ── 雪場 2：山形藏王 ── */}
        <div className="mp-card">
          <img src="images/spots/zao.jpg" alt="山形藏王溫泉滑雪場" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--row">
            <span>🏔️ 山形藏王（Day 3）</span>
            <MapBtn q="蔵王温泉スキー場 山形県山形市蔵王温泉" />
          </div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">滑道 / 落差</div>
              <div className="mp-col-val">43 條 · 855 m</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">最高標高</div>
              <div className="mp-col-val">1661 m</div>
            </div>
          </div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">纜車券</div>
              <div className="mp-col-val">全日券推薦</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">雪具租借</div>
              <div className="mp-col-val">溫泉街配合店</div>
            </div>
          </div>
          <div className="mp-tags-row" style={{ marginTop: 8 }}>
            <a href="https://maps.google.com/?q=蔵王温泉スキー場" target="_blank" rel="noopener noreferrer" className="mp-tag-chip mp-tag-chip--map">地圖 🗺</a>
            <a href="https://zaoskiarea.com/" target="_blank" rel="noopener noreferrer" className="mp-tag-chip">🌐 官方網站</a>
          </div>
          <div className="mp-note">12月限定樹冰奇景 · 可下至溫泉街的「樹冰原滑道」· 從山形市區驅車約 30 分上山</div>
        </div>

        {/* ── 雪場 3：Spring Valley ── */}
        <div className="mp-card mp-card--dark">
          <img src="images/spots/spring-valley.jpg" alt="Spring Valley 仙台泉" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--light mp-card-title--row">
            <span>🌙 Spring Valley（Day 4）</span>
            <MapBtn q="スプリングバレー仙台泉 宮城県仙台市泉区" />
          </div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">夜滑時段</div>
              <div className="mp-col-val">17:00–22:00</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">距市區</div>
              <div className="mp-col-val">約 40 分鐘</div>
            </div>
          </div>
          <div className="mp-tags-row" style={{ marginTop: 8 }}>
            <a href="https://maps.google.com/?q=スプリングバレー仙台泉" target="_blank" rel="noopener noreferrer" className="mp-tag-chip mp-tag-chip--map">地圖 🗺</a>
            <a href="https://www.springvalley.co.jp/" target="_blank" rel="noopener noreferrer" className="mp-tag-chip">🌐 官方網站</a>
          </div>
          <div className="mp-note">大型人工造雪 + 公園區 · ⚠ 夜間氣溫驟降，帶面罩與保暖層</div>
        </div>

        {/* ── 美食 1：仙台牛舌 ── */}
        <div id="mp-c-mk-food" className="mp-card">
          <img src="images/spots/beef-tongue.jpg" alt="仙台牛舌" className="mp-card-img" />
          <div className="mp-card-title">🥩 仙台牛舌</div>
          <div className="mp-highlight">炭火燒厚切牛舌</div>
          <div className="mp-muted">仙台名物 · 多汁有嚼勁 · 附麥飯 + 牛尾湯</div>
          <div className="mp-tags-row" style={{ marginTop: 8 }}>
            <a href="https://maps.google.com/?q=仙台 司 牛タン 本店" target="_blank" rel="noopener noreferrer" className="mp-tag-chip mp-tag-chip--map">司（Tsukasa）🗺</a>
            <a href="https://maps.google.com/?q=伊達の牛たん本舗 仙台駅" target="_blank" rel="noopener noreferrer" className="mp-tag-chip mp-tag-chip--map">伊達の牛たん本舗 🗺</a>
          </div>
          <div className="mp-note">仙台車站商圈均有分店 · Day 1 晚餐首選</div>
        </div>

        {/* ── 美食 2：米澤牛燒肉 ── */}
        <div className="mp-card">
          <img src="images/spots/sukiyaki.jpg" alt="米澤牛燒肉" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--row">
            <span>🥩 米澤牛燒肉</span>
            <MapBtn q="米沢牛 焼肉 山形市" />
          </div>
          <div className="mp-highlight">山形市區名店</div>
          <div className="mp-muted">A5 米澤牛 · 山形名物 · 入口即化</div>
          <div className="mp-note">入住山形大飯店，到市區享用頂級米澤牛燒肉 · Day 2 晚餐</div>
        </div>

        {/* ── 美食 3：成吉思汗 ── */}
        <div className="mp-card mp-card--dark">
          <img src="images/spots/genghis-khan.jpg" alt="成吉思汗烤羊肉" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--light mp-card-title--row">
            <span>🔥 成吉思汗烤生羊肉</span>
            <MapBtn q="ろばた 蔵王温泉街" />
          </div>
          <div className="mp-big-light">ろばた</div>
          <div className="mp-muted-light">溫泉街名店 · 東北名物 · 炭火直烤 + 生啤酒</div>
          <div className="mp-tags-row" style={{ marginTop: 8 }}>
            <a href="https://maps.google.com/?q=ろばた+蔵王温泉" target="_blank" rel="noopener noreferrer" className="mp-tag-chip mp-tag-chip--map">ろばた 地圖 🗺</a>
          </div>
          <div className="mp-note">圍著炭火烤肉，男人聚會最棒的氛圍 · Day 3 晚餐</div>
        </div>

        {/* ── 美食 4：深夜拉麵 ── */}
        <div className="mp-card">
          <img src="images/spots/ramen.jpg" alt="仙台拉麵" className="mp-card-img" />
          <div className="mp-card-title mp-card-title--row">
            <span>🍜 仙台深夜拉麵</span>
            <MapBtn q="仙台 ラーメン 深夜営業" />
          </div>
          <div className="mp-muted">22:00 下山後 · 仙台市區隨便走</div>
          <div className="mp-tags-row" style={{ marginTop: 8 }}>
            <a href="https://maps.google.com/?q=仙台 らーめん 繁昌" target="_blank" rel="noopener noreferrer" className="mp-tag-chip mp-tag-chip--map">繁昌 🗺</a>
            <a href="https://maps.google.com/?q=仙台 中華そば 源氏" target="_blank" rel="noopener noreferrer" className="mp-tag-chip mp-tag-chip--map">源氏 🗺</a>
          </div>
          <div className="mp-note">三連戰完結的最好句點 · 叫碗濃郁熱湯，一切圓滿 · Day 4 宵夜</div>
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
