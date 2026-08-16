# 系統藍圖 — 20261220仙台
> 最後更新：2026-08-17（新增 TrailMap 滑道地圖元件；手機版精簡出發前必知重複區塊；修正 Day2 晚餐重複圖片）

## 章節登錄

| NN  | id        | CSS prefix | Steps | 標題                              |
|-----|-----------|------------|-------|-----------------------------------|
| 01  | coldopen  | `.co-`     |   4   | 開場：五位型男，東北雪季自駕       |
| 02  | day1      | `.d1-`     |   4   | Day 1：抵達仙台・直奔藏王          |
| 03  | day2      | `.d2-`     |   5   | Day 2：藏王溫泉滑雪場・熟悉日      |
| 04  | day3      | `.d3-`     |   5   | Day 3：制霸藏王大雪場・溫泉名湯    |
| 05  | day4      | `.d4-`     |   5   | Day 4：告別藏王・仙台泉夜滑        |
| 06  | day5      | `.d5-`     |   4   | Day 5：聖誕夜返台・圓滿落幕        |
| 07  | must-know | `.mk-`     |   5   | 出發前必知・雪地自駕攻略           |

**總步數：32 步 = narrations.ts 段數 = 音頻數量（三者必須一致）**

## 關鍵檔案

| 檔案（相對 src/）                            | 關鍵內容                                                        |
|---------------------------------------------|-----------------------------------------------------------------|
| `src/registry/chapters.ts`                  | CHAPTERS 陣列，章節順序唯一真相源                               |
| `src/App.tsx:20`                            | SPLIT_IMAGES（day1–day5 有 split；coldopen/must-know 走 `.scene`）|
| `src/App.tsx:29`                            | `isMobileMode = params.get("layout") === "mobile"`              |
| `src/hooks/useStepper.ts:8`                 | `STORAGE_KEY = "presentation-cursor-v2-sendai"`（新增章節要 bump）|
| `src/styles/tokens.css`                     | 主題色 midnight-ice                                             |
| `src/styles/split.css`                      | split layout + 左側雪山漸層 placeholder                         |
| `src/components/MobilePage.tsx:22`          | `SEGMENTS` 陣列（32 段，TTS 播放 + scrollIntoView 唯一真相源）   |
| `src/components/SplitEnding.tsx`            | 結尾資源面板（PDF 下載）                                        |
| `src/components/TrailMap.tsx` / `.css`      | 滑道地圖縮圖 + 點擊全螢幕燈箱元件（見下方專節）                 |
| `public/audio/<chapter-id>/<N>.mp3`         | 口播音頻（共 32 段）                                            |
| `public/images/spots/`                      | 17 張景點圖 + 2 張官方滑道地圖（見下方圖片清單）                |

## 圖片清單（public/images/spots/）

```
beef-tongue.jpg      eboshi.jpg           genghis-khan.jpg
hotel-metropolitan.jpg  izakaya.jpg       outlet.jpg
ramen.jpg            sendai-airport.jpg   sendai-beef.jpg
snow-road.jpg        souvenirs.jpg        spring-valley.jpg
sukiyaki.jpg         zao-onsen.jpg        zao.jpg
zao-trail-map.jpg    spring-valley-trail-map.png
```

手機版 `<img src="images/spots/xxx.jpg">` 用相對路徑（不加 `import.meta.env.BASE_URL`）。
桌面版 ColdOpen CSS 背景圖用 `var(--co-bg-image)` inline style + `${base}images/spots/zao.jpg`。

`izakaya.jpg` 專供 Day2 晚餐卡使用，`zao-onsen.jpg` 專供泡湯卡使用——
兩者原本共用同一張照片、在手機版相鄰顯示很突兀，2026-08-17 拆開。

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

## 手機版 Must-Know 卡片結構（2026-08-17 精簡重寫）

原本 must-know 章節有 3 張雪場卡 + 4 張美食卡，內容跟 Day2–4 的專屬卡片幾乎逐字重複
（同張照片、同樣的統計數字），使用者滑到這裡會覺得「跟上面看過的一樣」。已砍成 2 張：

- `mp-c-mk-ski`：一張「滑雪場實用資訊」卡，濃縮 narrations.ts step4 的文字重點，
  底下放兩個 `<TrailMap>` 縮圖（藏王 + Spring Valley），不重複 Day2/3/4 的照片與統計格。
- `mp-c-mk-food`：一張「東北美食清單」卡，濃縮 narrations.ts step5 文字，
  不重複各 Day 晚餐卡的照片。

⚠️ `id="mp-c-mk-ski"` 和 `id="mp-c-mk-food"` 必須保留，
供 SEGMENTS 音頻 scroll sync 使用（step 4 / step 5）——就算之後想再精簡文案，
這兩個 id 不能拿掉，否則 audio 播放時該段不會自動捲動。

## TrailMap 滑道地圖元件（2026-08-17 新增）

`src/components/TrailMap.tsx` — 傳入 `src` + `label`，渲染一個縮圖按鈕，
點擊後彈出可點擊背景關閉的全螢幕燈箱（放大看滑道細節）。桌面版用在
Day2 step1 / Day3 step1（藏王）、Day4 step2（Spring Valley）；手機版用在
must-know 的「滑雪場實用資訊」卡。

**⚠️ 燈箱必須用 `createPortal(..., document.body)`，不能直接在卡片內 render。**

原因：桌面版卡片（如 `.d2-eboshi`）的進場動畫用 `transform: translateX(...)`，
即使動畫結束停在 `translateX(0)`，該元素仍然「有 transform 屬性值」，
會依 CSS 規範對子孫的 `position: fixed` 元素建立新的 containing block——
導致燈箱被限制在卡片的框內顯示，蓋不滿全螢幕。手機版的長捲動頁面同樣適用同一顆
`TrailMap` 元件，portal 到 `document.body` 才能保證兩種版型都正確蓋滿視窗。

驗證方式：headless screenshot 對這種 portal+fixed 疊層有時會有渲染假象
（screenshot 看起來没蓋滿，但實際元素已經蓋滿），**要用 `elementFromPoint` 或
實際點擊測試確認，不要只看 screenshot 判斷。**

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

目前為 `v2-sendai`。章節 step 數有異動時務必 bump（參考 `useStepper.ts:8`）。

### 住宿結構（2026-08-16 起）

- Day1–3（12/20–23）：**オーベルジュ樹氷 Auberge Juhyo**，連住 3 晚，藏王溫泉現地・滑雪場旁。不進仙台市區、不用每天往返開車。
- Day4（12/23–24）：仙台國分町大露台酒店 Hotel Grand Terrace Sendai Kokubuncho（未變動）。
- 共 2 個住宿地點（原本 3 個：The OneFive Sendai / 山形大飯店 / 仙台國分町，已合併簡化）。

## TTS 狀態

| 項目 | 值 |
|------|----|
| Provider | edge-tts |
| Voice | `zh-TW-HsiaoChenNeural` |
| 已合成 | 32 / 32 段 |
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
8. Bump `STORAGE_KEY`（`v2-sendai` → `v3-sendai`）
