# Travel Presentation Skill

使用 **web-video-presentation** 做旅遊簡報，產出兩種版本：

| 版本 | 網址參數 | 用途 |
|---|---|---|
| 網頁版＋口播 | 無參數 或 `?layout=split` | 現場講解、投影、LINE 分享大螢幕 |
| 手機版＋口播 | `?layout=mobile` | LINE 分享、手機隨時查閱 |

---

## 起手方式

> 把素材放入 `doc/`，說：**`travel YYYYMMDD-地點`**，Claude 接手。

### 素材放置
```
doc/
├── *.jpg / *.png    ← 旅遊圖片（封面 + 每日）
└── *.pdf            ← 行程手冊（可選，供手機版下載）
```
`doc/` 優先讀 `article.md`；若無則從 PDF 提取；若 PDF 無法讀取請手動提供文字。

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
  ./presentation \
  --theme=sunset-zine        # 或其他主題，旅遊建議搭配暖色系

# 刪掉範例章節
rm -rf presentation/src/chapters/01-example
# 並在 registry/chapters.ts 移除 EXAMPLE_CHAPTER import 與陣列項
```

### 2.2 複製圖片
```bash
cp doc/封面圖.jpg presentation/public/images/cover.jpg
cp doc/Day1圖.jpg  presentation/public/images/day1.jpg
# 依此類推；若有 PDF 也一起複製
cp doc/旅遊行程手冊.pdf presentation/public/旅遊行程手冊.pdf
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

### Hero 全螢幕（封面圖不裁切）
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
  </div>
</div>
```
```css
.mp-hero { display: flex; flex-direction: column; min-height: 100dvh; }
.mp-hero-img { width: 100%; height: auto; display: block; flex-shrink: 0; }
.mp-hero-text {
  flex: 1;
  background: linear-gradient(to top, #5a9ec0 0%, #b0d4ea 50%, #f0f8ff 100%);
  display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;
}
```

### Section / Card 命名規則
| 元素 | id 格式 | 範例 |
|---|---|---|
| Section | `mp-s-{slug}` | `mp-s-hero`, `mp-s-day1`, `mp-s-know` |
| Card | `mp-c-{day}-{slug}` | `mp-c-d1-flight`, `mp-c-mk-docs` |

### 圖片路徑（重要）
```tsx
const img = (name: string) => `${baseUrl}images/${name}`;
// ✅ 正確：<img src={img("cover.jpg")} />
// ❌ 錯誤：<img src="/images/cover.jpg" />  ← vite base 不是 /
```
`vite.config.ts` 必須設 `base: "./"`.

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
cd presentation && npm run dev
```

| 版本 | 網址 | 備注 |
|---|---|---|
| 手機版 | `http://localhost:5173/{base}?layout=mobile` | 主要分享連結 |
| 手機版口播 | 同上，點右下角 🔊 FAB | 播放口播 |
| 網頁版 | `http://localhost:5173/{base}` | 現場講解/投影（預設即網頁版） |
| 網頁版口播 | 同上 + 右上角 Auto 切換 | 自動播放口播 |

> `{base}` 視 `vite.config.ts` 的 `base` 設定而定。  
> 新專案 `base: "./"` → URL 就是 `http://localhost:5173/`（無前綴）。  
> 若部署在子目錄（如 GitHub Pages `web-video/`）→ URL 會加上子目錄名稱。

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

### 4. 深色卡片文字可見
```css
/* mp-card--warn（黃底）需要覆蓋文字色 */
.mp-card--warn .mp-big-light   { color: #7a4a00; }
.mp-card--warn .mp-muted-light { color: #a06020; }
```

### 5. 主題色 Token（藍天白雲）
```css
--surface:     #f0f8ff;
--accent:      #1e8fcc;
--accent-soft: rgba(30,143,204,0.10);
--text:        #1a3858;
--text-mute:   #5a7a90;
--rule:        rgba(30,100,160,0.12);
```

### 6. Scaffold 預設 GitHub 圖示（必須移除）
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

### 7. 新增章節流程
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
- [ ] Hero 第一螢幕完整，不空白？
- [ ] 每日圖片 100% 寬，沒有裁切？
- [ ] 地圖按鈕點開 Google Maps 正確？
- [ ] FAB 播放 / 長按 Scrubber 正常？
- [ ] 重新整理後回到頂部？
- [ ] PDF 下載按鈕可正常下載？
- [ ] 頁面底部留白適當（日期文字距底 ~30px）？
- [ ] LINE 開啟自動跳出外部瀏覽器？

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
| 澎湖範例：`presentation/` | 完整參考實作 |
