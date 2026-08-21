# 系統藍圖 — 20270228志賀高原滑雪
> 最後更新：2026-08-17

## 章節登錄
| NN  | id               | CSS prefix | Steps | 簡述                       |
|-----|------------------|------------|-------|----------------------------|
| 01  | coldopen         | .co-       | 4     | 開場：6人・4天3夜・雪場串連 |
| 02  | nagano-overview  | .no-       | 4     | 長野雪場總覽：70+雪場・白馬／野澤溫泉／志賀高原三強比較（志賀高原壓軸） |
| 02  | day1             | .d1-       | 5     | 抵達・直奔志賀高原高天原・入住・詳細去程交通時間軸 |
| 03  | day2             | .d2-       | 4     | 高天原・中央區・東館山連滑  |
| 04  | day3             | .d3-       | 4     | 一之瀨→燒額山→奧志賀        |
| 05  | day4             | .d4-       | 3     | 機動滑雪日＋下山回程（3/3 全部，含詳細回程時間軸） |
| 06  | day5             | .d5-       | 1     | 歸途航班（3/4，僅飛機）     |
| 07  | must-know        | .mk-       | 7     | 出發前必知＋伴手禮＋參考預算＋雪道地圖 |

> 資料夾編號沿用 scaffold 舊命名（`02-nagano-overview` 與 `02-day1` 並存），
> 實際顯示順序以 `src/registry/chapters.ts` 陣列順序為準，非資料夾數字前綴。

**變更歷史**：
- 2026-08-16：原 day4（4 steps，涵蓋 3/3 機動滑雪＋3/3-3/4 下山＋3/4 航班）拆成
  day4（僅 3/3 機動滑雪）＋ day5（3/3 下山＋3/4 航班），must-know 資料夾同步改名 `06-must-know` → `07-must-know`。
- 2026-08-16：must-know 新增第 6 步「參考預算」總表（機票/住宿/交通/雪票/保險/餐費，資料來源 trip.json `budget` 欄位），
  網頁版與手機版（`mp-c-mk-budget` 卡片）同步呈現；STORAGE_KEY bump v3 → v4。
- 2026-08-16（二次調整）：發現「下山回程」時間軸實際都發生在 3/3 當天，不該掛在 3/4 的 day5 底下——
  把這段內容從 day5 移回 day4，day4 變成 2→3 steps，day5 精簡為 2→1 step。
  narrations 文字內容不變，音頻檔案用搬移／改名處理，未重新合成。STORAGE_KEY bump v4 → v5。
- 2026-08-16：拿掉 Day1 step2「約中午前抵達飯店，12:00–13:00 可以開始滑」的結論句（時間過於武斷）；
  step4 從「若當季開放，18:30 後夜滑」改為「租裝備・休息為主」，夜滑改成不確定語氣。
- 2026-08-16：Day1 補上完整去程交通時間軸（羽田出關→東京站→新幹線→長野→巴士→高天原），
  Day5（當時）補上完整回程時間軸；narrations 同步更新，相關 mp3 重新合成。
- 2026-08-16：志賀百樂酒店確認早晚餐都有訂到，所有「附早餐」文案（Day1 標籤、口播、SplitEnding、
  MobilePage 3 張住宿卡）改為「附早晚餐」，PDF 同步更新（見下方 PDF 版本記錄）。
- 2026-08-17：must-know 新增第 7 步「志賀高原全山雪道地圖」，展示官方 SHIGA KOGEN AREA MAP
  （高天原／中央區／東館山／寺小屋／一之瀨／燒額山／奧志賀全數涵蓋），STORAGE_KEY bump v5 → v6。
- 2026-08-17：**修正 `vite.config.ts` 缺少 `base` 設定的 bug**（scaffold 範本本身漏了這行，已回頭修正範本，
  見下方「特殊 hack」）；修正後才能正確部署到 GitHub Pages 子路徑。
- 2026-08-21：新增 3 份 IKYU 訂房確認 PDF（房間1/2/3，對應 6 人 3 間房）可下載——Day1 step3、
  MobilePage Day1 住宿卡、SplitEnding 住宿聯絡區塊皆加上「訂房確認・房間N」下載按鈕，
  檔案存於 `public/志賀百樂酒店訂房確認_房間{1,2,3}.pdf`（複製自 `doc/` 原始 IKYU PDF，未修改內容）。
  同時三處新增「怎麼去」搭車導航按鈕（Google Maps `dir` API，`travelmode=transit`，
  分別以長野站／湯田中站為起點指向 Shiga Park Hotel），取代原本只能查地點的 `?q=` 搜尋連結，
  方便使用者直接看到上車路線與下車後步行段。原始訂房 PDF（`doc/2027志賀百樂酒店...IY*.pdf`）
  保留於 doc/ 作為未編輯的原始存證。
