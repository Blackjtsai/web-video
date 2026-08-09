# 系統藍圖 — 20261220仙台
> 最後更新：2026-08-09（依 PDF 確認：4 人、三家飯店、Day2–3 改住山形市區）

## 章節登錄

| NN  | id        | CSS prefix | Steps | 標題                              |
|-----|-----------|------------|-------|-----------------------------------|
| 01  | coldopen  | `.co-`     |   4   | 開場：四位型男，東北雪季自駕       |
| 02  | day1      | `.d1-`     |   5   | Day 1：抵達仙台・牛舌初夜          |
| 03  | day2      | `.d2-`     |   6   | Day 2：Eboshi 衝鋒・翻山住山形市區 |
| 04  | day3      | `.d3-`     |   5   | Day 3：制霸藏王大雪場・溫泉名湯    |
| 05  | day4      | `.d4-`     |   5   | Day 4：仙台泉夜滑・三連戰完結      |
| 06  | day5      | `.d5-`     |   4   | Day 5：聖誕夜返台・圓滿落幕        |
| 07  | must-know | `.mk-`     |   5   | 出發前必知・雪地自駕攻略           |

**總步數：34 步 = narrations.ts 段數 = 音頻數量（三者必須一致）**

## 關鍵檔案

| 檔案（相對 src/）                            | 關鍵內容                                                        |
|---------------------------------------------|-----------------------------------------------------------------|
| `src/registry/chapters.ts`                  | CHAPTERS 陣列，章節順序唯一真相源                               |
| `src/App.tsx:20`                            | SPLIT_IMAGES（day1–day5 有 split；coldopen/must-know 走 `.scene`）|
| `src/App.tsx:29`                            | `isMobileMode = params.get("layout") === "mobile"`              |
| `src/hooks/useStepper.ts:8`                 | `STORAGE_KEY = "presentation-cursor-v1-sendai"`（新增章節要 bump）|
| `src/styles/tokens.css`                     | 主題色 midnight-ice                                             |
| `src/styles/split.css`                      | split layout + 左側雪山漸層 placeholder                         |
| `src/components/MobilePage.tsx:22`          | `SEGMENTS` 陣列（34 段，TTS 播放 + scrollIntoView 唯一真相源）   |
| `src/components/SplitEnding.tsx`            | 結尾資源面板（PDF 下載）                                        |
| `public/audio/<chapter-id>/<N>.mp3`         | 口播音頻（共 34 段）                                            |
| `public/images/spots/`                      | 15 張景點圖（見下方圖片清單）                                   |

## 圖片清單（public/images/spots/）

```
beef-tongue.jpg      eboshi.jpg           genghis-khan.jpg
hotel-metropolitan.jpg  izakaya.jpg       outlet.jpg
ramen.jpg            sendai-airport.jpg   sendai-beef.jpg
snow-road.jpg        souvenirs.jpg        spring-valley.jpg
sukiyaki.jpg         zao-onsen.jpg        zao.jpg
```

手機版 `<img src="images/spots/xxx.jpg">` 用相對路徑（不加 `import.meta.env.BASE_URL`）。
桌面版 ColdOpen CSS 背景圖用 `var(--co-bg-image)` inline style + `${base}images/spots/zao.jpg`。

## 主題色（midnight-ice）

```css
--shell:        #071523;   /* 極夜山頂（畫面外框） */
--surface:      #0d1b2a;   /* 深夜藍（主背景） */
--surface-2:    #132338;   /* 稍淺深藍 */
--surface-3:    #1c3050;   /* 中等深藍 */
--accent:       #4fc3f7;   /* 冰晶藍（強調色） */
--text:         #e8f4fd;   /* 雪白（主文字） */
--text-2:       #b8d8f0;   /* 冰藍白 */
--text-mute:    #7ab8d8;   /* 淡冰藍 */
--r-card:       0px;       /* crisp editorial，無圓角 */
```

字體：`Archivo Black`（英文顯示）＋ `Noto Sans SC`（中文）

## 班機資訊

| 方向 | 日期 | 班號 | 出發 | 抵達 | 飛行時間 |
|------|------|------|------|------|----------|
| 去程 | 12/20（日） | IT254（虎航） | TPE 14:35 | SDJ 18:45 | 3h10m |
| 回程 | 12/24（四） | IT255（虎航） | SDJ 19:40 | TPE 23:00 | 3h20m |

手機版 Day1/Day5 班機區塊 CSS：`borderTop + borderBottom + marginTop: 24 + padding: 14px 0`。
統一使用 `mp-flight-time`（白色）而非 `mp-flight-time-light`（藍色）以保持一致性。

