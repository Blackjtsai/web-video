# 系統藍圖 — 20261006北海道八日遊
> 最後更新：2026-06-08

## 章節登錄

| NN  | id        | CSS prefix | Steps | 標題                                |
|-----|-----------|------------|-------|-------------------------------------|
| 01  | coldopen  | `.co-`     |   4   | 開場：六人，秋日北海道見            |
| 02  | day1      | `.d1-`     |   4   | Day 1：順利抵達，札幌市區慢活       |
| 03  | day2      | `.d2-`     |   4   | Day 2：白色戀人 & T38 璀璨夜景      |
| 04  | day3      | `.d3-`     |   4   | Day 3：美玲指定！海鮮市場 & 定山溪  |
| 05  | day4      | `.d4-`     |   5   | Day 4：螃蟹大宴 & 洞爺湖花火        |
| 06  | day5      | `.d5-`     |   4   | Day 5：網美牧場 & 二世谷神仙沼      |
| 07  | day6      | `.d6-`     |   4   | Day 6：積丹海岸自駕 & Glow 和牛 BBQ |
| 08  | day7      | `.d7-`     |   4   | Day 7：小樽運河遊船 & 和牛慶功宴    |
| 09  | day8      | `.d8-`     |   3   | Day 8：新千歲大補貨 & 快樂賦歸      |
| 10  | must-know | `.mk-`     |   5   | 出發前必知 & 北海道名產攻略         |

**總步數：41 步 = narrations.ts 段數 = SEGMENTS 段數 = 音頻數量（四者一致 ✓）**

## 關鍵檔案

| 檔案（相對 src/）                     | 關鍵內容 |
|--------------------------------------|---------|
| `src/registry/chapters.ts`           | CHAPTERS 陣列，章節順序唯一真相源 |
| `src/App.tsx`                        | `isMobile` 判斷 (`?layout=mobile`) |
| `src/hooks/useStepper.ts`            | `STORAGE_KEY = "presentation-cursor-v4"` |
| `src/styles/tokens.css`              | 主題色 token（楓葉秋光） |
| `src/components/MobilePage.tsx`      | SEGMENTS 41 段；scroll lock 用 touchmove ref（見特殊 hack）|
| `src/components/MobilePage.css`      | 手機版樣式（mp- prefix）；圖片等比例；FAB 設計 |
| `src/components/ProgressBar.tsx`     | 傳 `githubUrl={null}` |
| `src/scripts/tts-providers/edge-tts.sh` | 從澎湖複製來的（原本缺失）|
| `vite.config.ts`                     | `base: process.env.VITE_BASE ?? "./"` |
| `public/images/`                     | 高畫質原圖（網頁版用） |
| `public/images-mobile/`              | 壓縮版（quality 75, max 1400px，手機版用）|
| `public/audio/<id>/<N>.mp3`          | 口播音頻（41 段，已合成）|

## 主題色（楓葉秋光）

```css
--surface:      #f5ece0;
--surface-2:    #faf4ec;
--surface-3:    #e8daca;
--text:         #2a1a0e;
--text-2:       #3a2516;
--text-mute:    #7a5c3e;
--text-faint:   #b09070;
--rule:         #c4a882;
--accent:       #bf4400;             /* 楓葉橙紅 */
--accent-soft:  rgba(191, 68, 0, 0.10);
--accent-glow:  rgba(191, 68, 0, 0.32);
```

## 圖片資產

```
public/images/          ← 高畫質原圖（網頁版 split-left 用）
  cover.jpg、day1.jpg–day8.jpg
  jozankei.jpg、koibito-park.jpg、otaru-canal.jpg
  senen-numa.jpg、shakotan.jpg、toya-lake.jpg
  souvenir-rokkatei.jpg、souvenir-shiroi-koibito.jpg

public/images-mobile/   ← 壓縮版（手機版 MobilePage 用，共 18 張）
  cover.jpg              530K  原始封面（未換）
  day1.jpg               836K  1046×1504  ← 實際行程照片（已換）
  day2.jpg–day7.jpg      各 270–620K
  day8.jpg               572K  960×1440   ← 實際行程照片（已換）
  og-img.jpg             572K  1200×800   ← LINE/OG 預覽專用圖（新增）
  其餘景點圖：jozankei、koibito-park、otaru-canal、senen-numa、shakotan、
              toya-lake、souvenir-rokkatei、souvenir-shiroi-koibito
```

## 手機版架構（MobilePage）

### 圖片佈局（等比例，非 100dvh）
```css
/* 封面 / 每日圖：自然等比例，寬 100%，無裁切，無漸層 overlay */
.mp-hero-img { width: 100%; height: auto; display: block; }
.mp-day-img  { width: 100%; height: auto; display: block; }

/* 文字區塊跟在圖片下方，淺色背景 */
.mp-hero-text  { background: var(--surface); padding: 16px 20px 20px; }
.mp-day-overlay { background: var(--surface); padding: 12px 16px 4px; }
```

