# MOBILE-CRAFT — 手機版 MobilePage 完整規範

> 每次做手機版時讀這份。澎湖範例：`site/20260528澎湖四日遊/src/src/components/`

---

## 整體架構

```
MobilePage.tsx   ← MobileAudioFab + MobilePage 同一檔案
MobilePage.css   ← 所有樣式，mp- prefix
```

App.tsx 最外層 early return（**不可放在子 component 內**）：
```tsx
const isMobile = new URLSearchParams(location.search).get("layout") === "mobile";

export default function App() {
  if (isMobile) return <MobilePage baseUrl={import.meta.env.BASE_URL} />;
  // ... 網頁版
}
```

捲動修正（**必做**）：
```tsx
useEffect(() => {
  const root = document.getElementById("root");
  if (!root) return;
  root.style.overflowY = "auto";
  root.style.overflowX = "hidden";
  root.style.height    = "100dvh";
  root.scrollTop = 0;
  return () => { root.style.overflowY = ""; root.style.overflowX = ""; root.style.height = ""; };
}, []);
```

---

## 封面圖：滿版全螢幕（100dvh）

圖片佔滿整個視窗高度，文字浮在底部漸層 overlay 上。

```tsx
<div id="mp-s-hero" className="mp-hero">
  <img className="mp-hero-img" src={img("cover.jpg")} alt="封面" />
  <div className="mp-hero-text">
    <div className="mp-hero-sub">副標（如：六人同行，秋楓盛宴）</div>
    <div className="mp-hero-title">主標（如：北海道八日遊）</div>
    <div className="mp-hero-badges">
      <span className="mp-badge">X人成行</span>
      <span className="mp-badge">X天X夜</span>
    </div>
    <div className="mp-scroll-hint">▼ 滑動查看行程</div>
  </div>
</div>
```

```css
.mp-hero {
  position: relative;
  height: 100dvh;
  overflow: hidden;
}
.mp-hero-img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center 30%;
  display: block;
}
.mp-hero-text {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 55%, transparent 100%);
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 20px 20px 32px; gap: 8px;
}
.mp-hero-sub   { font-size: 13px; letter-spacing: .18em; color: rgba(255,255,255,0.72); text-transform: uppercase; }
.mp-hero-title { font-family: var(--font-display-cn); font-size: clamp(32px,8vw,52px); font-weight: 900; color: #fff; line-height: 1.1; }
.mp-hero-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
.mp-badge { font-size: 12px; font-weight: 600; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.35); border-radius: 100px; color: #fff; padding: 3px 10px; }
.mp-scroll-hint { font-size: 12px; letter-spacing: .1em; color: rgba(255,255,255,0.55); margin-top: 10px; }
```

---

## 每日封面圖：同樣滿版（mp-day-cover 結構）

每個 Day section 的第一個元素是滿版封面圖，文字（Day tag + 日期 + 下滑提示）浮在底部 overlay。

```tsx
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

  {/* 行程卡片（mp-c-d1-xxx id） */}
  <div id="mp-c-d1-flight" className="mp-card">...</div>
</section>
```

```css
.mp-day-cover {
  position: relative;
  height: 100dvh;
  overflow: hidden;
}
.mp-day-img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center 40%;
  display: block;
}
.mp-day-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.70) 50%, transparent 100%);
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 20px 20px 36px; gap: 6px;
}
.mp-day-label-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.mp-day-tag {
  font-family: var(--font-mono); font-size: 13px; font-weight: 700;
  letter-spacing: .12em; text-transform: uppercase;
  background: var(--accent); color: #fff;
  border-radius: 6px; padding: 4px 12px; flex-shrink: 0;
}
.mp-day-date { font-size: 14px; color: rgba(255,255,255,0.85); font-weight: 500; }
```

> **注意**：`id="mp-s-dayX"` 放在 `<section>` 上，SEGMENTS 的 cardId 也指向這個 id。
> FAB `scrollIntoView({ block: "start" })` 會捲到 section 頂部，也就是滿版封面圖。

