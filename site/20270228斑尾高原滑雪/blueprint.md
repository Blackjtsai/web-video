# 系統藍圖 — 2027 斑尾高原四日滑雪
> 最後更新：2026-08-19

## 架構說明

此專案現為**網頁版（split-screen stepper）＋手機版**雙版本：

| 版本 | 網址參數 | 入口 |
|---|---|---|
| 網頁版（現場講解/投影） | 無參數 | `src/src/App.tsx` → `Presentation`（`useStepper` + `CHAPTERS`） |
| 手機版（LINE 分享） | `?layout=mobile` | `src/src/components/MobilePage.tsx`（單一長頁） |

`App.tsx` 用 `isMobileMode = params.get("layout") === "mobile"` 分流，手機版邏輯完全未變動。

**Hero / Day 封面照片**：沿用既有 Wikimedia Commons（CC BY-SA）斑尾高原、Tangram 雪場實景照，
`public/images-mobile/`（壓縮版，手機版用）與新複製的 `public/images/`（原始解析度，網頁版 split-left 用）
內容相同來源，僅解析度不同。

## 章節登錄（網頁版）

| NN  | id           | CSS prefix | Steps | 簡述                             |
|-----|--------------|------------|-------|----------------------------------|
| 01  | sp-coldopen  | .co-       | 2     | 開場（hero + 交通/住宿優勢總覽） |
| 02  | sp-day1      | .d1-       | 2     | Day1 去程交通 + 抵達開滑         |
| 03  | sp-day2      | .d2-       | 1     | Day2 斑尾全山攻略日              |
| 04  | sp-day3      | .d3-       | 1     | Day3 斑尾 → Tangram              |
| 05  | sp-day4      | .d4-       | 2     | Day4 Best Snow Day + 回程交通    |
| 06  | sp-must-know | .mk-       | 4     | 住宿與出發前必知（含預算明細）   |

**總步數：12 步**（= `src/registry/chapters.ts` 登錄的各章節 narrations.ts 段數總和 = `public/audio/sp-*/N.mp3` 數量，三者一致 ✓）

> **id 刻意加 `sp-` 前綴**（split-web），原因：手機版既有的 `mobile-narrations.ts` 已經用了
> `coldopen` / `overview` / `day1` / `day2` / `day3` / `day4` / `budget` / `must-know` 這些 id，
> 對應音檔存在 `public/audio/coldopen/1.mp3` 等路徑。若網頁章節也用同樣 id（如 `day1`），
> `synthesize-audio.sh` 會把新章節的第 1、2 步音檔直接覆蓋到手機版原本正確的 `day1/1.mp3`、`day1/2.mp3`
> ——這是本次施工中識別出的最大風險，用 `sp-` 前綴讓兩套音檔目錄完全不相交來避免。

## SPLIT_IMAGES（App.tsx）

| chapter id | 圖片 |
|---|---|
| sp-day1 | `images/day1.jpg`（step 0、1 皆同） |
| sp-day2 | `images/day2.jpg` |
| sp-day3 | `images/day3.jpg` |
| sp-day4 | `images/day4.jpg`（step 0、1 皆同） |
| sp-coldopen / sp-must-know | 不設圖 → 顯示完整章節畫面（coldopen 自己內建全螢幕 hero/overview 背景圖） |

## SplitEnding（`src/src/components/SplitEnding.tsx`）

- 左半：`images/hero.jpg` 暗色遮罩 + END + 「斑尾高原，我們來了。」+ 日期範圍
- 右半：
  - 行程手冊：`2027斑尾高原滑雪行程_V1.pdf` 下載按鈕
  - 住宿聯絡：Hotel Madam Mirei
  - 地圖導航（MAPS 陣列，英文搜尋字串）：斑尾高原滑雪場 / Tangram Ski Circus / Hotel Madam Mirei / 飯山站 / 羽田機場

## SEGMENTS（手機版語音導讀段數，未變動）

| id         | step | cardId              | 說明                     |
|------------|------|---------------------|--------------------------|
| coldopen   | 1    | mp-s-hero           | 開場介紹                 |
| overview   | 1    | mp-s-overview       | 4 天總覽・交通優勢       |
| day1       | 1    | mp-s-day1           | Day1 去程交通細節        |
| day1       | 2    | mp-c-d1-ski         | Day1 滑雪初探            |
| day2       | 1    | mp-s-day2           | Day2 Madarao 全山攻略    |
| day3       | 1    | mp-s-day3           | Day3 Madarao → Tangram   |
| day4       | 1    | mp-s-day4           | Day4 Best Snow Day       |
| day4       | 2    | mp-c-d4-return       | Day4 回程交通細節         |
| budget     | 1    | mp-s-budget         | 住宿介紹                 |
| budget     | 2    | mp-c-budget-table    | 每人預算明細表            |
| must-know  | 1    | mp-s-know           | 出發前必知（前半）        |
| must-know  | 2    | mp-c-mk-2            | 出發前必知（後半）        |

