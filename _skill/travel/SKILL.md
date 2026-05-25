# Travel Presentation Skill

使用 **web-video-presentation** 做旅遊簡報，並擴充出三種版本：

| 版本 | 網址參數 | 用途 |
|---|---|---|
| 16:9 自動播放 | `?auto=1` | 錄屏成片 |
| 左右分割版 | `?layout=split` | 現場講解、投影 |
| 手機版 | `?layout=mobile` | LINE 分享、隨時查閱 |

---

## 起手方式

> 把素材放入 `doc/`，說：**`travel YYYYMMDD-地點`**，Claude 接手。

### 素材放置
```
doc/
├── *.jpg / *.png    ← 旅遊圖片（封面 + 每日）
└── *.pdf            ← 行程手冊（可選）
```
`doc/` 優先讀 `article.md`；若無則從 PDF 提取；若 PDF 無法讀取請手動提供文字。

---

## 工作流程

```
Phase 1   讀取素材（doc/ → article.md → trip.json）
  ▼
[Checkpoint 1]  確認行程結構、圖片對應、天數
  ▼
Phase 2   16:9 簡報（web-video-presentation）
  ▼
[Checkpoint 2]  第 1 章驗收（風格錨點）
  ▼
Phase 3   分割版（?layout=split）
  ▼
Phase 4   手機版（?layout=mobile）
  ▼
[Checkpoint Audio]  是否合成口播音頻？
  ▼
Phase 5   音頻合成（edge-tts）
  ▼
Phase 6   交付
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
      "activities": ["✈️ 航班 12:10 → 13:10", "🏠 夏天正涼民宿"]
    }
  ],
  "mustKnow": ["身分證", "暈船藥"],
  "souvenirs": ["黑糖糕", "小管一夜干"]
}
```

---

## Phase 2 — 16:9 簡報

依照 **web-video-presentation** Skill 標準流程建立 `presentation/`。

### 圖片複製
```bash
cp doc/封面圖.jpg presentation/public/images/cover.jpg
cp doc/Day1圖.jpg  presentation/public/images/day1.jpg
# 依此類推
```

### 章節規劃建議
| 章節 | 內容 | 建議 Steps |
|---|---|---|
| coldopen | 開場：人數、行程預告 | 3–4 |
| dayN | 每日行程 | 4–6 |
| must-know | 出發前必知 + 伴手禮 | 4–6 |

### 封面圖人物不裁切（portrait 圖）
在 `coldopen` Step 0 加模糊背景層：
```tsx
<img className="co-hero-bg"  src={`${import.meta.env.BASE_URL}images/cover.jpg`} aria-hidden />
<img className="co-hero-img" src={`${import.meta.env.BASE_URL}images/cover.jpg`} alt="封面" />
```
```css
.co-hero-bg  { position: absolute; inset: -40px; width: calc(100% + 80px); height: calc(100% + 80px); object-fit: cover; filter: blur(32px) brightness(0.5); }
.co-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
```

---

## Phase 3 — 分割版（?layout=split）

### 架構
- 左半（960px）：固定章節圖片（`object-fit: contain`，無裁切）
- 右半（960px）：章節 step 內容
- 鍵盤操作：`↓` 下一步 / `↑` 上一步（最後一步 `↓` → 結尾畫面）

### SPLIT_IMAGES 設定（App.tsx）
```ts
const SPLIT_IMAGES: Record<string, string> = {
  day1: "images/day1.jpg",
  day2: "images/day2.jpg",
  day3: "images/day3.jpg",
  day4: "images/day4.jpg",
};
```
> coldopen / must-know 沒有圖片 → 正常顯示完整章節畫面

### 右側步驟衝突修正（split.css）
章節若有自帶背景圖，在分割版右側會重複，需隱藏：
```css
/* 範例：Day1 煙火章節 */
.split-right .d1-fw-bg    { display: none !important; }
.split-right .d1-fireworks { background: rgba(26,56,88,0.96); }
```
> 每個章節測試一遍，有重複圖或排版爆版的 class 都在 `split.css` 加修正

