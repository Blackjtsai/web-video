import { useEffect, useRef, useState } from "react";
import "./MobilePage.css";

/* ── 31 段口播，每段對應頁面上的精確卡片 id ── */
const SEGMENTS = [
  // coldopen 1-4：開場
  { id: "coldopen",  step: 1, cardId: "mp-s-hero" },
  { id: "coldopen",  step: 2, cardId: "mp-s-hero" },
  { id: "coldopen",  step: 3, cardId: "mp-s-hero" },
  { id: "coldopen",  step: 4, cardId: "mp-s-day1" },   // 「這趟怎麼玩」預告 → 捲到 Day1
  // day1 1-6
  { id: "day1",      step: 1, cardId: "mp-c-d1-flight" },
  { id: "day1",      step: 2, cardId: "mp-c-d1-groups" },
  { id: "day1",      step: 3, cardId: "mp-c-d1-hotel" },
  { id: "day1",      step: 4, cardId: "mp-c-d1-snack" },
  { id: "day1",      step: 5, cardId: "mp-c-d1-dinner" },
  { id: "day1",      step: 6, cardId: "mp-c-d1-fireworks" },
  // day2 1-6
  { id: "day2",      step: 1, cardId: "mp-c-d2-boat" },
  { id: "day2",      step: 2, cardId: "mp-c-d2-boat" },
  { id: "day2",      step: 3, cardId: "mp-c-d2-birds" },
  { id: "day2",      step: 4, cardId: "mp-c-d2-choice" },
  { id: "day2",      step: 5, cardId: "mp-c-d2-lunch" },
  { id: "day2",      step: 6, cardId: "mp-c-d2-aquarium" },
  // day3 1-5
  { id: "day3",      step: 1, cardId: "mp-c-d3-market" },
  { id: "day3",      step: 2, cardId: "mp-c-d3-xiyue" },
  { id: "day3",      step: 3, cardId: "mp-c-d3-fishing" },
  { id: "day3",      step: 4, cardId: "mp-c-d3-fishing" },
  { id: "day3",      step: 5, cardId: "mp-c-d3-warn" },
  // day4 1-4
  { id: "day4",      step: 1, cardId: "mp-s-day4" },
  { id: "day4",      step: 2, cardId: "mp-c-d4-walk" },
  { id: "day4",      step: 3, cardId: "mp-c-d4-car" },
  { id: "day4",      step: 4, cardId: "mp-c-d4-flight" },
  // must-know 1-6
  { id: "must-know", step: 1, cardId: "mp-c-mk-docs" },
  { id: "must-know", step: 2, cardId: "mp-c-mk-luggage" },
  { id: "must-know", step: 3, cardId: "mp-c-mk-checkin" },
  { id: "must-know", step: 4, cardId: "mp-c-mk-seasick" },
  { id: "must-know", step: 5, cardId: "mp-c-mk-souvenir" },
  { id: "must-know", step: 6, cardId: "mp-c-mk-souvenir" },
];

/* ── 章節分組（供 scrubber 用） ── */
const CHAPTER_GROUPS = [
  { label: "開場",   start: 0,  end: 3  },
  { label: "Day 1",  start: 4,  end: 9  },
  { label: "Day 2",  start: 10, end: 15 },
  { label: "Day 3",  start: 16, end: 20 },
  { label: "Day 4",  start: 21, end: 24 },
  { label: "出發前", start: 25, end: 30 },
];

