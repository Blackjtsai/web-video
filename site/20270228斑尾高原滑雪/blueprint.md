# 系統藍圖 — 2027 斑尾高原四日滑雪
> 最後更新：2026-08-19

## 架構說明

此專案為**純手機版**旅遊攻略，無網頁版 stepper/章節架構。
主要入口：`src/src/components/MobilePage.tsx`（單一長頁）

**Hero / Day 封面照片**：本行程原始素材僅有一份 PDF、無使用者提供的實景照，
改用 Wikimedia Commons（CC BY-SA）的斑尾高原、Tangram 雪場實景照，`sips -Z 1400`
壓縮後放 `public/images-mobile/`（hero.jpg / day1~4.jpg），CSS 漸層 `mp-grad--*`
retained 作為圖片載入前的底色與文字對比遮罩（`.mp-cover-scrim`），非唯一背景。

## SEGMENTS（語音導讀段數）

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

**總 SEGMENTS：12 段 = mobile-narrations.ts 段數 = 音頻數量（三者一致 ✓）**

## 內容結構

- **DAYS**：4 天陣列，含 tag / date / gradientClass / time / focus
- **BUDGET_ITEMS**：每人預算明細（機票／住宿／交通／雪票／保險／餐費／雪具）
- **MUST_KNOW**：6 項出發前必知（虎航行李、雪具租借、保險、V1 班表提醒、日幣現金、交通卡）
  —— 這份行程 PDF 沒有專門的「必知」段落，內容為根據行程內容整理的合理提醒
- **雪具**：飯店（Hotel Madam Mirei）現場可租，比自行攜帶搭機更便宜也省事（2026-08-19 使用者確認補上），
  `BUDGET_ITEMS` / `MUST_KNOW` / narrations 三處已同步更新，不再寫「NT$0 自備」

## 關鍵檔案

| 檔案（相對 src/）                            | 關鍵內容                                        |
|-----------------------------------------------|--------------------------------------------------|
| `src/components/MobilePage.tsx`               | DAYS、BUDGET_ITEMS、MUST_KNOW、SEGMENTS（12段）、CHAPTER_GROUPS、MobileAudioFab、scroll lock |
| `src/components/MobilePage.css`               | 雪夜漸層色塊（mp-grad--*）、深色卡片樣式          |
| `src/mobile-narrations.ts`                    | 12 段語音稿（唯一真相源）                        |
| `src/styles/tokens.css`                       | 主題色 token（madarao-snow，沿用仙台 midnight-ice 色階） |
| `src/scripts/extract-mobile-narrations.ts`    | 產生 audio-segments.json（非章節版）             |
| `scripts/tts-providers/edge-tts.sh`           | TTS provider（從新疆專案複製）                    |
| `public/audio/`                               | 12 段 mp3（按 id/step 命名）                     |
| `public/2027斑尾高原滑雪行程_V1.pdf`          | 原始 PDF，供手機版下載按鈕使用                    |
| `public/images-mobile/`                       | Hero + Day1~4 實景照（Wikimedia Commons CC BY-SA，sips 壓至 1400px） |

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

- **純手機版**：無 stepper、無 STORAGE_KEY；`registry/chapters.ts` 的 `CHAPTERS` 陣列保持空陣列（不引用任何 `chapters/` 章節目錄），`01-example` 死檔已用 `find -delete` 清除（`rm -rf` 被沙盒權限擋下，改用 `find ... -delete` 繞過）
- **實景照封面**：Hero 與 4 個 Day section 用 `<img className="mp-cover-img">` 疊加 `.mp-cover-scrim` 深色遮罩維持文字對比，`.mp-grad--*` 五種漸層 class 保留作為圖片載入前的底色
- **交通時刻表卡片**：新增 `.mp-transit-list` / `.mp-transit-row` 元件樣式，取代景點卡（因為本行程無景點介紹，重點在去回程交通時刻）
- **預算明細表**：新增 `.mp-budget-list` / `.mp-budget-row` 樣式，深色卡片 + 冰藍數字
- **scroll lock**：沿用標準 touchmove ref 做法，勿用透明 overlay
- **TTS pipeline**：`extract-mobile-narrations.ts` → `audio-segments.json`（非 `extract-narrations.ts`），`package.json` 的 `extract-narrations` script 已指向此檔
- **PDF 下載**：`public/2027斑尾高原滑雪行程_V1.pdf`，Footer 區塊下載按鈕

## TTS 狀態

| 項目        | 值                                          |
|-------------|----------------------------------------------|
| Provider    | edge-tts                                    |
| Voice       | `zh-TW-HsiaoChenNeural`                    |
| 已合成      | 12 / 12 段 ✓                               |
| 合成指令    | `cd site/20270228斑尾高原滑雪/src && PRESENTATION_TTS=edge-tts npm run synthesize-audio` |

## 啟動指令

```bash
cd site/20270228斑尾高原滑雪/src
npm run dev
# 手機版：http://localhost:5174/?layout=mobile
```

## 待確認事項（非技術，行程規劃層面）

- V1 版本以 2025/26 季北陸新幹線、斑尾冬季巴士與雪票資訊估算，2026/27 正式班表、
  夜滑日期與新季票價公布後需再確認並更新 `mobile-narrations.ts` 對應段落
- 雪具租借的實際尺寸與價目尚未確認，`MUST_KNOW` 只寫「建議飯店現場租」，出發前需補實際租借費用

## 部署

已加入 `.github/workflows/deploy.yml` 的 GitHub Pages 部署管線（`VITE_BASE=/web-video/madarao/`），
push 到 `master` 會自動 build 並部署到 `https://blackjtsai.github.io/web-video/madarao/?layout=mobile`。

## 新增 SEGMENT 流程

1. 在 `src/mobile-narrations.ts` 新增 `{ id, step, cardId, text }`
2. 在 `MobilePage.tsx` 的 `SEGMENTS` 陣列新增對應項目
3. 在 `CHAPTER_GROUPS` 確認 scrubber 章節對應
4. `npm run extract-narrations`（產生 audio-segments.json）
5. `PRESENTATION_TTS=edge-tts npm run synthesize-audio`（合成新段音頻）