### 結尾畫面
```tsx
// SplitEnding.tsx：分割版到最後一步後顯示 END 畫面
{isSplitMode && showEnding && <SplitEnding baseUrl={import.meta.env.BASE_URL} />}
```

---

## Phase 4 — 手機版（?layout=mobile）

詳細組件規範見 [`_references/MOBILE-CRAFT.md`](_references/MOBILE-CRAFT.md)。

### App.tsx 整合
```tsx
// 在 App.tsx 最外層，hooks 呼叫前 early return
if (isMobileMode) {
  return <MobilePage baseUrl={import.meta.env.BASE_URL} />;
}
```
> ⚠️ 不能在 `Presentation()` 內 early return（違反 hooks 規則），要在 App 最外層。

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
<!-- index.html -->
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

---

## Phase 5 — 音頻合成

詳細流程見 [`_references/AUDIO-GUIDE.md`](_references/AUDIO-GUIDE.md)。

### SEGMENTS 陣列（唯一真相源）
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

## Phase 6 — 交付

```bash
cd presentation && npm run dev
```

| 版本 | 網址 |
|---|---|
| 手機版 | `http://localhost:5173/?layout=mobile` |
| 手機版口播 | 同上，點右下角 🔊 FAB |
| 分割版 | `http://localhost:5173/?layout=split` |
| 16:9 自動播放 | `http://localhost:5173/?auto=1` |

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
舊版 LINE 不支援時，顯示綠色 banner 引導手動開啟。

### 2. Google Maps 按鈕（MapBtn）
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
Tag chip 也可以直接改為 `<a>` 連結：
```tsx
<a href={`https://maps.google.com/?q=${encodeURIComponent(q)}`}
   target="_blank" rel="noopener noreferrer" className="mp-tag-chip mp-tag-chip--map">
  地點名稱 🗺
</a>
```

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

### 6. 新增章節流程
1. 建 `src/chapters/<NN>-<id>/narrations.ts` + `.tsx` + `.css`
2. 在 `src/registry/chapters.ts` 加 import + 陣列項目
3. `npx tsc --noEmit`
4. `npm run extract-narrations`
5. `PRESENTATION_TTS=edge-tts npm run synthesize-audio`
6. Bump `STORAGE_KEY`（`hooks/useStepper.ts`：v5 → v6）

---

## Checkpoint 清單

### Phase 1 結束
- [ ] 圖片對應正確（封面 / 每日）？
- [ ] 行程天數 / 章節切分合理？
- [ ] 有沒有「出發前必知」或「伴手禮」章節？

### Phase 2 第 1 章驗收
- [ ] 視覺氣質對？主題色符合旅遊調性？
- [ ] 封面圖人物沒被裁切？
- [ ] 節奏對？某些步太快 / 太慢？

### Phase 4 手機版驗收
- [ ] Hero 第一螢幕完整，不空白？
- [ ] 每日圖片 100% 寬，沒有裁切？
- [ ] 地圖按鈕點開 Google Maps 正確？
- [ ] FAB 播放 / 長按 Scrubber 正常？
- [ ] 重新整理後回到頂部？

### Phase 5 音頻驗收
- [ ] 播放時頁面自動捲到對應卡片？
- [ ] 所有段落都有 mp3？
- [ ] 口播文字通順？

---

## 相關資源

| 文件 | 時機 |
|---|---|
| [`_references/MOBILE-CRAFT.md`](_references/MOBILE-CRAFT.md) | Phase 4 必讀：完整組件規範 + CSS |
| [`_references/AUDIO-GUIDE.md`](_references/AUDIO-GUIDE.md) | Phase 5 必讀：edge-tts 合成流程 |
| `~/.claude/skills/web-video-presentation/` | Phase 2 基礎 |
| 澎湖範例：`presentation/` | 完整參考實作 |