### 無封面圖的 section（must-know 等）

```tsx
<section id="mp-s-know" className="mp-day">
  <div className="mp-day-header--nophoto">
    <span className="mp-day-tag mp-day-tag--dark">出發前</span>
    <span className="mp-day-date mp-day-date--dark">必知事項 &amp; 伴手禮</span>
  </div>
  {/* 卡片 */}
</section>
```

```css
.mp-day-header--nophoto {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 16px 10px;
  border-top: 2px solid var(--rule); margin-top: 8px;
}
.mp-day-tag--dark  { /* 繼承 mp-day-tag，不需額外覆蓋 */ }
.mp-day-date--dark { color: var(--text-mute); }
```

---

## 滑動鎖定（Scroll Lock）

**目的**：播放口播時，頁面鎖定不能手動捲動（FAB 繼續控制自動捲動）；暫停後立刻解鎖。

### ⚠️ 勿用 transparent overlay

`position: fixed; background: transparent; pointer-events: auto` 的 overlay 在 **iOS Safari** 上 unmount 後，scroll 狀態有時不立刻恢復，導致暫停後仍無法手動捲動。澎湖、北海道、新疆都踩過這個坑。

### 正確做法：touchmove ref

ref 即時更新（不等 React re-render），暫停後下一個 touch 事件立刻解鎖。

### MobilePage

```tsx
import { useCallback, useEffect, useRef } from "react";

// scroll lock：ref 即時更新，touchmove preventDefault 立刻生效
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

// JSX：直接傳 ref callback，不需要 state
<MobileAudioFab baseUrl={baseUrl} onLock={handleLock} onUnlock={handleUnlock} />
```

### MobileAudioFab props

```tsx
interface FabProps {
  baseUrl: string;
  onLock: () => void;
  onUnlock: () => void;
}

function MobileAudioFab({ baseUrl, onLock, onUnlock }: FabProps) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (playing) onLock(); else onUnlock();
  }, [playing, onLock, onUnlock]);
  // ...
}
```

> **不需要任何 CSS**：scroll lock 純靠 JS，不渲染任何額外元素。

---

## SEGMENTS 陣列規則

```ts
const SEGMENTS = [
  // { id: 章節id, step: 幾步(1-based), cardId: 對應元素的 id }
  { id: "coldopen", step: 1, cardId: "mp-s-hero" },
  { id: "day1",     step: 1, cardId: "mp-s-day1" },   // ← 指向 section，捲到滿版封面圖
  { id: "day1",     step: 2, cardId: "mp-c-d1-flight" }, // ← 之後的步驟指向各卡片
  // ...
];
```

- 每個章節第一步的 cardId = section id（`mp-s-dayX`）→ 跳轉時先看到滿版封面圖
- 後續步驟的 cardId = card id（`mp-c-dX-slug`）→ 隨音頻捲到對應卡片

---

## FAB 完整實作

