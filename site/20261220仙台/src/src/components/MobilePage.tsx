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
        <div className="mp-hero-gradient">
          <div className="mp-hero-text">
            <div className="mp-hero-sub">純爺們東北雪季自駕</div>
            <div className="mp-hero-title">仙台滑雪</div>
            <div className="mp-hero-badges">
              <span className="mp-badge">三人成行</span>
              <span className="mp-badge">五天四夜</span>
              <span className="mp-badge">3座雪場</span>
              <span className="mp-badge">2026 · 十二月</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Day 1 ── */}
      <section id="mp-s-day1" className="mp-day">
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 1</span>
          <span className="mp-day-date">12月20日（日）・抵達仙台</span>
        </div>

        <div id="mp-c-d1-arrive" className="mp-card">
          <div className="mp-card-title">✈️ 機場取車</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">取車地點</div>
              <div className="mp-col-val">仙台機場 1F<br />Toyota / Nippon</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">車型</div>
              <div className="mp-col-val">中型 SUV<br />4WD + 雪胎</div>
            </div>
          </div>
          <div className="mp-note">出關 → 1F 租車櫃檯 → 免費接駁車 ~5 min → 營業所辦手續</div>
        </div>

        <div id="mp-c-d1-hotel" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏨 市區飯店入住</span>
            <MapBtn q="Hotel Metropolitan Sendai 仙台駅" />
          </div>
          <div className="mp-highlight">Hotel Metropolitan Sendai</div>
          <div className="mp-muted">仙台站旁 · 特約停車場（注意車高限制）</div>
        </div>

        <div id="mp-c-d1-beef" className="mp-card">
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

        <div id="mp-c-d2-eboshi" className="mp-card">
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
          <div className="mp-note">宮城縣最大雪場 · 現場可租借全套雪具</div>
        </div>

        <div id="mp-c-d2-drive" className="mp-card mp-card--warn">
          <div className="mp-card-title">🚗 翻越山脈前往藏王溫泉</div>
          <div className="mp-big-light">16:30 出發</div>
          <div className="mp-muted-light">⚠ 傍晚山路易起霧降雪，開霧燈、保持距離</div>
        </div>

        <div id="mp-c-d2-dinner" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🥩 山形牛壽喜燒</span>
            <MapBtn q="蔵王国際ホテル 山形県山形市蔵王温泉" />
          </div>
          <div className="mp-highlight">蔵王国際ホテル</div>
          <div className="mp-muted">A5 山形牛 · 飯店會席料理</div>
        </div>

        <div id="mp-c-d2-onsen" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">♨️ 純天然硫磺泉</div>
          <div className="mp-big-light">強酸性白濁硫磺泉</div>
          <div className="mp-muted-light">泡進去，滑雪的疲憊瞬間化解</div>
        </div>
      </section>

      {/* ── Day 3 ── */}
      <section id="mp-s-day3" className="mp-day">
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 3</span>
          <span className="mp-day-date">12月22日（二）・制霸藏王大雪場</span>
        </div>

        <div id="mp-c-d3-zao" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🏔️ 山形藏王溫泉滑雪場</span>
            <MapBtn q="蔵王温泉スキー場 山形県山形市蔵王温泉" />
          </div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">今天特別</div>
              <div className="mp-col-val">不用開車！</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">雪場規模</div>
              <div className="mp-col-val">43 條滑道<br />落差 855m</div>
            </div>
          </div>
          <div className="mp-note">12月下旬山頂樹冰正在形成 · 橫跨多個山頭</div>
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

        <div id="mp-c-d4-lunch" className="mp-card">
          <div className="mp-card-title">🥩 午餐升級</div>
          <div className="mp-highlight">仙台牛高級燒肉</div>
          <div className="mp-muted">12:30 回仙台市區入住 · 補足夜滑熱量</div>
        </div>

        <div id="mp-c-d4-valley" className="mp-card mp-card--dark">
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
        </div>

        <div id="mp-c-d4-ramen" className="mp-card">
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
          <div className="mp-card-title">🎁 東北名產採購</div>
          {["萩の月", "一口毛豆麻糬", "在地清酒"].map(s => (
            <div className="mp-list-item" key={s}>
              <div className="mp-list-name">{s}</div>
            </div>
          ))}
          <div className="mp-note">仙台車站商圈 · 男子漢亦不可空手回</div>
        </div>

        <div id="mp-c-d5-outlet" className="mp-card">
          <div className="mp-card-title mp-card-title--row">
            <span>🛍️ 仙台港三井 Outlet</span>
            <MapBtn q="三井アウトレットパーク仙台港" />
          </div>
          <div className="mp-muted">距機場 25 分鐘・大型戶外用品店</div>
          <div className="mp-note">Gore-Tex 外套、滑雪裝備、最後尋寶</div>
        </div>

        <div id="mp-c-d5-return" className="mp-card mp-card--warn">
          <div className="mp-card-title">⛽ 還車前必做</div>
          <div className="mp-big-light">加滿油</div>
          <div className="mp-muted-light">保留加油收據 · 結算 ETC 過路費</div>
        </div>

        <div id="mp-c-d5-farewell" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">✈️ 返程</div>
          <div className="mp-finale">仙台滑雪，圓滿落幕</div>
          <div className="mp-muted-light">提早 2 小時到機場辦理登機</div>
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

        <div id="mp-c-mk-ski" className="mp-card">
          <div className="mp-card-title">🎿 三座雪場速查</div>
          {[
            { name: "Eboshi（Day 2）", tip: "5h 或全日券 · 4.3km 滑道" },
            { name: "山形藏王（Day 3）", tip: "全日券 · 43 條滑道 · 樹冰奇景" },
            { name: "Spring Valley（Day 4）", tip: "夜滑 17:00-22:00 · 帶面罩" },
          ].map(s => (
            <div className="mp-list-item" key={s.name}>
              <div className="mp-list-name">{s.name}</div>
              <div className="mp-list-sub">{s.tip}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-mk-food" className="mp-card">
          <div className="mp-card-title">🍽️ 東北美食清單</div>
          {[
            { name: "仙台牛舌", shop: "司 / 伊達の牛たん" },
            { name: "山形牛壽喜燒", shop: "藏王溫泉飯店" },
            { name: "成吉思汗烤羊肉", shop: "ろばた（溫泉街）" },
            { name: "深夜拉麵", shop: "仙台市區隨便走" },
          ].map(f => (
            <div className="mp-list-item" key={f.name}>
              <div className="mp-list-name">{f.name}</div>
              <div className="mp-list-sub">{f.shop}</div>
            </div>
          ))}
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