**手機版總 SEGMENTS：12 段 = mobile-narrations.ts 段數 = 音頻數量（三者一致 ✓，本次施工完全未動）**

## 內容結構

- **DAYS**：4 天陣列，含 tag / date / gradientClass / time / focus（MobilePage.tsx）
- **BUDGET_ITEMS**：每人預算明細（機票／住宿／交通／雪票／保險／餐費／雪具），網頁版 `sp-must-know` 章節重用同一份資料改寫
- **MUST_KNOW**：6 項出發前必知，網頁版 `sp-must-know` 章節精簡改寫為 2 步（行李保險 / V1班表+現金交通卡）
- **雪具**：飯店（Hotel Madam Mirei）現場可租，比自行攜帶搭機更便宜也省事，網頁版與手機版口徑一致

## 關鍵檔案

| 檔案（相對 src/）                              | 關鍵內容                                        |
|-------------------------------------------------|--------------------------------------------------|
| `src/App.tsx`                                    | SPLIT_IMAGES 對照、isMobileMode 判斷、Presentation stepper |
| `src/registry/chapters.ts`                       | CHAPTERS 陣列（6 章節，`sp-` 前綴 id）           |
| `src/chapters/01-sp-coldopen/` ~ `06-sp-must-know/` | 各章節 narrations.ts + .tsx + .css              |
| `src/hooks/useStepper.ts`                        | STORAGE_KEY = "presentation-cursor-v5"           |
| `src/components/SplitEnding.tsx`                 | MAPS 陣列、PDF 下載、住宿聯絡                     |
| `src/components/MobilePage.tsx`                  | DAYS、BUDGET_ITEMS、MUST_KNOW、SEGMENTS（12段）、CHAPTER_GROUPS、MobileAudioFab、scroll lock（未變動） |
| `src/mobile-narrations.ts`                       | 手機版 12 段語音稿（唯一真相源，未變動）          |
| `src/styles/tokens.css`                          | 主題色 token（madarao-snow，沿用仙台 midnight-ice 色階） |
| `src/styles/split.css`                           | `?layout=split` 版面（50/50 分割，通用，無需章節專屬修正） |
| `scripts/extract-all-narrations.ts`              | 合併抽取網頁版 6 章節 + 手機版 12 段 → 單一 `audio-segments.json`（24 段） |
| `public/audio/sp-*/N.mp3`                        | 網頁版 12 段音檔（新增） |
| `public/audio/<id>/N.mp3`                        | 手機版 12 段音檔（未變動，原本就存在） |
| `public/2027斑尾高原滑雪行程_V1.pdf`             | 原始 PDF，手機版 Footer 與網頁版 SplitEnding 皆下載此檔 |
| `public/images-mobile/`                          | Hero + Day1~4 + overview 實景照（壓縮版，手機版用） |
| `public/images/`                                 | 同一批實景照原始解析度（新增，網頁版 split-left 用） |

## 主題色（madarao-snow，沿用仙台 midnight-ice 色階）

```css
--shell:        #071523;
--surface:      #0d1b2a;   /* 深夜藍 */
--surface-2:    #132338;
--surface-3:    #1c3050;
--text:         #e8f4fd;   /* 雪白 */
--text-2:       #b8d8f0;
--text-mute:    #7ab8d8;
--accent:       #4fc3f7;   /* 冰晶藍 */
--rule:         rgba(79, 195, 247, 0.18);
```

## 特殊 hack / 設計決策

- **`sp-` id 前綴避免音檔覆蓋**：見上方「章節登錄」說明，這是本次施工最關鍵的決策。
- **章節資料夾名稱同步加前綴**（`01-sp-coldopen` 而非 `01-coldopen`）：因為 `extract-all-narrations.ts`
  是用「資料夾名稱以 `-{id}` 結尾」規則反查資料夾，id 與資料夾名稱前綴必須一致才能配對成功。
- **合併版 extract 腳本**：新增 `scripts/extract-all-narrations.ts` 取代 `package.json` 原本指向的
  `scripts/extract-mobile-narrations.ts`（僅處理手機版）。新腳本同時讀 `registry/chapters.ts`（網頁版）
  與 `mobile-narrations.ts`（手機版），輸出合併後的單一 `audio-segments.json`，並在 id 撞名時主動丟錯提醒。
  `scripts/extract-mobile-narrations.ts`、`scripts/extract-narrations.ts`（scaffold 原生、僅處理網頁版）兩支舊檔保留在原地未刪除，但 `package.json` 的 `extract-narrations` script 已改指向新檔。