```tsx
function MobileAudioFab({ baseUrl, onLock, onUnlock }: FabProps) {
  const [playing, setPlaying]       = useState(false);
  const [index, setIndex]           = useState(0);
  const [showScrubber, setShowScrubber] = useState(false);
  const [scrubIdx, setScrubIdx]     = useState(0);
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const indexRef   = useRef(index);
  const lpTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  indexRef.current = index;

  /* Audio 初始化 */
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

  /* 鎖定狀態 */
  useEffect(() => {
    if (playing) onLock(); else onUnlock();
  }, [playing, onLock, onUnlock]);

  /* index 變化 → 捲動 */
  useEffect(() => { scrollToCard(index); }, [index]);

  /* 播放控制 */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const seg = SEGMENTS[index];
    if (!seg) return;
    if (playing) { audio.src = `${baseUrl}audio/${seg.id}/${seg.step}.mp3`; audio.play().catch(() => {}); }
    else audio.pause();
  }, [index, playing, baseUrl]);

  /* 長按偵測 */
  const longFired = useRef(false);
  const startPos  = useRef<{ x: number; y: number } | null>(null);
  const openScrubber = () => {
    longFired.current = true;
    setPlaying(false); setScrubIdx(index); setShowScrubber(true);
    if (navigator.vibrate) navigator.vibrate(40);
  };
  const cancelLP = () => { if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; } };
  const onPD = (e: React.PointerEvent) => { startPos.current = { x: e.clientX, y: e.clientY }; longFired.current = false; lpTimer.current = setTimeout(openScrubber, 500); };
  const onPM = (e: React.PointerEvent) => { if (!startPos.current || !lpTimer.current) return; if (Math.abs(e.clientX - startPos.current.x) > 8 || Math.abs(e.clientY - startPos.current.y) > 8) cancelLP(); };

  const circ = 125.7;
  const dash = circ - (index / SEGMENTS.length) * circ;

  return (
    <>
      <button
        className={`mp-audio-fab ${playing ? "mp-audio-fab--playing" : ""}`}
        onClick={() => { if (longFired.current) { longFired.current = false; return; } if (!showScrubber) setPlaying(p => !p); }}
        onPointerDown={onPD} onPointerMove={onPM}
        onPointerUp={cancelLP} onPointerLeave={cancelLP} onPointerCancel={cancelLP}
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
                <button key={ch.label}
                  className={`mp-scrubber-chip ${scrubIdx >= ch.start && scrubIdx <= ch.end ? "mp-scrubber-chip--active" : ""}`}
                  onPointerDown={e => { e.stopPropagation(); setScrubIdx(ch.start); scrollToCard(ch.start); }}
                >{ch.label}</button>
              ))}
            </div>
            <input type="range" className="mp-scrubber-range"
              min={0} max={SEGMENTS.length - 1} value={scrubIdx}
              onChange={e => { const v = Number(e.target.value); setScrubIdx(v); scrollToCard(v); }} />
            <div className="mp-scrubber-ticks">
              {CHAPTER_GROUPS.map(ch => (
                <span key={ch.label} className="mp-scrubber-tick"
                  style={{ left: `${(ch.start / (SEGMENTS.length - 1)) * 100}%` }}>
                  {ch.label}
                </span>
              ))}
            </div>
            <button className="mp-scrubber-confirm" onPointerDown={() => { setShowScrubber(false); setIndex(scrubIdx); setPlaying(true); }}>
              從這裡播放
            </button>
          </div>
        </div>
      )}
    </>
  );
}
```

---

## 圖片尋找流程

如果使用者沒有提供景點實景照：

1. **Wikimedia Commons** 搜尋景點名稱（日文或英文）：`https://commons.wikimedia.org`
2. 選 CC 授權（CC BY、CC BY-SA、Public Domain），確認版權後下載
3. macOS 調整大小：`sips -Z 1920 檔名.jpg`（最長邊縮到 1920px，Web 友善）
4. 複製到 `public/images/` 並改語意名稱（`otaru-canal.jpg`、`jozankei.jpg`）

常見搜尋關鍵字模式：
```
景點英文名 + "Hokkaido" / "Japan"
景點日文名（如 小樽運河 → 検索: 小樽運河 Wikimedia）
```

---

## 手機版驗收清單

- [ ] Hero 滿版（100dvh），圖片不空白、不留空隙？
- [ ] 每個 Day section 的封面圖也是 100dvh 滿版？
- [ ] Day tag + 日期顯示在圖片底部 overlay？
- [ ] 播放時頁面滾動鎖定，看到「點此自由瀏覽」提示？
- [ ] 點擊遮罩後可以自由捲動？
- [ ] 暫停後也能自由捲動（自動解鎖）？
- [ ] 播放時 FAB 仍可操作（z-index 100 在遮罩上方）？
- [ ] FAB 播放音頻 + 自動捲動到對應卡片？
- [ ] 長按 FAB → scrubber 面板彈出？
- [ ] 所有地圖按鈕正確打開 Google Maps？
- [ ] PDF 下載按鈕正常？
- [ ] LINE 開啟自動跳出外部瀏覽器？