- 2026-08-21（補）：發現手機版 MobilePage.tsx 一直沒有網頁版 SplitEnding.tsx 那組「地圖導航」
  8 個雪場／巴士站錨點（高天原巴士站・志賀百樂酒店・中央區東館山・寺小屋・一之瀨・燒額山・
  奧志賀高原・長野站），must-know 章節雪道地圖卡下方補上 `mp-c-mk-navmap` 卡片，MAPS 內容
  與 SplitEnding 完全同步（同一份 NAV_MAPS 資料，未來新增雪場地點記得兩處一起改）。

總步數：32 步（= narrations.ts 段數 = 音頻數量 = SEGMENTS 陣列長度，三者一致，已用 checkpoint 掃描驗證）

## 關鍵檔案
| 檔案（相對 src/） | 關鍵內容 |
|---|---|
| src/registry/chapters.ts | CHAPTERS 陣列，8 章節 |
| src/App.tsx | SPLIT_IMAGES（day1–day5，nagano-overview 不設圖=全螢幕章節；day5 重用 day4.jpg） |
| src/vite.config.ts | `base: process.env.VITE_BASE ?? "./"`（2026-08-17 補上，原本漏了這行） |
| src/hooks/useStepper.ts | STORAGE_KEY = "shiga-kogen-cursor-v6" |
| src/styles/tokens.css | 主題 alpine-frost（自建，非複製既有主題） |
| src/components/MobilePage.tsx | SEGMENTS 陣列（32 段）、無意見回饋 FAB；nagano 卡片順序 hakuba→nozawa→shiga（志賀高原壓軸）；`mp-c-mk-budget` 預算卡＋`mp-c-mk-map` 雪道地圖卡（點圖開新分頁看原圖）；day4 含 `mp-c-d4-transit` 下山回程卡（原掛在 day5）；3 張住宿卡皆為 `mp-meal-badge--bfdn`（附早晚餐） |
| src/components/SplitEnding.tsx | MAPS 陣列（高天原巴士站／志賀百樂酒店／各雪場）；PDF 下載連結指向 V4 |
| public/audio/<id>/<N>.mp3 | 口播音頻，32 段全數合成（day4/3.mp3 為下山回程文字，由拆分時的 day5/1.mp3 搬移而來；day5/1.mp3 現為航班文字，由舊 day5/2.mp3 改名而來；must-know/6.mp3 為預算段、must-know/7.mp3 為雪道地圖段，皆為新增） |
| public/images/hakuba.jpg・nozawa.jpg | 白馬山谷／野澤溫泉實景圖（Wikimedia Commons） |
| public/images/trail-map.jpg（2800px 寬）・public/images-mobile/trail-map.jpg（1800px 寬） | 志賀高原全山雪道地圖（官方 SHIGA KOGEN AREA MAP） |
| public/2027志賀高原滑雪行程_V1~V3.pdf | 行程手冊舊版，保留歷史記錄，不再被按鈕引用 |
| public/2027志賀高原滑雪行程_V4.pdf | 行程手冊現行版本，4 頁；Day4/Day5 拆分＋回程流程修正＋早晚餐已確認＋每人費用預算表；網頁版 SplitEnding.tsx 與手機版 MobilePage.tsx 下載按鈕皆指向此檔 |
| public/志賀百樂酒店訂房確認_房間{1,2,3}.pdf | IKYU 原始訂房確認書（2026-08-21 新增），未編輯內容；Day1 step3 / MobilePage Day1 住宿卡 / SplitEnding 住宿聯絡皆有下載按鈕 |

## 主題色（alpine-frost，自建）
- `--surface`: #f4f8fb（霧白雪面）
- `--accent`: #e8631c（雪場旗幟橙）
- `--text`: #16232e（深松藍黑）
- `--font-display-en`: Bebas Neue（英文數字）
- `--font-display-cn`: Noto Sans TC（中文顯示）
- 與既有仙台 midnight-ice（深夜藍）明確區隔，走白日雪原路線

