# Travel Presentation Skill

使用 **web-video-presentation** 做旅遊簡報，產出兩種版本：

| 版本 | 網址參數 | 用途 |
|---|---|---|
| 網頁版＋口播 | 無參數 或 `?layout=split` | 現場講解、投影、LINE 分享大螢幕 |
| 手機版＋口播 | `?layout=mobile` | LINE 分享、手機隨時查閱 |

---

## 起手方式

> 把素材放入根目錄 `./doc/`，呼叫「**美玲**」，她會問完三個問題後自動整理好再開始。

### 素材暫存（使用者放這裡）
```
./doc/
├── *.jpg / *.png    ← 旅遊圖片（封面 + 每日）
└── *.pdf            ← 行程手冊（可選，供手機版下載）
```

### 美玲問完後自動搬移（作業起點）
```
./site/{project}/
├── doc/             ← 從 ./doc/* 搬入
├── article.md       ← 若根目錄有則搬入
└── src/             ← scaffold 產出的 Vite 專案
```
`doc/` 優先讀 `article.md`；若無則從 PDF 提取；若 PDF 無法讀取請手動提供文字。  
**Phase 1 開始時，工作目錄為 `./site/{project}/`**。

---

## 工作流程

```
Phase 1   讀取素材（doc/ → article.md → trip.json）
  ▼
[Checkpoint 1]  確認行程結構、圖片對應、天數
  ▼
Phase 2   脚手架 + 網頁版簡報（web-video-presentation）
  2.1  scaffold 建立 presentation/
  2.2  複製圖片 → public/images/
  2.3  實作各章節（coldopen / day1 / ... / must-know）
  2.4  設定 SPLIT_IMAGES + 網頁版修正（split.css）
  2.5  SplitEnding 結尾資源面板（PDF + 民宿 + 地圖）
  ▼
[Checkpoint 2]  網頁版全章驗收（視覺氣質 / 節奏 / split.css 衝突）
  ▼
Phase 3   手機版（MobilePage 組件）
  3.1  MobilePage.tsx — 全部行程卡片 + MapBtn + FAB
  3.2  MobilePage.css — mp- prefix 樣式
  3.3  PDF 下載按鈕 + 日期文字（頁底）
  3.4  LINE 偵測（自動跳出 + banner 備案）
  3.5  意見回饋 FAB（Formspree，行程確認前使用）
  ▼
[Checkpoint Audio]  是否合成口播音頻？
  ▼
Phase 4   音頻合成（edge-tts）
  ▼
Phase 5   交付
```

---

## Phase 1 — 讀取素材

### 1.1 掃描 doc/
- 依圖片內容辨識：封面 / Day 1 / Day 2 / ...
- 記錄原始檔名 → 語意名稱（cover.jpg / day1.jpg / day2.jpg ...）

### 1.2 產出 trip.json
```json
{
  "id": "YYYYMMDD-地點",
  "title": "旅遊主標題",
  "subtitle": "副標題（如「帶著寶寶的家族行」）",
  "duration": "X天X夜",
  "members": "X人",
  "coverImage": "cover.jpg",
  "days": [
    {
      "id": "day1",
      "label": "Day 1",
      "date": "日期（星期）",
      "image": "day1.jpg",
      "activities": ["✈️ 航班 12:10 → 13:10", "🏠 民宿名稱"]
    }
  ],
  "mustKnow": ["身分證", "暈船藥"],
  "souvenirs": ["黑糖糕", "小管一夜干"]
}
```

---

## Phase 2 — 脚手架 + 網頁版簡報

### 2.1 脚手架
```bash
bash ~/.claude/skills/web-video-presentation/scripts/scaffold.sh \
  ./site/{project}/src \
  --theme=sunset-zine        # 或其他主題，旅遊建議搭配暖色系

# 刪掉範例章節
rm -rf site/{project}/src/src/chapters/01-example
# 並在 registry/chapters.ts 移除 EXAMPLE_CHAPTER import 與陣列項
```

**scaffold 完成後立刻補 index.html（必做，scaffold 不會自動加）：**