function scrollToCard(idx: number) {
  const seg = SEGMENTS[idx];
  if (!seg) return;
  const el = document.getElementById(seg.cardId);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── 右下角圓形 FAB + 長按 Scrubber ── */
function MobileAudioFab({ baseUrl }: { baseUrl: string }) {
  const [playing, setPlaying]       = useState(false);
  const [index, setIndex]           = useState(0);
  const [showScrubber, setShowScrubber] = useState(false);
  const [scrubIdx, setScrubIdx]     = useState(0);
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const indexRef    = useRef(index);
  const lpTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  indexRef.current  = index;

  /* 初始化 Audio */
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

  /* index 變化 → 捲動 + 播放 */
  useEffect(() => { scrollToCard(index); }, [index]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const seg = SEGMENTS[index];
    if (!seg) return;
    if (playing) { audio.src = `${baseUrl}audio/${seg.id}/${seg.step}.mp3`; audio.play().catch(() => {}); }
    else audio.pause();
  }, [index, playing, baseUrl]);

  /* 長按偵測：pointer 事件（真機 + Chrome 模擬器都適用）
     移動超過 8px = 使用者在捲動 → 取消計時                    */
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
    if (dx > 8 || dy > 8) cancelLongPress();  // 有位移 = 捲動手勢，不是長按
  };
  const handlePointerUp = () => cancelLongPress();
  const handleClick = () => {
    if (longFired.current) { longFired.current = false; return; }
    if (!showScrubber) setPlaying(p => !p);
  };

  /* scrubber 確認：從選中位置播放 */
  const confirmScrub = (idx: number) => {
    setShowScrubber(false);
    setIndex(idx);
    setPlaying(true);
  };

  /* 進度環 */
  const circ = 125.7;
  const dash = circ - (index / SEGMENTS.length) * circ;

  return (
    <>
      {/* ── FAB ── */}
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

      {/* ── Scrubber 面板 ── */}
      {showScrubber && (
        <div className="mp-scrubber-overlay" onPointerDown={() => setShowScrubber(false)}>
          <div className="mp-scrubber-sheet" onPointerDown={e => e.stopPropagation()}>

            {/* 拖曳把手 */}
            <div className="mp-scrubber-handle" />

            {/* 當前位置標示 */}
            <div className="mp-scrubber-current">
              <span className="mp-scrubber-current-ch">
                {CHAPTER_GROUPS.find(c => scrubIdx >= c.start && scrubIdx <= c.end)?.label}
              </span>
              <span className="mp-scrubber-current-num">{scrubIdx + 1} / {SEGMENTS.length}</span>
            </div>

            {/* 章節快選 */}
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

            {/* 滑動條 */}
            <input
              type="range"
              className="mp-scrubber-range"
              min={0} max={SEGMENTS.length - 1}
              value={scrubIdx}
              onChange={e => { const v = Number(e.target.value); setScrubIdx(v); scrollToCard(v); }}
            />

            {/* 章節刻度 */}
            <div className="mp-scrubber-ticks">
              {CHAPTER_GROUPS.map(ch => (
                <span key={ch.label} className="mp-scrubber-tick"
                  style={{ left: `${(ch.start / (SEGMENTS.length - 1)) * 100}%` }}>
                  {ch.label}
                </span>
              ))}
            </div>

            {/* 確認按鈕 */}
            <button className="mp-scrubber-confirm" onPointerDown={() => confirmScrub(scrubIdx)}>
              從這裡播放
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface Props {
  baseUrl: string;
}

export function MobilePage({ baseUrl }: Props) {
  const img = (name: string) => `${baseUrl}images/${name}`;

  // base.css sets html/body/root to overflow:hidden for the stage.
  // Mobile mode: make #root itself the scroll container so behaviour is
  // identical on real devices AND Chrome DevTools device emulation.
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    root.style.overflowY = "auto";
    root.style.overflowX = "hidden";
    root.style.height    = "100dvh";
    root.scrollTop = 0;            // 重新整理後回到頂部

    return () => {
      root.style.overflowY = "";
      root.style.overflowX = "";
      root.style.height    = "";
    };
  }, []);

  return (
    <div className="mp-root">

      {/* ── Hero ── */}
      <div id="mp-s-hero" className="mp-hero">
        <img className="mp-hero-img" src={img("cover.jpg")} alt="澎湖家族行" />
        <div className="mp-hero-text">
          <div className="mp-hero-sub">帶著一歲半的小寶寶</div>
          <div className="mp-hero-title">澎湖家族行</div>
          <div className="mp-hero-badges">
            <span className="mp-badge">九人成行</span>
            <span className="mp-badge">四天三夜</span>
            <span className="mp-badge">2026 · 五月</span>
          </div>
        </div>
      </div>

      {/* ── Day 1 ── */}
      <section id="mp-s-day1" className="mp-day">
        <img className="mp-day-img" src={img("day1.jpg")} alt="Day 1" />
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 1</span>
          <span className="mp-day-date">5月28日（四）</span>
        </div>

        <div id="mp-c-d1-flight" className="mp-card">
          <div className="mp-card-title">✈️ 航班</div>
          <div className="mp-row-between">
            <div className="mp-flight-node">
              <div className="mp-flight-airport">松山機場</div>
              <div className="mp-flight-time">12:10</div>
            </div>
            <div className="mp-flight-mid">→ 1小時 →</div>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">馬公機場</div>
              <div className="mp-flight-time">13:10</div>
            </div>
          </div>
          <div className="mp-tag-inline">華信航空</div>
        </div>

        <div id="mp-c-d1-groups" className="mp-card">
          <div className="mp-card-title">🚗 抵達後分兩組</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">取車組（3人）</div>
              <div className="mp-col-val">順順租車行<br />Tiida + 機車 2 台</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">民宿組（其餘）</div>
              <div className="mp-col-val">接機專車<br />大件行李同行</div>
            </div>
          </div>
        </div>

        <div id="mp-c-d1-hotel" className="mp-card">
          <div className="mp-card-title">🏠 住宿</div>
          <div className="mp-hotel">夏天正涼民宿</div>
          <div className="mp-muted">3 晚 · 每日含早餐</div>
        </div>

        <div id="mp-c-d1-snack" className="mp-card">
          <div className="mp-card-title">🧋 下午茶（三選一）約 15:00</div>
          {[
            { name: "楊媽媽韭菜盒", addr: "樹德路 15 號" },
            { name: "蔬脆蛋餅", addr: "光明路 45 號" },
            { name: "老家餡餅", addr: "民權路 72 號" },
          ].map(o => (
            <div className="mp-list-item" key={o.name}>
              <div className="mp-list-name">{o.name}</div>
              <div className="mp-list-sub">{o.addr}</div>
            </div>
          ))}
          <div className="mp-note">當天視距離順路決定</div>
        </div>

        <div id="mp-c-d1-dinner" className="mp-card">
          <div className="mp-card-title">🍽️ 晚餐 17:30</div>
          <div className="mp-highlight">阿東餐廳</div>
          <div className="mp-muted">澎湖在地海鮮桌菜 · 已預訂</div>
        </div>

        <div id="mp-c-d1-fireworks" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">🎆 花火節 21:00</div>
          <div className="mp-big-light">觀音亭煙火秀</div>
          <div className="mp-muted-light">提早去找好位置</div>
        </div>
      </section>

      {/* ── Day 2 ── */}
      <section id="mp-s-day2" className="mp-day">
        <img className="mp-day-img" src={img("day2.jpg")} alt="Day 2" />
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 2</span>
          <span className="mp-day-date">5月29日（五）整趟最豐富的一天</span>
        </div>

        <div id="mp-c-d2-boat" className="mp-card">
          <div className="mp-card-title">⛵ 員貝島嶼遊</div>
          <div className="mp-row-between mp-time-row">
            <div className="mp-flight-node">
              <div className="mp-flight-airport">07:40 集合</div>
              <div className="mp-flight-time-sm">岐頭遊客中心</div>
            </div>
            <div className="mp-flight-mid">開船 08:30</div>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">14:30 回程</div>
              <div className="mp-flight-time-sm">共 6 小時</div>
            </div>
          </div>
        </div>

        <div id="mp-c-d2-birds" className="mp-card">
          <div className="mp-card-title">🦅 季節限定</div>
          <div className="mp-highlight">賞燕鷗</div>
          <div className="mp-muted">搭船出海，邂逅夏日候鳥</div>
        </div>

        <div id="mp-c-d2-choice" className="mp-card">
          <div className="mp-card-title">🌊 二選一體驗</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">潮間帶踏浪</div>
              <div className="mp-col-val">赤腳走入，探索海洋生態</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">傳統手捲圈釣魚</div>
              <div className="mp-col-val">澎湖傳統釣法體驗</div>
            </div>
          </div>
        </div>

        <div id="mp-c-d2-lunch" className="mp-card">
          <div className="mp-card-title">🍱 島上午餐 & 體驗</div>
          {[
            { name: "豪華海島午餐", sub: "島上現做，邊吃邊看海" },
            { name: "小管一日干體驗", sub: "每人一隻小管，自己動手做" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              <div className="mp-list-sub">{i.sub}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-d2-aquarium" className="mp-card">
          <div className="mp-card-title">🐠 澎湖水族館 14:40 抵達</div>
          {[
            { time: "14:00", event: "礁岩池 — 魚魚啄菜球時間" },
            { time: "15:00", event: "大洋池 — 精彩餵食秀" },
            { time: "15:30", event: "觸摸池 — 生態親密接觸" },
          ].map(s => (
            <div className="mp-list-item" key={s.time}>
              <div className="mp-list-name">{s.time}</div>
              <div className="mp-list-sub">{s.event}</div>
            </div>
          ))}
          <div className="mp-note">室內 · 帶小孩最適合</div>
        </div>
      </section>

      {/* ── Day 3 ── */}
      <section id="mp-s-day3" className="mp-day">
        <img className="mp-day-img" src={img("day3.jpg")} alt="Day 3" />
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 3</span>
          <span className="mp-day-date">5月30日（六）</span>
        </div>

        <div id="mp-c-d3-market" className="mp-card">
          <div className="mp-card-title">🐟 第三魚市場（自由參加）</div>
          <div className="mp-highlight">05:00 – 07:00</div>
          <div className="mp-muted">澎湖最在地的清晨漁獲拍賣</div>
          <div className="mp-note">不想去的人繼續睡就好 😴</div>
        </div>

        <div id="mp-c-d3-xiyue" className="mp-card">
          <div className="mp-card-title">🌉 西嶼鄉一日遊 09:30</div>
          <div className="mp-tags-row">
            <span className="mp-tag-chip">跨海大橋</span>
            <span className="mp-tag-chip">二崁聚落</span>
          </div>
          <div className="mp-muted">沿途慢慢走</div>
        </div>

        <div id="mp-c-d3-fishing" className="mp-card">
          <div className="mp-card-title">🦑 晶翔號夜釣小管</div>
          <div className="mp-row-between mp-time-row">
            <div className="mp-flight-node">
              <div className="mp-flight-time">17:30</div>
              <div className="mp-flight-airport">出發</div>
            </div>
            <div className="mp-flight-mid">→</div>
            <div className="mp-flight-node">
              <div className="mp-flight-time">20:30</div>
              <div className="mp-flight-airport">結束</div>
            </div>
          </div>
          <div className="mp-muted">集合：白沙鄉沙港村碼頭 · 提前 10 分鐘到</div>
          <div className="mp-two-col" style={{ marginTop: 12 }}>
            <div className="mp-col-item">
              <div className="mp-col-label">夜間海上垂釣</div>
              <div className="mp-col-val">五點半出發</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">現煮漁夫料理</div>
              <div className="mp-col-val">釣完直接吃</div>
            </div>
          </div>
        </div>

        <div id="mp-c-d3-warn" className="mp-card mp-card--warn">
          <div className="mp-card-title">⚠️ 重要提醒</div>
          <div className="mp-big-light">小管噴墨汁</div>
          <div className="mp-muted-light">當晚絕對不要穿淺色衣服</div>
          <div className="mp-muted-light" style={{ fontWeight: 700 }}>任何淺色都不行</div>
        </div>
      </section>

      {/* ── Day 4 ── */}
      <section id="mp-s-day4" className="mp-day">
        <img className="mp-day-img" src={img("day4.jpg")} alt="Day 4" />
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 4</span>
          <span className="mp-day-date">5月31日（日）最後一天</span>
        </div>

        <div id="mp-c-d4-walk" className="mp-card">
          <div className="mp-card-title">🗺️ 市區自由行 09:00 – 12:00</div>
          <div className="mp-tags-row">
            {["北辰市場", "天后宮", "中央老街", "菊島之星", "澎湖開拓館"].map(s => (
              <span className="mp-tag-chip" key={s}>{s}</span>
            ))}
          </div>
          <div className="mp-note">自由逛街，順便帶伴手禮回家</div>
        </div>

        <div id="mp-c-d4-car" className="mp-card">
          <div className="mp-card-title">🚗 歸還車輛 13:30</div>
          <div className="mp-muted">還車前先加滿油 — 汽車 + 機車 × 2</div>
        </div>

        <div id="mp-c-d4-flight" className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">✈️ 返程</div>
          <div className="mp-row-between">
            <div className="mp-flight-node">
              <div className="mp-flight-airport-light">14:00 報到</div>
              <div className="mp-flight-time-light">15:40 起飛</div>
              <div className="mp-flight-airport-light">馬公機場</div>
            </div>
            <div className="mp-flight-mid-light">→</div>
            <div className="mp-flight-node">
              <div className="mp-flight-time-light">16:35 落地</div>
              <div className="mp-flight-airport-light">松山機場</div>
            </div>
          </div>
          <div className="mp-finale">四天三夜，圓滿落幕 ✨</div>
        </div>
      </section>

      {/* ── Must-Know ── */}
      <section id="mp-s-know" className="mp-day">
        <div className="mp-day-header mp-day-header--nophoto">
          <span className="mp-day-tag">出發前</span>
          <span className="mp-day-date">必知事項 & 伴手禮攻略</span>
        </div>

        <div id="mp-c-mk-docs" className="mp-card">
          <div className="mp-card-title">📋 必備證件</div>
          {[
            { name: "身分證", who: "大人必備" },
            { name: "健保卡", who: "小朋友" },
            { name: "駕照", who: "開車必備" },
          ].map(d => (
            <div className="mp-list-item" key={d.name}>
              <div className="mp-list-name">{d.name}</div>
              <div className="mp-list-sub">{d.who}</div>
            </div>
          ))}
        </div>

        <div id="mp-c-mk-luggage" className="mp-card">
          <div className="mp-card-title">🧳 行李限制</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">手提</div>
              <div className="mp-col-val">1件 · 7 kg<br />56×36×23 cm</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">託運</div>
              <div className="mp-col-val">10 kg<br />三邊總和 ≤ 180 cm</div>
            </div>
          </div>
          <div className="mp-note">別超重！</div>
        </div>

        <div id="mp-c-mk-checkin" className="mp-card">
          <div className="mp-card-title">⏰ 報到截止</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">去程</div>
              <div className="mp-flight-time">11:40</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">回程</div>
              <div className="mp-flight-time">15:10</div>
            </div>
          </div>
          <div className="mp-note">提早到，別遲到</div>
        </div>

        <div id="mp-c-mk-seasick" className="mp-card mp-card--warn">
          <div className="mp-card-title">💊 夜釣必備</div>
          <div className="mp-big-light">暈船藥</div>
          <div className="mp-muted-light">船停在海上還是會搖，容易暈的提前吃好</div>
        </div>

        <div id="mp-c-mk-souvenir" className="mp-card">
          <div className="mp-card-title">🎁 伴手禮攻略</div>
          <div className="mp-souvenir-grid">
            {[
              { name: "黑糖糕", shops: "水月堂 · 春仁（在地）\n御品家（機場）", imgFile: "souvenir-black-sugar-cake.jpg" },
              { name: "干貝醬", shops: "高林 · 胡媽媽灶腳", imgFile: "souvenir-scallop-sauce.jpg" },
              { name: "花生酥", shops: "正一", imgFile: "souvenir-peanut.jpg" },
              { name: "鹹餅", shops: "盛興 · 泉利", imgFile: "souvenir-salty-cracker.jpg" },
            ].map(s => (
              <div className="mp-souvenir-item" key={s.name}>
                <img className="mp-souvenir-img" src={img(s.imgFile)} alt={s.name} />
                <div className="mp-souvenir-name">{s.name}</div>
                <div className="mp-souvenir-shops">{s.shops}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mp-footer">澎湖，我們來了。</div>
      {/* 右下角圓形播放鍵 */}
      <MobileAudioFab baseUrl={baseUrl} />
    </div>
  );
}