## 圖片來源
全部取自 Wikimedia Commons / 官方公開資料（CC 授權或官方發佈供滑雪客使用），非佔位漸層：
- `cover.jpg` — Shiga-kogen_Ski-resort.jpg（2023，藍天全景，志賀高原雪場群鳥瞰）
- `day1.jpg` — Shiga_Kogen_Ski_Center_(JAP)_2007.jpg（雪場中心、飯店招牌，對應抵達入住氛圍）
- `day2.jpg` — Higashinishidateyama.JPG（藍天全景雪道，對應東館山/高天原）
- `day3.jpg` — Ichinose_(3364528859).jpg（遠山雪原，對應一之瀨路線）
- `day4.jpg` — Yokoteyama_Ski_Area.jpg（纜車＋群山全景，對應機動滑雪＋歸途）
- `hakuba.jpg` — Hakuba_Happo-one_Winter_Resort.JPG（白馬八方尾根滑雪場，對應長野雪場總覽章節）
- `nozawa.jpg` — Nozawa_Onsen_01.jpg（野澤溫泉滑雪場，對應長野雪場總覽章節）
- `trail-map.jpg` — 志賀高原スキー場協会官方「SHIGA KOGEN AREA MAP」全山雪道地圖，
  來源 https://shigakogen-ski.or.jp/assets/pdf/shigakogen_map_jp.pdf （PDF 原圖 3368×2382，
  網頁版裁切 2800px 寬 / 手機版 1800px 寬皆保留原圖浮水印與版權標示，未裁切修改），
  對應 must-know 第 7 步「雪道地圖」；涵蓋本次行程全部雪場分區
  （高天原・中央區・東館山・寺小屋・一之瀨・燒額山・奧志賀）
- OG 分享圖 `og.jpg`：由 cover.jpg 裁切為 1200×625 橫幅

## 特殊 hack
- 無 split.css 修正需求（各章節無自帶背景圖，SplitLayout 右側圖片來自 SPLIT_IMAGES，無重複衝突）
- 手機版 Hero / Day 封面採「等比例（height: auto）」而非 100dvh 滿版，依 memory
  `feedback-mobile-fullscreen-scrolllock.md` 與北海道專案最新做法，非 MOBILE-CRAFT.md 舊版 100dvh 規範
- 意見回饋 FAB（Formspree）本次依指示跳過，未實作
- `SplitLayout.tsx` / `split.css` 上一版 agent scaffold 時漏建，導致 `?layout=split` 500 error，
  已手動照抄仙台/澎湖版本補回（split.css 改用霧白雪面漸層 `#eef4f9 → #8aabc4`）。
  **每次新增/修改章節後務必重新確認這兩個檔案還在、`?layout=split` 沒有壞掉。**
- `.mp-tag-inline` 為手機版共用的小標籤 class（也用於「台灣虎航」等一般標籤），
  「本次行程」標籤改用疊加的 `.mp-tag-inline--accent` 修飾類別（accent 橙底白字加粗），
  不直接改動 `.mp-tag-inline` 本身以免影響其他用途的標籤。
- **reportlab 產生繁中 PDF，UnicodeCIDFont('MSung-Light') 文字萃取會亂碼**（畫面可能看起來也不對，
  pdfplumber 抓出的文字是亂碼方塊字），改用系統內建 TTFont（如 `/System/Library/Fonts/STHeiti Light.ttc` /
  `STHeiti Medium.ttc`，`subfontIndex=0`）註冊字型即可正常。往後任何專案要用 reportlab 產繁中 PDF，
  優先用系統 TTF 字型，不要用 reportlab 內建的 CID 字型代稱。（見 memory `feedback-reportlab-cjk-font.md`）
- **`vite.config.ts` scaffold 範本曾漏掉 `base: process.env.VITE_BASE ?? "./"`**，導致本機 dev 正常但
  `VITE_BASE=/web-video/{slug}/ npm run build` 後 `dist/index.html` 的 assets 路徑是絕對根路徑 `/assets/...`
  而非 `/web-video/{slug}/assets/...`，部署到 GitHub Pages 後資源全部 404、頁面空白。
  已修正本專案的 `vite.config.ts`，也已回頭修正共用範本 `~/.claude/skills/web-video-presentation/templates/vite.config.ts`，
  避免未來新專案再踩到。發佈前務必用帶 `VITE_BASE` 的正式 build 驗證 assets 路徑前綴。
  （見 memory `feedback-vite-base-scaffold-bug.md`，CLAUDE.md 已新增「GitHub Pages 部署規則」段落）

## TTS 狀態
Provider: edge-tts　Voice: zh-TW-HsiaoChenNeural
已合成：32 / 32 段（全數完成；audio-segments.json 與 mp3 檔案數一致）

## 部署狀態
- **已發佈 GitHub Pages**（2026-08-17），slug: `shiga-kogen`
- 公開網址：
  - 網頁版：https://blackjtsai.github.io/web-video/shiga-kogen/
  - 手機版：https://blackjtsai.github.io/web-video/shiga-kogen/?layout=mobile
- 部署管線：`.github/workflows/deploy.yml`（push to master 自動觸發），
  build 指令 `VITE_BASE=/web-video/shiga-kogen/ npm run build`
- 根目錄 `index.html` 總覽頁已加入對應卡片
- 已用 Playwright 實際載入驗證（無 404、封面圖與雪道地圖卡片正常渲染）

## 交付網址（本機開發，port 隨開發環境浮動，以實際 dev server 輸出為準）
- 網頁版：http://localhost:5175/
- 手機版：http://localhost:5175/?layout=mobile
- 網頁版（split）：http://localhost:5175/?layout=split