```html
<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{旅遊名稱}</title>
    <!-- OG / LINE 預覽卡（必填，否則 LINE 分享無圖無描述） -->
    <meta name="description" content="{一句話描述，例如：五條精選路線・12天深度自駕}" />
    <meta property="og:type"        content="website" />
    <meta property="og:title"       content="{旅遊名稱}" />
    <meta property="og:description" content="{一句話描述}" />
    <meta property="og:image"       content="https://blackjtsai.github.io/web-video/{slug}/images-mobile/{橫幅圖檔名}.jpg" />
    <meta property="og:image:width" content="{實際寬度}" />
    <meta property="og:image:height"content="{實際高度}" />
    <meta property="og:url"         content="https://blackjtsai.github.io/web-video/{slug}/?layout=mobile" />
    <meta name="twitter:card"       content="summary_large_image" />
    <script>history.scrollRestoration = "manual";</script>
    <script>
      (function () {
        if (navigator.userAgent.indexOf('Line/') > -1) {
          var href = location.href;
          if (href.indexOf('openExternalBrowser') === -1)
            location.replace(href + (href.indexOf('?') > -1 ? '&' : '?') + 'openExternalBrowser=1');
        }
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

> ⚠️ 少了 LINE script → LINE 分享後收件人只能在 LINE 內建瀏覽器看，體驗差且功能受限。  
> ⚠️ 少了 OG tags → LINE / iMessage 預覽卡無圖、無標題，只顯示網址，家人不知道在點什麼。  
> ⚠️ `og:image` 必須用**橫幅圖**（寬 > 高），LINE 預覽卡才會好看。用 `sips -g pixelWidth -g pixelHeight` 確認尺寸後填入。  
> ⚠️ 少了 `scrollRestoration = "manual"` → 手機版重整後捲動位置不回頂部。

### 2.2 複製圖片
```bash
cp ./site/{project}/doc/封面圖.jpg  site/{project}/src/public/images/cover.jpg
cp ./site/{project}/doc/Day1圖.jpg  site/{project}/src/public/images/day1.jpg
# 依此類推；若有 PDF 也一起複製
cp ./site/{project}/doc/旅遊行程手冊.pdf  site/{project}/src/public/旅遊行程手冊.pdf
```

### 2.3 章節規劃建議
| 章節 | 內容 | 建議 Steps |
|---|---|---|
| coldopen | 開場：人數、行程預告 | 3–4 |
| dayN | 每日行程 | 4–6 |
| must-know | 出發前必知 + 伴手禮 | 4–6 |

### 2.4 封面圖人物不裁切（portrait 圖）
在 `coldopen` Step 0 加模糊背景層：
```tsx
<img className="co-hero-bg"  src={`${import.meta.env.BASE_URL}images/cover.jpg`} aria-hidden />
<img className="co-hero-img" src={`${import.meta.env.BASE_URL}images/cover.jpg`} alt="封面" />
```
```css
.co-hero-bg  { position: absolute; inset: -40px; width: calc(100% + 80px); height: calc(100% + 80px); object-fit: cover; filter: blur(32px) brightness(0.5); }
.co-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
```

### 2.5 設定 SPLIT_IMAGES（App.tsx）
```ts
const base = import.meta.env.BASE_URL;
const SPLIT_IMAGES: Record<string, string> = {
  day1: `${base}images/day1.jpg`,
  day2: `${base}images/day2.jpg`,
  day3: `${base}images/day3.jpg`,
  day4: `${base}images/day4.jpg`,
};
```
> coldopen / must-know 不設圖片 → 顯示完整章節畫面  
> ⚠️ 路徑必須加 `import.meta.env.BASE_URL`，與手機版圖片路徑規則一致

### 2.6 網頁版衝突修正（split.css）
章節若有自帶背景圖，在右側 960px 面板會重複，需隱藏：
```css
/* 範例：Day1 煙火章節 */
.split-right .d1-fw-bg    { display: none !important; }
.split-right .d1-fireworks { background: rgba(26,56,88,0.96); }
```
> 每個章節在 `?layout=split` 下測試一遍；有重複圖或寬度爆版就在 `split.css` 加修正

### 2.7 SplitEnding 結尾資源面板
最後一步按 `↓` 彈出 SplitEnding，左半封面 + END，右半資源面板：

```
左半（960px）                   右半（960px）
┌──────────────────────────┐  ┌──────────────────────────┐
│  [封面圖暗色遮罩]           │  │  行程手冊                  │
│                            │  │  [下載 PDF 按鈕]           │
│      END                   │  │                            │
│   旅遊，我們來了。          │  │  住宿聯絡                  │
│   2026 · 05 · 28 — 31     │  │  民宿名稱  📞 電話          │
│                            │  │                            │
│                            │  │  地圖導航                  │
│                            │  │  [景點 pill] [景點 pill]   │
└──────────────────────────┘  └──────────────────────────┘
```

**SplitEnding.tsx 架構**（三塊：PDF、民宿聯絡、地圖連結）：
```tsx
const MAPS = [
  { label: "民宿名稱",   q: "民宿全名 + 地址" },
  { label: "集合地點",   q: "船公司/景點 + 地址" },
  // ...全部景點
];