- **封面圖不裁切**：`sp-coldopen` step 0 用 `.co-hero-bg`（模糊背景層）+ `.co-hero-img`（`object-fit: contain` 前景層）標準寫法。
- **split.css 無需章節專屬修正**：6 個章節皆為文字/卡片內容，無自帶全螢幕背景圖與 split-left 圖片衝突，`split.css` 沿用志賀高原專案的通用版本，未新增規則。
- **scroll lock / Hero 封面等比例（手機版）**：完全未變動，沿用原有 touchmove ref 做法。
- **STORAGE_KEY bump**：`presentation-cursor-v4` → `presentation-cursor-v5`（新增網頁版章節結構）。
- **未清除的殘留檔案**：施工過程中先啟動了一個背景 agent 平行處理同一任務，該 agent 中途發現衝突後自行停手，
  但留下了 `src/chapters/01-coldopen-web/` ~ `06-must-know-web/` 六個**未被 registry 引用、不影響 build/dev 的死目錄**
  （sandbox 權限擋下 `rm -rf`，未能自動清除）。建議之後手動執行
  `rm -rf src/chapters/{01-coldopen-web,02-day1-web,03-day2-web,04-day3-web,05-day4-web,06-must-know-web}` 清掉。

## TTS 狀態

| 項目        | 值                                          |
|-------------|----------------------------------------------|
| Provider    | edge-tts                                    |
| Voice       | `zh-TW-HsiaoChenNeural`                    |
| 網頁版已合成 | 12 / 12 段 ✓（`public/audio/sp-*/`，本次新增） |
| 手機版已合成 | 12 / 12 段 ✓（`public/audio/<id>/`，本次完全未觸碰，逐一確認為 skip） |
| 合成指令    | `cd site/20270228斑尾高原滑雪/src && PRESENTATION_TTS=edge-tts npm run synthesize-audio` |

## Build 驗證

```bash
cd site/20270228斑尾高原滑雪/src
VITE_BASE=/web-video/madarao/ npm run build
grep -o 'src="[^"]*"\|href="[^"]*"' dist/index.html
# → src="/web-video/madarao/assets/index-*.js"
# → href="/web-video/madarao/assets/index-*.css"
```
已於 2026-08-19 驗證通過，路徑前綴正確。

## 啟動指令

```bash
cd site/20270228斑尾高原滑雪/src
npm run dev
# 網頁版：http://localhost:517X/
# 手機版：http://localhost:517X/?layout=mobile
```

## 待確認事項（非技術，行程規劃層面）

- V1 版本以 2025/26 季北陸新幹線、斑尾冬季巴士與雪票資訊估算，2026/27 正式班表、
  夜滑日期與新季票價公布後需再確認並更新 `mobile-narrations.ts` 與網頁版對應章節 narrations
- 雪具租借的實際尺寸與價目尚未確認，`MUST_KNOW` / `sp-must-know` 只寫「建議飯店現場租」，出發前需補實際租借費用

## 部署

已加入 `.github/workflows/deploy.yml` 的 GitHub Pages 部署管線（`VITE_BASE=/web-video/madarao/`），
push 到 `master` 會自動 build 並部署：
- 網頁版：`https://blackjtsai.github.io/web-video/madarao/`
- 手機版：`https://blackjtsai.github.io/web-video/madarao/?layout=mobile`

## 新增章節流程（網頁版）

1. 建 `src/chapters/<NN>-sp-<id>/narrations.ts` + `.tsx` + `.css`（id 與資料夾名稱都要帶 `sp-` 前綴，且不可與手機版既有 id 撞名）
2. 在 `src/registry/chapters.ts` 加 import + 陣列項目
3. 若章節有背景圖要出現在 `SPLIT_IMAGES`，於 `App.tsx` 補上對照
4. `npx tsc --noEmit`
5. `npm run extract-narrations`（跑 `extract-all-narrations.ts`，同時輸出網頁版+手機版）
6. `PRESENTATION_TTS=edge-tts npm run synthesize-audio`（只會合成新增/缺少的段落，既有段落自動 skip）
7. 若增刪 step 數，bump `useStepper.ts` 的 `STORAGE_KEY`

## 新增 SEGMENT 流程（手機版，未變動）

1. 在 `src/mobile-narrations.ts` 新增 `{ id, step, cardId, text }`
2. 在 `MobilePage.tsx` 的 `SEGMENTS` 陣列新增對應項目
3. 在 `CHAPTER_GROUPS` 確認 scrubber 章節對應
4. `npm run extract-narrations`（產生合併版 audio-segments.json）
5. `PRESENTATION_TTS=edge-tts npm run synthesize-audio`（合成新段音頻）