## 手機版 Must-Know 卡片結構（2026-06-15 更新）

Must-Know 章節改為各景點 / 美食獨立卡片，不再是純文字 list：

**三座雪場（各一卡）**：`mp-c-mk-ski`（Eboshi）、無 id（藏王）、無 id（Spring Valley）
- 每卡：圖片 + stats two-col + Maps chip + 官方網站 chip + mp-note

**四道美食（各一卡）**：`mp-c-mk-food`（牛舌）、無 id（壽喜燒 / 成吉思汗 / 拉麵）
- 每卡：圖片 + 多店 Maps chip

⚠️ `id="mp-c-mk-ski"` 和 `id="mp-c-mk-food"` 必須保留在各類別的第一張卡，
供 SEGMENTS 音頻 scroll sync 使用（step 4 / step 5）。

## 特殊注意事項

### Split layout 跑版通案（2026-05-29 全面修）

**根因**：right panel ≈ stage 的 50%，但各章側欄元件用 `vw`（全寬）計算，
加上主資訊卡 `flex: 1` 缺少 `min-width: 0`，導致 flexbox 無法正確壓縮。

**修正通則**（已套用到 Day2 / Day3 / Day4 / Day5）：

| 修正點 | 做法 |
|--------|------|
| `flex: 1` 主卡 | 補 `min-width: 0` |
| 側欄 `vw` 過大 | 從 `20~24vw` 降至 `12~13vw`，max 上限降到 185~200px |
| stats row 溢出 | `flex-wrap: wrap`，縮小 gap / padding |
| 英文副標 | `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` |
| 數字字體過大 | 同步縮小 `clamp()` 上下限 |

```
Day2 step1: d2-resort-card min-width:0 / d2-slope-visual 24vw→13vw
Day3 step1: d3-zao-card min-width:0 / d3-tree-ice 22vw→12vw
Day4 step2: d4-resort-card min-width:0 / d4-night-visual 20vw→12vw
Day5 step1: d5-outlet-info min-width:0 / d5-outlet-map 20vw→13vw / d5-dist-num 6.5vw→4vw
```

### 手機版圖片全寬出血（mp-card-img）

```css
.mp-card-img {
  width: calc(100% + 32px);
  max-width: none;        /* 必填：覆蓋 base.css img { max-width: 100% } */
  margin: -14px -16px 6px;
  height: 180px;
  object-fit: cover;
}
```

`max-width: none` 是關鍵。base.css line 24 全域 `img { max-width: 100% }` 會讓
`width: calc(100% + 32px)` 失效，右側留白。

### mp-card 改為 display: block

原 `display: flex; flex-direction: column` → 改 `display: block`，
`gap` 改用 `.mp-card > * + * { margin-top: 8px }`。
讓 `calc(100% + 32px)` 全寬圖正確出血，不被 flex 限制。

### ProgressBar

必須傳 `githubUrl={null}`，否則 hover 進度條時出現範本作者 GitHub 圖示。

### STORAGE_KEY

目前為 `v1-sendai`。章節 step 數有異動時務必 bump（參考 `useStepper.ts:8`）。

## TTS 狀態

| 項目 | 值 |
|------|----|
| Provider | edge-tts |
| Voice | `zh-TW-HsiaoChenNeural` |
| 已合成 | 34 / 34 段 |
| 合成指令 | `cd site/20261220仙台/src && PRESENTATION_TTS=edge-tts npm run synthesize-audio` |

## 啟動指令

```bash
cd site/20261220仙台/src
npm run dev
# 網頁版：http://localhost:5174/
# 手機版：http://localhost:5174/?layout=mobile
```

## 新增章節流程

1. 建 `src/chapters/<NN>-<id>/narrations.ts` + `<Chapter>.tsx` + `<Chapter>.css`
2. 在 `src/registry/chapters.ts` 加 import + CHAPTERS 項目
3. 若有 split 圖，在 `src/App.tsx` 的 `SPLIT_IMAGES` 加對應 `<id>: \`${base}images/<id>.jpg\``
4. 若有手機版卡片，在 `src/components/MobilePage.tsx` 的 `SEGMENTS` + `CHAPTER_GROUPS` 補上
5. `npx tsc --noEmit` 確認零錯誤
6. `npm run extract-narrations` 更新 audio-segments.json
7. `PRESENTATION_TTS=edge-tts npm run synthesize-audio` 合成新段音頻
8. Bump `STORAGE_KEY`（`v1-sendai` → `v2-sendai`）
