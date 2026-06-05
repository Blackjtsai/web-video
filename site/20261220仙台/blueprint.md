# 系統藍圖 — 20261220仙台
> 最後更新：2026-05-29

## 章節登錄

| NN  | id        | CSS prefix | Steps | 標題                              |
|-----|-----------|------------|-------|-----------------------------------|
| 01  | coldopen  | `.co-`     |   4   | 開場：三位型男，東北雪季自駕       |
| 02  | day1      | `.d1-`     |   5   | Day 1：抵達仙台・牛舌初夜          |
| 03  | day2      | `.d2-`     |   6   | Day 2：Eboshi 衝鋒・藏王溫泉       |
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
| `src/styles/split.css`                      | split layout + 左側雪山漸層 placeholder（images 空目錄時顯示）   |
| `src/components/MobilePage.tsx:22`          | `SEGMENTS` 陣列（34 段，TTS 播放 + scrollIntoView 唯一真相源）   |
| `src/components/SplitEnding.tsx`            | 結尾資源面板（PDF 下載）                                        |
| `public/audio/<chapter-id>/<N>.mp3`         | 口播音頻（共 34 段）                                            |
| `public/images/`                            | ⚠ 空目錄，需放 day1~day5.jpg 滑雪照片                          |

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

### split.css 左側 placeholder

`public/images/` 目前為空。`.split-left` 已設雪山深藍漸層作為 placeholder。
若加入實際照片，`<img>` 會自動蓋掉漸層。

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
