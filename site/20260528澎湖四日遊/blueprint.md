# 系統藍圖 — 20260528澎湖四日遊
> 最後更新：2026-05-29

## 章節登錄

| NN  | id        | CSS prefix | Steps | 標題                        |
|-----|-----------|------------|-------|-----------------------------|
| 01  | coldopen  | `.co-`     |   4   | 開場：九個人，澎湖見         |
| 02  | day1      | `.d1-`     |   6   | Day 1：花火慶典日            |
| 03  | day2      | `.d2-`     |   6   | Day 2：員貝島嶼遊 & 水族館   |
| 04  | day3      | `.d3-`     |   5   | Day 3：西嶼探秘 & 晶翔號夜釣 |
| 05  | day4      | `.d4-`     |   4   | Day 4：市區巡禮，圓滿賦歸    |
| 06  | must-know | `.mk-`     |   6   | 出發前必知 & 伴手禮攻略      |

**總步數：31 步 = narrations.ts 段數 = 音頻數量（三者必須一致）**

## 關鍵檔案

| 檔案（相對 src/）                            | 關鍵內容                                          |
|---------------------------------------------|---------------------------------------------------|
| `src/registry/chapters.ts`                  | CHAPTERS 陣列，章節順序唯一真相源                  |
| `src/App.tsx:20`                            | SPLIT_IMAGES 對照（day1–day4 有圖；coldopen/must-know 無） |
| `src/App.tsx:28`                            | `isMobileMode = params.get("layout") === "mobile"` |
| `src/hooks/useStepper.ts:8`                 | `STORAGE_KEY = "v5"`（新增章節要 bump）；localStorage 已停用，刷新從頭 |
| `src/styles/tokens.css`                     | 主題色 token（藍天白雲）                           |
| `src/styles/split.css`                      | 網頁版右側 panel 修正（見下方特殊 hack）            |
| `src/components/MobilePage.tsx:23`          | `SEGMENTS` 陣列（31 段，TTS 播放 + scrollIntoView 的唯一真相源） |
| `src/components/SplitEnding.tsx:18`         | `MAPS` 陣列（7 個地圖連結）                        |
| `public/audio/<chapter-id>/<N>.mp3`         | 口播音頻（共 31 段）                               |

## 主題色（藍天白雲）

```css
--shell:        #b8d8f0;   /* 地平線天藍（畫面外框） */
--surface:      #f0f8ff;   /* 雲白（主背景） */
--accent:       #1e8fcc;   /* 海洋藍（強調色） */
--text:         #1a3858;   /* 深海海軍藍（主文字） */
--text-mute:    #5a82a0;   /* 次要文字 */
--rule:         #7abce8;   /* 天際線藍（分隔線） */
```

## 特殊 hack（split.css 踩坑記錄）

章節若自帶全螢幕背景圖，在右側 960px 面板會重複，必須隱藏：

```css
/* day1 煙火背景 */
.split-right .d1-fw-bg     { display: none !important; }

/* day4 機場背景 */
.split-right .d4-airport-bg      { display: none !important; }
.split-right .d4-airport-overlay { display: none !important; }

/* day2 / day3 / day4 右側裝飾元素 */
.split-right .d2-open-right  { display: none; }
.split-right .d3-market-right { display: none; }
.split-right .d4-open-right { display: none; }
```

其他：
- `MobilePage.css`：`.mp-root { padding-bottom: 0 }`（底部留白由最後元素自管，否則多出大段空白）
- `ProgressBar` 必須傳 `githubUrl={null}`（否則 hover 進度條時出現範本作者 GitHub 圖示）
- Stage 改用純 CSS aspect-ratio（`min(100vw, 100vh*16/9)`），無 JS transform scale
- 字體全用 `clamp()`，不寫死 px

## TTS 狀態

| 項目 | 值 |
|------|-----|
| Provider | edge-tts |
| Voice | `zh-TW-HsiaoChenNeural` |
| 已合成 | 31 / 31 段 |
| 合成指令 | `cd src && PRESENTATION_TTS=edge-tts npm run synthesize-audio` |

## 啟動指令

```bash
cd site/20260528澎湖四日遊/src
npm run dev
# 網頁版：http://localhost:5173/web-video/
# 手機版：http://localhost:5173/web-video/?layout=mobile
```