export function SplitEnding({ baseUrl }: Props) {
  return (
    <div className="se-root">
      <div className="se-left">
        <img className="se-bg" src={`${baseUrl}images/cover.jpg`} alt="" />
        <div className="se-overlay" />
        <div className="se-left-content">
          <div className="se-end-tag">END</div>
          <div className="se-end-title">旅遊地點，我們來了。</div>
          <div className="se-end-date">日期範圍</div>
        </div>
      </div>
      <div className="se-right">
        <div className="se-right-content">
          {/* PDF 下載 */}
          <div className="se-block">
            <div className="se-block-label">行程手冊</div>
            <a className="se-pdf-btn" href={`${baseUrl}旅遊行程手冊.pdf`} download>
              <svg>...</svg> 下載行程手冊 PDF
            </a>
          </div>
          {/* 民宿 */}
          <div className="se-block">
            <div className="se-block-label">住宿聯絡</div>
            <div className="se-hotel-card">
              <div className="se-hotel-name">民宿名稱</div>
              <div className="se-hotel-phone">📞 電話</div>
            </div>
          </div>
          {/* 地圖 */}
          <div className="se-block">
            <div className="se-block-label">地圖導航</div>
            <div className="se-maps">
              {MAPS.map(m => <MapLink key={m.label} href={...} label={m.label} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 3 — 手機版

詳細組件規範見 [`_references/MOBILE-CRAFT.md`](_references/MOBILE-CRAFT.md)。

### App.tsx 整合
```tsx
// App 最外層 early return（不能在 Presentation() 內）
if (isMobileMode) {
  return <MobilePage baseUrl={import.meta.env.BASE_URL} />;
}
```

### MobilePage 放置
```
src/components/
├── MobilePage.tsx   ← 主頁面 + MobileAudioFab（同一檔案）
└── MobilePage.css   ← 所有樣式（mp- prefix）
```

### 捲動修正（必做）
`base.css` 預設把 `html, body, #root` 設為 `overflow: hidden`，手機版需覆蓋：
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
```html
<!-- index.html <head> 最前面 -->
<script>history.scrollRestoration = "manual";</script>
```

### Hero 封面（等比例，無漸層遮罩）

封面圖以自然比例顯示（不裁切），文字區塊跟在圖片下方。

```tsx
<div id="mp-s-hero" className="mp-hero">
  <img className="mp-hero-img" src={img("cover.jpg")} alt="封面" />
  <div className="mp-hero-text">
    <div className="mp-hero-sub">副標</div>
    <div className="mp-hero-title">主標</div>
    <div className="mp-hero-badges">
      <span className="mp-badge">人數</span>
      <span className="mp-badge">天數</span>
    </div>
    <div className="mp-scroll-hint">▼ 滑動查看行程</div>
  </div>
</div>
```
```css
.mp-hero { overflow: hidden; }
.mp-hero-img { width: 100%; height: auto; display: block; }
.mp-hero-text {
  background: var(--surface); padding: 16px 20px 20px;
  display: flex; flex-direction: column; gap: 8px;
}
.mp-hero-sub   { font-size: 13px; letter-spacing: .18em; color: var(--text-mute); text-transform: uppercase; }
.mp-hero-title { font-size: clamp(28px, 7vw, 44px); font-weight: 900; color: var(--text); line-height: 1.1; }
.mp-badge {
  font-size: 12px; font-weight: 600; border-radius: 100px; padding: 3px 10px;
  background: rgba(191,68,0,0.1); border: 1px solid rgba(191,68,0,0.28); color: var(--accent);
}
.mp-scroll-hint { font-size: 12px; letter-spacing: .1em; color: var(--text-mute); opacity: 0.6; margin-top: 6px; }
```

### 每日 Section 封面（mp-day-cover，等比例）

每個 Day section 圖片自然等比例，Day tag + 日期放圖片下方淺色區塊。

```tsx
<section id="mp-s-day1" className="mp-day">
  <div className="mp-day-cover">
    <img className="mp-day-img" src={img("day1.jpg")} alt="Day 1" />
    <div className="mp-day-overlay">
      <div className="mp-day-label-row">
        <span className="mp-day-tag">Day 1</span>
        <span className="mp-day-date">日期（星期）</span>
      </div>
      <div className="mp-scroll-hint">▼ 滑動查看行程</div>
    </div>
  </div>
  {/* 行程卡片 */}
</section>
```
```css
.mp-day-cover { overflow: hidden; }
.mp-day-img   { width: 100%; height: auto; display: block; }
.mp-day-overlay {
  background: var(--surface); padding: 12px 16px 4px;
  display: flex; flex-direction: column; gap: 4px;
}
.mp-day-label-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.mp-day-tag  { font-size: 13px; font-weight: 700; background: var(--accent); color: #fff; border-radius: 6px; padding: 4px 12px; }
.mp-day-date { font-size: 14px; color: var(--text-mute); font-weight: 500; }
```

SEGMENTS 中每個 chapter 的**第一步** cardId 指向 `mp-s-dayX`（section 頂部）；
後續步驟的 cardId 指向各卡片（`mp-c-dX-slug`）。

### 每日住宿卡（Phase 3 必做）

**每個 Day section 結尾都必須加一張住宿卡**，包含飯店名、英文名、地圖按鈕、餐食標籤。

```tsx
{/* 每天 section 最後一張卡 */}
<div id="mp-c-dN-hotel" className="mp-card">
  <div className="mp-card-title mp-card-title--row">
    <span>🏨 今晚住宿</span>
    <MapBtn q="Hotel English Search Query" />
  </div>
  <div className="mp-hotel-name">中文飯店名</div>
  <div className="mp-hotel-en">Hotel English Name</div>
  <span className="mp-meal-badge mp-meal-badge--bf">🍳 附早餐</span>
</div>
```

若為**暗色卡**（`mp-card--dark`），在 card-title 加 `mp-card-title--light`，
並改用 `mp-meal-badge--bfdn-dark`（金黃色）：

```tsx
<div id="mp-c-dN-hotel" className="mp-card mp-card--dark">
  <div className="mp-card-title mp-card-title--row mp-card-title--light">
    <span>🏨 飯店名</span>
    <MapBtn q="Hotel Query" />
  </div>
  <div className="mp-hotel-en" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>English Name</div>
  <span className="mp-meal-badge mp-meal-badge--bfdn-dark">🍳🥩 附早晚餐</span>
</div>
```

**必要 CSS**（複製到 MobilePage.css）：

```css
/* ── Hotel card ── */
.mp-hotel-name {
  font-family: var(--font-display-cn, inherit);
  font-size: 18px; font-weight: 800;
  color: var(--text, #2a1a0e); margin-bottom: 2px;
}
.mp-hotel-en {
  font-size: 12px; color: var(--text-mute, #7a5a3a); margin-bottom: 8px;
}
.mp-meal-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 700; border-radius: 100px;
  padding: 4px 12px; margin-top: 2px;
}
.mp-meal-badge--bf       { background: rgba(40,140,80,0.12);    color: #1a6e3a; }
.mp-meal-badge--bfdn     { background: rgba(180,120,0,0.12);    color: #8a5c00; }
.mp-meal-badge--bfdn-dark{ background: rgba(255,200,80,0.18);   color: rgba(255,215,100,0.95); }
.mp-meal-badge--none     { background: rgba(0,0,0,0.06);        color: var(--text-mute, #7a5a3a); }
```

**餐食標籤對照：**

| 狀況 | class | 顯示 |
|---|---|---|
| 附早餐 | `mp-meal-badge--bf` | `🍳 附早餐`（綠） |
| 附早晚餐（淺色卡）| `mp-meal-badge--bfdn` | `🍳🥩 附早晚餐`（金） |
| 附早晚餐（暗色卡）| `mp-meal-badge--bfdn-dark` | 同上，適配暗底 |
| 無附早餐 | `mp-meal-badge--none` | `⭕ 無附早餐`（灰） |

> ⚠️ **MapBtn 用英文搜尋字串**（如 `"Hotel Emion Sapporo"`），不要用中文或日文地址 — Google Maps 英文搜尋最可靠。

### Section / Card 命名規則
| 元素 | id 格式 | 範例 |
|---|---|---|
| Section | `mp-s-{slug}` | `mp-s-hero`, `mp-s-day1`, `mp-s-know` |
| Card | `mp-c-{day}-{slug}` | `mp-c-d1-flight`, `mp-c-mk-docs` |

### 圖片路徑（重要）
```tsx
const img = (name: string) => `${baseUrl}images-mobile/${name}`;
// ✅ 正確：<img src={img("cover.jpg")} />
// ❌ 錯誤：<img src="/images/cover.jpg" />  ← vite base 不是 /
```
`vite.config.ts` 必須設 `base: process.env.VITE_BASE ?? "./"`.

### 手機版圖片壓縮（必做）

**手機版的所有圖片都必須有獨立的壓縮版本，放在 `public/images-mobile/`。**

原始高畫質圖放 `public/images/`（給網頁版 split-left 用），
MobilePage 的 `img()` helper 一律指向 `images-mobile/`。

**壓縮標準：** quality 75 輸出；任一邊 > 1400px 則同時 resize 到 max 1400px

```bash
mkdir -p src/public/images-mobile
for f in src/public/images/*.jpg; do
  name=$(basename "$f")
  out="src/public/images-mobile/$name"
  sips -Z 1400 -s format jpeg -s formatOptions 75 "$f" --out "$out"
  # 若壓縮後反而比原圖大，保留原圖
  orig=$(stat -f%z "$f"); new=$(stat -f%z "$out")
  [ "$new" -gt "$orig" ] && cp "$f" "$out" && echo "⚠️ $name 壓縮後更大，保留原圖"
done
```

**檢查時機：** Phase 3 開始時先確認圖片尺寸，再執行壓縮：

```bash
for f in src/public/images/*.jpg; do
  dims=$(sips -g pixelWidth -g pixelHeight "$f" | grep pixel | awk '{print $2}' | tr '\n' 'x' | sed 's/x$//')
  size=$(ls -lh "$f" | awk '{print $5}')
  echo "$(basename $f)  ${dims}  ${size}"
done
```

### 意見回饋 FAB（Phase 3.5，每個新專案必做）

行程手冊分享給家人前，加一個暫時性意見按鈕讓家人提建議。行程確認後可移除。

**Step 1：開新 Formspree 表單**

> 📌 請先完成這個步驟，再繼續寫程式碼。

1. 前往 [formspree.io](https://formspree.io) → 登入帳號 `blackjtsai@gmail.com`
2. 點「+ New Form」→ 名稱填 `{專案名稱}-feedback`（例如 `花蓮-feedback`）
3. 建立後複製 endpoint URL（格式：`https://formspree.io/f/xxxxxxxx`）
4. 把 endpoint 告訴我，我幫你貼進程式碼

**Step 2：程式碼實作**

收到 endpoint 後，在 `MobilePage.tsx` 加入：

```tsx
/* ── 意見回饋 Modal（行程確認前暫時性功能） ── */
function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [name, setName]       = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus]   = useState<'idle'|'sending'|'success'|'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/XXXXXXXX', {  // ← 換成新端點
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch { setStatus('error'); }
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
              ✈️ 出發 {出發日期} · 回程 {回程日期}
            </div>
            <label className="mp-fb-label">你是誰？</label>
            <input className="mp-fb-input" type="text" placeholder="輸入你的名字"
              value={name} onChange={e => setName(e.target.value)} maxLength={20} required />
            <div className="mp-fb-counter">{name.length} / 20</div>
            <label className="mp-fb-label">你的想法</label>
            <textarea className="mp-fb-textarea" rows={4}
              placeholder="對這次行程有什麼期待或建議？"
              value={message} onChange={e => setMessage(e.target.value)} maxLength={300} required />
            <div className="mp-fb-counter">{message.length} / 300</div>
            {status === 'error' && <div className="mp-fb-error">送出失敗，請再試一次</div>}
            <button type="submit" className="mp-fb-submit" disabled={status === 'sending'}>
              {status === 'sending' ? '送出中…' : '送出意見'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
```

在 `MobilePage` 組件內加狀態與 FAB：
```tsx
const [feedbackOpen, setFeedbackOpen] = useState(false);

// FAB（放在 MobileAudioFab 前）
<button className="mp-feedback-fab" onClick={() => setFeedbackOpen(true)} aria-label="意見回饋">
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden>
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
  </svg>
</button>
{feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
```

FAB CSS（圓形，與聲音 FAB 同款，放正上方）：
```css
.mp-feedback-fab {
  position: fixed; bottom: 96px; right: 20px;
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--accent); border: none; color: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  z-index: 100; cursor: pointer; transition: transform 120ms ease;
  -webkit-tap-highlight-color: transparent;
}
.mp-feedback-fab:active { transform: scale(0.92); }
```

字數計數 CSS：
```css
.mp-fb-counter { text-align: right; font-size: 11px; color: #b09070; margin-top: -12px; margin-bottom: 12px; }
```

完整 Modal 樣式參考 北海道 MobilePage.css 的 `.mp-fb-*` 段落。

**每週看意見：** Formspree 後台 → Submissions → Export CSV → 貼給 Claude Desktop 分析。

---

### PDF 下載按鈕（頁尾）
```tsx
<div className="mp-footer">旅遊地點，我們來了。</div>

<div className="mp-pdf-section">
  <a href={`${baseUrl}旅遊行程手冊.pdf`} download className="mp-pdf-btn">
    <svg>...</svg>
    下載行程手冊 PDF
  </a>
  <div className="mp-pdf-date">2026 / 05 / 28 ~ 2026 / 05 / 31</div>
</div>
```
```css
.mp-root { padding-bottom: 0; }  /* ⚠️ 必須為 0，底部留白由最後元素自己管 */
.mp-pdf-section { padding: 20px 16px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.mp-pdf-date { font-size: 12px; color: var(--text-mute); letter-spacing: 0.12em;
               padding-bottom: calc(30px + env(safe-area-inset-bottom)); }
```
> ⚠️ `.mp-root` 的 `padding-bottom` 必須設為 `0`，否則底部會多出大段空白。
> FAB 是 `position: fixed` 右下角，不遮置中文字，故不需留額外 padding。

---

## Phase 4 — 音頻合成

詳細流程見 [`_references/AUDIO-GUIDE.md`](_references/AUDIO-GUIDE.md)。

### SEGMENTS 陣列（唯一真相源，在 MobilePage.tsx 頂部）
```ts
const SEGMENTS = [
  // 每段對應：{ id: 章節id, step: 第幾步(1-based), cardId: 頁面元素id }
  { id: "coldopen", step: 1, cardId: "mp-s-hero" },
  { id: "day1",     step: 1, cardId: "mp-c-d1-flight" },
  // ...
];
```
播放時自動 `scrollIntoView` 到 `cardId` 對應元素。

### 合成指令
```bash
pip install edge-tts   # 第一次
PRESENTATION_TTS=edge-tts npm run synthesize-audio   # 增量合成
```
語音：`zh-TW-HsiaoChenNeural`（台灣中文女聲）

---

## Phase 5 — 交付

```bash
cd site/{project}/src && npm run dev
```

**⚠️ 完成後必做：直接給出兩個可點擊的連結**（用戶不需要自己組網址）

先確認 dev server 的 port（通常 5173，若被占則 5174、5175…）：
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/ 2>/dev/null
# 若回傳 200 → port 是 5173
```

然後直接輸出：
```
🖥️ 網頁版（投影/講解）：http://localhost:517X/
📱 手機版（LINE 分享）：http://localhost:517X/?layout=mobile
```

操作說明一起附上：
- **網頁版**：鍵盤 `↓` 下一步、`↑` 上一步；右上角切換口播 Auto 模式
- **手機版**：直接捲動；右下角 🔊 播放口播，長按可跳段

| 版本 | 網址 | 備注 |
|---|---|---|
| 手機版 | `http://localhost:517X/?layout=mobile` | 主要分享連結 |
| 網頁版 | `http://localhost:517X/` | 現場講解/投影 |

> 新專案 `vite.config.ts` 設 `base: "./"` → URL 無前綴，直接是根路徑。

---

## Phase 5.5 — 寫入系統藍圖（每次交付或大幅修改後必做）

交付後立刻在 `site/{project}/blueprint.md` 寫入（或更新）系統藍圖。
**目的**：未來 session 只讀這一份就能掌握全貌，不必重新掃描 10+ 個原始檔，降低 token 消耗。

### 藍圖格式（填入實際數值）

```markdown
# 系統藍圖 — {project}
> 最後更新：YYYY-MM-DD

## 章節登錄
| NN  | id        | CSS prefix | Steps | 簡述         |
|-----|-----------|------------|-------|--------------|
| 01  | coldopen  | .co-       |  4    | 開場介紹      |
| 02  | day1      | .d1-       |  6    | Day 1 行程   |
| ... |           |            |       |              |
| NN  | must-know | .mk-       |  6    | 出發前必知    |

總步數：XX 步（= narrations.ts 段數 = 音頻數量，三者必須一致）

## 關鍵檔案
| 檔案（相對 src/）                     | 關鍵內容                              |
|--------------------------------------|--------------------------------------|
| src/registry/chapters.ts             | CHAPTERS 陣列，章節順序唯一真相源      |
| src/App.tsx                          | SPLIT_IMAGES 對照、isMobileMode 判斷  |
| src/hooks/useStepper.ts:X            | STORAGE_KEY = "vN"（加章節要 bump）   |
| src/styles/tokens.css                | 主題色 token                          |
| src/components/MobilePage.tsx:X      | SEGMENTS 陣列（TTS 播放順序）         |
| src/components/SplitEnding.tsx       | MAPS 陣列（地圖連結）                 |
| public/audio/<id>/<N>.mp3            | 口播音頻（共 XX 段）                  |

## 主題色
```css
--surface:     #xxxxxx;   /* 背景 */
--accent:      #xxxxxx;   /* 強調色 */
--text:        #xxxxxx;   /* 主文字 */
```

## 特殊 hack（踩過的坑）
- `split.css`：哪些章節背景圖需要在右側 panel 隱藏（display:none）
- `MobilePage.css`：mp-root padding-bottom 必須為 0
- 其他本專案特有的 workaround

## TTS 狀態
- Provider: edge-tts　Voice: zh-TW-HsiaoChenNeural
- 已合成：XX / XX 段
- 合成指令：`PRESENTATION_TTS=edge-tts npm run synthesize-audio`
```

### 何時更新藍圖

| 操作 | 是否更新 blueprint.md |
|---|---|
| 首次交付 | 必須建立 |
| 新增章節 | 更新章節表 + 總步數 + TTS 狀態 |
| 修改 step 數 | 更新章節表總步數 |
| 新增 split.css hack | 更新特殊 hack 段落 |
| 重新合成音頻 | 更新 TTS 狀態 |
| 主題色異動 | 更新主題色區塊 |

### 下一次 session 起手方式

新 session 要修改此專案時，先讀 `blueprint.md`，再按需讀指定檔案，
不需要掃描全部原始碼。

---

## 重要技術細節（踩過的坑）

### 1. LINE 內建瀏覽器自動跳出
```html
<!-- index.html <head> 最前面 -->
<script>
  (function () {
    if (navigator.userAgent.indexOf('Line/') > -1) {
      var href = location.href;
      if (href.indexOf('openExternalBrowser') === -1)
        location.replace(href + (href.indexOf('?') > -1 ? '&' : '?') + 'openExternalBrowser=1');
    }
  })();
</script>
```
舊版 LINE 不支援時，在 MobilePage 頂部顯示綠色 banner 引導手動開啟：
```tsx
const isLineBrowser = navigator.userAgent.indexOf('Line/') > -1;
{isLineBrowser && (
  <div className="mp-line-banner">
    請點右上角 <strong> ··· </strong>→<strong> 在瀏覽器中開啟 </strong>以獲得最佳體驗
  </div>
)}
```

### 2. Google Maps 按鈕（MapBtn）
**手機版**：小地圖圖標 `<a>` 連結（`onClick={e => e.stopPropagation()}` 防止事件冒泡）：
```tsx
function MapBtn({ q }: { q: string }) {
  return (
    <a href={`https://maps.google.com/?q=${encodeURIComponent(q)}`}
       target="_blank" rel="noopener noreferrer" className="mp-map-btn"
       onClick={e => e.stopPropagation()}>
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </a>
  );
}
```
Tag chip 也可直接改 `<a>`：
```tsx
<a href={`https://maps.google.com/?q=${encodeURIComponent(q)}`}
   target="_blank" rel="noopener noreferrer"
   className="mp-tag-chip mp-tag-chip--map">
  地點名稱 🗺
</a>
```

**網頁版**：地圖連結放在 SplitEnding 資源面板（pill 樣式 `.se-map-link`），
不在各章節 step 內加連結（投影模式不適合）。

### 3. FAB 長按 Scrubber
- `touch-action: none` 在 FAB 按鈕上，避免瀏覽器把它當捲動起始點
- 移動超過 8px → 取消長按計時（使用者在捲動頁面）
- 長按 500ms → 開啟 Scrubber 面板 + 震動回饋 `navigator.vibrate(40)`

### 4. 播放鎖定滑動（Scroll Lock）

播放口播時，鎖定使用者手動捲動，讓 FAB 自動捲動主導頁面。

**正確做法：`touchmove` 監聽器 + ref**（勿用透明 overlay）

透明 overlay（`pointer-events: auto`）在 iOS Safari 上，unmount 後 scroll 狀態有時不立刻恢復，
導致暫停後仍無法手動捲動。改用 `touchmove` addEventListener + `passive: false`：

```tsx
// MobilePage.tsx
import { useCallback, useRef } from "react";

const scrollLockedRef = useRef(false);
const handleLock   = useCallback(() => { scrollLockedRef.current = true;  }, []);
const handleUnlock = useCallback(() => { scrollLockedRef.current = false; }, []);

useEffect(() => {
  const root = document.getElementById("root");
  if (!root) return;
  // 在初始 root setup 的 useEffect 裡一起掛，不另起 effect
  const preventScroll = (e: TouchEvent) => {
    if (scrollLockedRef.current) e.preventDefault();
  };
  root.addEventListener("touchmove", preventScroll, { passive: false });
  return () => root.removeEventListener("touchmove", preventScroll);
}, []);

<MobileAudioFab baseUrl={baseUrl} onLock={handleLock} onUnlock={handleUnlock} />
```

```tsx
// MobileAudioFab — onLock/onUnlock 傳入後由 playing effect 呼叫
useEffect(() => {
  if (playing) onLock(); else onUnlock();
}, [playing, onLock, onUnlock]);
// onLock/onUnlock 用 useCallback，引用穩定，依賴陣列不會無限觸發
```

**要點：**
- `passive: false` 才能呼叫 `e.preventDefault()`（必須）
- ref 即時更新，不需等 React 重渲染週期，暫停後下一個 touchmove 立刻解鎖
- 無需任何 overlay div 或 CSS
- `scrollIntoView` / `scrollTo` 是程式呼叫，不走 touch 事件，自動捲動仍正常

### 5. 深色卡片文字可見（warn card）
```css
/* mp-card--warn（黃底）需要覆蓋文字色 */
.mp-card--warn .mp-big-light   { color: #7a4a00; }
.mp-card--warn .mp-muted-light { color: #a06020; }
```

### 6. 主題色 Token（藍天白雲）
```css
--surface:     #f0f8ff;
--accent:      #1e8fcc;
--accent-soft: rgba(30,143,204,0.10);
--text:        #1a3858;
--text-mute:   #5a7a90;
--rule:        rgba(30,100,160,0.12);
```

### 7. Scaffold 預設 GitHub 圖示（必須移除）
`ProgressBar` 元件內建 `DEFAULT_GITHUB_URL = "https://github.com/ConardLi/garden-skills"`，
hover 底部進度條時右下角會出現 GitHub 圖示連到範本作者 repo。

**脚手架完成後立刻在 `App.tsx` 加 `githubUrl={null}`**：
```tsx
<ProgressBar
  chapters={CHAPTERS}
  cursor={stepper.cursor}
  onJumpChapter={stepper.jumpToChapter}
  githubUrl={null}   // ← 加這行，移除預設 GitHub 圖示
/>
```

### 8. 視窗等比例縮放 CSS 架構（取代 1920px transform scale）

**問題**：scaffold 預設 Stage 是 1920×1080 + JS `transform: scale()`。
在 1440px 瀏覽器下縮放比 ~0.67，導致 42px 標題顯示為 28px、20px 內文顯示為 13px，
整個簡報看起來像是縮小版，完全無法使用於簡報場景。

**解法**：改用純 CSS aspect-ratio 控制，Stage 直接填滿視窗，無需縮放補償。

#### Stage.tsx（移除 transform scale）
```tsx
export function Stage({ onAdvance, children }: Props) {
  return (
    <div className="app-shell">
      <div className="stage-frame" onClick={(e) => {
        const t = e.target as HTMLElement;
        if (t.closest("button, a, input, [data-no-advance]")) return;
        onAdvance();
      }}>
        {children}
      </div>
    </div>
  );
}
```

#### base.css（CSS 直接控制 16:9）
```css
.app-shell {
  position: fixed; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: var(--shell);
}

/* 固定畫布等比例縮放：永遠維持 16:9，填滿視窗較短的那一邊 */
.stage-frame {
  position: relative;
  width: min(100vw, calc(100vh * 16 / 9));
  height: min(100vh, calc(100vw * 9 / 16));
  background: var(--surface);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-stage);
}

/* stage padding 也要改為視窗真實 px */
--stage-pad-x: 64px;
--stage-pad-y: 48px;
```

#### 章節 CSS 字體規範（使用 clamp，真實視窗 px）
```css
/* 標題：clamp(最小, vw比例, 最大) */
.dX-day-title { font-size: clamp(32px, 3.6vw, 48px); font-weight: 900; }

/* 主要內文：22px 起跳，line-height 1.6 */
.content-text { font-size: clamp(17px, 1.7vw, 22px); line-height: 1.6; }

/* 卡片名稱 */
.card-name { font-size: clamp(20px, 2.2vw, 28px); font-weight: 700; }

/* Hero 大數字 */
.hero-num { font-size: clamp(52px, 6vw, 80px); font-weight: 900; }
```

#### split.css（960px → 50%）
```css
/* 舊 */
.split-left { flex: 0 0 960px; }
/* 新 */
.split-left { flex: 0 0 50%; }
```

#### SplitEnding.css（同上）
```css
.se-left { flex: 0 0 50%; }
```

#### 章節 layout 規範
```css
/* stage：flex column，讓 header + content 垂直排列 */
.dX-stage {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  padding: var(--stage-pad-y) var(--stage-pad-x);
  overflow: hidden;
}

/* header：固定在頂部，不伸縮 */
.dX-header { flex-shrink: 0; margin-bottom: 32px; }

/* 所有 content block：flex:1 填滿剩餘空間，不留空白 */
.dX-content { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 24px; }
```

> 裝飾性幾何圖形（雪花、光暈）必須 `position: absolute; z-index: 0;`，
> 文字 content 的 `z-index` 必須 > 裝飾層，確保不被推擠。

---

### 9. Scaffold 中文路徑問題

執行腳手架時，**不可以把絕對路徑（含中文字）當 TARGET 傳入**，
會導致 `npm create vite@latest` 在當前目錄建出鏡像資料夾結構。

```bash
# ❌ 錯誤：會在 web-video/ 底下建出 Users/blackjtsai/.../src 鏡像
bash scaffold.sh /Users/blackjtsai/Documents/web-video/site/20261220仙台/src

# ✅ 正確：先 cd 到父目錄，再用相對路徑
cd /Users/blackjtsai/Documents/web-video/site/20261220仙台
bash ~/.claude/skills/web-video-presentation/scripts/scaffold.sh src --theme=sunset-zine
```

如果已經跑出多餘的 `Users/` 資料夾，直接 `rm -rf Users/` 清除。

---

### 10. 新增章節流程
1. 建 `src/chapters/<NN>-<id>/narrations.ts` + `.tsx` + `.css`
2. 在 `src/registry/chapters.ts` 加 import + 陣列項目
3. `npx tsc --noEmit`
4. `npm run extract-narrations`
5. `PRESENTATION_TTS=edge-tts npm run synthesize-audio`
6. Bump `STORAGE_KEY`（`hooks/useStepper.ts`：v5 → v6）

---

## Checkpoint 清單

### Checkpoint 1（Phase 1 結束）
- [ ] 圖片對應正確（封面 / 每日）？
- [ ] 行程天數 / 章節切分合理？
- [ ] 有「出發前必知」或「伴手禮」章節？
- [ ] 有 PDF 手冊要提供下載嗎？

### Checkpoint 2（網頁版全章驗收）
- [ ] 視覺氣質對？主題色符合旅遊調性？
- [ ] 封面圖人物沒被裁切？
- [ ] 節奏對？某些步太快 / 太慢？
- [ ] 各章節圖片左半正確顯示？右側無重複背景圖？

### 網頁版驗收（結尾）
- [ ] 最後一步 `↓` 彈出 SplitEnding？
- [ ] SplitEnding：PDF 按鈕可下載？地圖連結正確打開？

### 手機版驗收
- [ ] 封面圖（Hero）等比例顯示，寬度 100%，無裁切、無漸層 overlay？
- [ ] 每個 Day section 圖片也等比例顯示，Day tag 在圖片下方？
- [ ] 播放時無法手動捲動（touchmove 被攔截）？
- [ ] 暫停後可立刻自由捲動（ref 即時解鎖，無殘留鎖定）？
- [ ] FAB 在播放狀態下仍可操作（z-index 100）？
- [ ] FAB 播放 / 長按 Scrubber 正常？
- [ ] 地圖按鈕點開 Google Maps 正確？
- [ ] 重新整理後回到頂部？
- [ ] PDF 下載按鈕可正常下載？
- [ ] LINE 開啟自動跳出外部瀏覽器？
- [ ] LINE 分享預覽卡有圖、有標題、有描述？（og:image 用橫幅圖）

### Phase 4 音頻驗收
- [ ] 播放時頁面自動捲到對應卡片？
- [ ] 所有段落都有 mp3？
- [ ] 口播文字通順？

---

## 相關資源

| 文件 | 時機 |
|---|---|
| [`_references/MOBILE-CRAFT.md`](_references/MOBILE-CRAFT.md) | Phase 3 必讀：完整組件規範 + CSS |
| [`_references/AUDIO-GUIDE.md`](_references/AUDIO-GUIDE.md) | Phase 4 必讀：edge-tts 合成流程 |
| `~/.claude/skills/web-video-presentation/` | Phase 2 基礎 |
| 澎湖範例：`site/20260528澎湖四日遊/src/` | 完整參考實作 |