### Scroll Lock（正確做法，非透明 overlay）
iOS 上透明 overlay 移除後有時 scroll 狀態不立刻恢復。正確做法：

```tsx
// MobilePage
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

// 傳給 FAB
<MobileAudioFab baseUrl={baseUrl} onLock={handleLock} onUnlock={handleUnlock} />
```

- `passive: false` 才能 `preventDefault()`
- ref 即時更新，不需等 React 重渲染
- 暫停後下一個 touchmove 立刻解鎖

### FAB 佈局
```
bottom: 28px;  right: 20px  ← 聲音 FAB（z-index 100）
bottom: 96px;  right: 20px  ← 意見 FAB（z-index 100，正上方）
bottom: 200px; z-index 200  ← Scrubber overlay（長壓開啟）
```

### 每日住宿卡（MobilePage）

每個 Day section 末尾都有一張住宿卡，格式統一：
```tsx
<div id="mp-c-dN-hotel" className="mp-card">
  <div className="mp-card-title mp-card-title--row">
    <span>🏨 今晚住宿</span>
    <MapBtn q="Hotel English Name" />
  </div>
  <div className="mp-hotel-name">中文飯店名</div>
  <div className="mp-hotel-en">English Name</div>
  <span className="mp-meal-badge mp-meal-badge--bf">🍳 附早餐</span>
</div>
```

餐食標籤三種：
| 類型 | class | 顏色 |
|---|---|---|
| 附早餐 | `mp-meal-badge--bf` | 綠色 |
| 附早晚餐（暗色卡用） | `mp-meal-badge--bfdn-dark` | 金黃 |
| 無附早餐 | `mp-meal-badge--none` | 灰色 |

住宿明細：
| Day | 飯店 | MapBtn query | 餐食 |
|---|---|---|---|
| 1–3, 7 | 札幌伊夢酒店 | `Hotel Emion Sapporo` | 附早餐 |
| 4 | 洞爺湖萬世閣 | `Toya Manseikaku Hotel Hokkaido` | 附早晚餐 |
| 5 | 托里菲托新雪谷飯店 | `Torifito Hotel Niseko Hokkaido` | 附早餐 |
| 6 | Glow 別墅 | `Glow villa Otaru Hokkaido` | 無附早餐 |

### 意見回饋（Formspree）
- 端點：`https://formspree.io/f/xvznkbjo`
- 欄位：`name`（最多 20 字）、`message`（最多 300 字），含字數計數器
- 包含行程日期提示（10/06 出發・10/13 回程）
- 送出後顯示 success state；後台可 CSV 匯出給 Claude Desktop 分析

## 特殊 hack

- 無 `split.css`（網頁版直接用 Stage + ProgressBar，無 SplitLayout）
- `ProgressBar` 必須傳 `githubUrl={null}`
- `vite.config.ts` 補了 `base: process.env.VITE_BASE ?? "./"` 才能 GitHub Pages 部署
- `edge-tts.sh` 從澎湖複製（路徑 `src/scripts/tts-providers/edge-tts.sh`）
- 圖片必須用 `const img = (n: string) => \`${baseUrl}images-mobile/${n}\`` helper 而非硬碼路徑
- `index.html` 的 `og:image` 指向 `images-mobile/og-img.jpg`（非 cover.jpg，獨立 OG 圖）
- LINE 分享後快取 OG 圖需改 URL 或 `?v=N` 強制刷新

## TTS 狀態

| 項目 | 值 |
|------|----|
| Provider | edge-tts |
| Voice | `zh-TW-HsiaoChenNeural` |
| 已合成 | 41 / 41 段 ✅ |
| 合成指令 | `cd site/20261006北海道八日遊/src && PRESENTATION_TTS=edge-tts npm run synthesize-audio` |

## 啟動指令

```bash
cd site/20261006北海道八日遊/src
npm install      # 第一次需要
npm run dev
# 網頁版：http://localhost:5174/
# 手機版：http://localhost:5174/?layout=mobile
# ⚠️ 若仙台同時跑，port 自動 bump 到 5175
```

## 新增章節流程

1. 建 `src/chapters/<NN>-<id>/narrations.ts` + `.tsx` + `.css`
2. 在 `src/registry/chapters.ts` 加 import + CHAPTERS 項目
3. 在 `src/components/MobilePage.tsx` 的 `SEGMENTS` + `CHAPTER_GROUPS` 補段落
4. `npx tsc --noEmit`
5. `npm run extract-narrations`
6. `PRESENTATION_TTS=edge-tts npm run synthesize-audio`
7. Bump `STORAGE_KEY`（v4 → v5）
