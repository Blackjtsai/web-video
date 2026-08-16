# 系統藍圖 — 20270228志賀高原滑雪
> 最後更新：2026-08-16

## 章節登錄
| NN  | id               | CSS prefix | Steps | 簡述                       |
|-----|------------------|------------|-------|----------------------------|
| 01  | coldopen         | .co-       | 4     | 開場：6人・4天3夜・雪場串連 |
| 02  | nagano-overview  | .no-       | 4     | 長野雪場總覽：70+雪場・白馬／野澤溫泉／志賀高原三強比較（志賀高原壓軸） |
| 02  | day1             | .d1-       | 5     | 抵達・直奔高天原・入住      |
| 03  | day2             | .d2-       | 4     | 高天原・中央區・東館山連滑  |
| 04  | day3             | .d3-       | 4     | 一之瀨→燒額山→奧志賀        |
| 05  | day4             | .d4-       | 3     | 機動滑雪日＋下山回程（3/3全部） |
| 06  | day5             | .d5-       | 1     | 歸途航班（3/4，僅飛機）     |
| 07  | must-know        | .mk-       | 7     | 出發前必知＋伴手禮＋參考預算＋雪道地圖 |

> 資料夾編號沿用 scaffold 舊命名（`02-nagano-overview` 與 `02-day1` 並存），
> 實際顯示順序以 `src/registry/chapters.ts` 陣列順序為準，非資料夾數字前綴。
> 2026-08-16：原 day4（4 steps，涵蓋 3/3 機動滑雪＋3/3-3/4 下山＋3/4 航班）拆成
> day4（2 steps，僅 3/3 機動滑雪）＋ day5（2 steps，3/3 下山＋3/4 航班），must-know 資料夾同步改名 `06-must-know` → `07-must-know`。
> 2026-08-16：must-know 新增第 6 步「參考預算」總表（機票/住宿/交通/雪票/保險/餐費，資料來源 trip.json `budget` 欄位），
> 網頁版與手機版（`mp-c-mk-budget` 卡片）同步呈現；STORAGE_KEY 因步數變動 bump v3 → v4。
> 2026-08-16（二次調整）：發現「下山回程」時間軸（拿行李→離開飯店→巴士下山→新幹線→抵達羽田）
> 實際都發生在 3/3 當天，不該掛在 3/4 的 day5 底下——把這段內容從 day5 移回 day4，
> day4 變成 2→3 steps（自由滑雪／收板／下山回程），day5 精簡為 2→1 step（僅回程航班）。
> narrations 文字內容不變，只是章節歸屬調整，音頻檔案用搬移／改名處理，未重新合成。
> STORAGE_KEY bump v4 → v5（章節內 cardId 對應改變，避免舊 cursor 錯位）。

總步數：32 步（= narrations.ts 段數 = 音頻數量，三者一致；must-know 6→6 步後總步數 30 → 31，day4/day5 內部重分配不影響總數）
> 2026-08-17：must-know 新增第 7 步「志賀高原全山雪道地圖」，展示官方 SHIGA KOGEN AREA MAP
> （高天原／中央區／東館山／寺小屋／一之瀨／燒額山／奧志賀全數涵蓋），STORAGE_KEY bump v5 → v6，
> 總步數 31 → 32；只新增 must-know/7.mp3 一段音頻（edge-tts，其餘 31 段沿用未重合成）。

## 關鍵檔案
| 檔案（相對 src/） | 關鍵內容 |
|---|---|
| src/registry/chapters.ts | CHAPTERS 陣列，8 章節 |
| src/App.tsx | SPLIT_IMAGES（day1–day5，nagano-overview 不設圖=全螢幕章節；day5 重用 day4.jpg） |
| src/hooks/useStepper.ts | STORAGE_KEY = "shiga-kogen-cursor-v6" |
| src/styles/tokens.css | 主題 alpine-frost（自建，非複製既有主題） |
| src/components/MobilePage.tsx | SEGMENTS 陣列（32 段）、無意見回饋 FAB；nagano 卡片順序 hakuba→nozawa→shiga（志賀高原壓軸）；末段新增 `mp-c-mk-budget` 預算卡＋ `mp-c-mk-map` 雪道地圖卡（點圖開新分頁看原圖）；day4 含 `mp-c-d4-transit` 下山回程卡（原掛在 day5） |
| src/components/SplitEnding.tsx | MAPS 陣列（高天原巴士站／志賀百樂酒店／各雪場）；PDF 下載連結已改指向 V3 |
| public/audio/<id>/<N>.mp3 | 口播音頻，31 段全數合成（day4/3.mp3 為下山回程文字，由拆分時的 day5/1.mp3 搬移而來，文字未變不需重新合成；day5/1.mp3 現為航班文字，由舊 day5/2.mp3 改名而來；must-know/6.mp3 為本次新增） |
| public/images/hakuba.jpg・nozawa.jpg | 白馬山谷／野澤溫泉實景圖（Wikimedia Commons） |
| public/images/trail-map.jpg（2800px 寬）・public/images-mobile/trail-map.jpg（1800px 寬） | 志賀高原全山雪道地圖（官方 SHIGA KOGEN AREA MAP，來源見下方「圖片來源」） |
| public/2027志賀高原滑雪行程_V1.pdf | 行程手冊下載（舊版，保留歷史記錄，不再被按鈕引用） |
| public/2027志賀高原滑雪行程_V2.pdf | 行程手冊下載（舊版，保留歷史記錄，不再被按鈕引用；3/3-3/4 已拆兩列但下山回程仍誤掛在 3/4） |
| public/2027志賀高原滑雪行程_V3.pdf | 行程手冊下載（舊版，保留歷史記錄；修正下山回程流程全部歸在 3/3、3/4 僅剩航班；用 reportlab + 系統字型 STHeiti 產生） |
| public/2027志賀高原滑雪行程_V4.pdf | 行程手冊下載（現行版本，4 頁；志賀百樂酒店早晚餐已確認訂到，餐食/預算/待確認事項同步更新；網頁版 SplitEnding.tsx 與手機版 MobilePage.tsx 下載按鈕皆指向此檔） |

## 主題色（alpine-frost，自建）
- `--surface`: #f4f8fb（霧白雪面）
- `--accent`: #e8631c（雪場旗幟橙）
- `--text`: #16232e（深松藍黑）
- `--font-display-en`: Bebas Neue（英文數字）
- `--font-display-cn`: Noto Sans TC（中文顯示）
- 與既有仙台 midnight-ice（深夜藍）明確區隔，走白日雪原路線

## 圖片來源
全部取自 Wikimedia Commons（CC 授權公開素材），非佔位漸層：
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
  優先用系統 TTF 字型，不要用 reportlab 內建的 CID 字型代稱。

## TTS 狀態
Provider: edge-tts　Voice: zh-TW-HsiaoChenNeural
已合成：32 / 32 段（全數完成；2026-08-16 day4 拆分為 day4+day5 時，
day4 舊 3/4.mp3 文字未變，直接搬移為 day5 1/2.mp3，未重新合成；
2026-08-17 新增 must-know/7.mp3「雪道地圖」口播）

## 交付網址（本機開發，port 隨開發環境浮動，以實際 dev server 輸出為準）
- 網頁版：http://localhost:5175/
- 手機版：http://localhost:5175/?layout=mobile
- 網頁版（split）：http://localhost:5175/?layout=split
