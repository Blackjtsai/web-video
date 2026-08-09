# 20261220 仙台五日遊

## 專案狀態

**已完成** — 7 章 34 步全部實作，音頻合成完畢。

| 章節 | 標題 | Steps | CSS prefix |
|---|---|---|---|
| coldopen | 開場：四位型男，東北雪季自駕 | 4 | `.co-` |
| day1 | Day 1：抵達仙台・牛舌初夜 | 5 | `.d1-` |
| day2 | Day 2：Eboshi 衝鋒・翻越山脈・山形市區 | 6 | `.d2-` |
| day3 | Day 3：制霸藏王大雪場・溫泉名湯 | 5 | `.d3-` |
| day4 | Day 4：重返仙台・Spring Valley 夜滑 | 5 | `.d4-` |
| day5 | Day 5：聖誕夜・採購返台 | 4 | `.d5-` |
| must-know | 出發前必知・雪地自駕攻略 | 5 | `.mk-` |

## 常用指令

```bash
cd site/20261220仙台/src
npm install
npm run dev

npx tsc --noEmit
npm run extract-narrations
PRESENTATION_TTS=edge-tts npm run synthesize-audio
```

## 版本網址

| 版本 | 網址 |
|---|---|
| 網頁版 | `http://localhost:5174/` |
| 手機版 | `http://localhost:5174/?layout=mobile` |

## 主題色：midnight-ice（深夜雪山）

- `--surface: #0d1b2a`（深夜藍）
- `--accent: #4fc3f7`（冰晶藍）
- `--text: #e8f4fd`（雪白）

## 行程要點（2026-08-09 依 PDF 確認更新）

- **成員**：4 人；**航班**：台灣虎航 IT254（12/20 14:35 TPE→18:45 SDJ）／ IT255（12/24 19:40 SDJ→23:00 TPE）
- **車型**：7–8 人座休旅（Alphard/Vellfire/Delica），4 人 4 套雪具
- **住宿（已確認）**：Day1 The OneFive Sendai ¥20,640｜Day2–3 山形大飯店（山形市區）¥62,856｜Day4 仙台國分町大露台酒店 ¥23,600
- **住宿變動連動**：Day2–3 改住山形市區（非藏王溫泉），Day3 需開車約 30 分往返藏王溫泉滑雪場（原「不用開車」已修正）；Day2 晚餐改山形市區米澤牛燒肉，藏王硫磺泉體驗移至 Day3 滑雪後溫泉街公共浴場

## 素材備注

左側 split-left 圖片（day1~5.jpg）已放入 `src/public/images/`，
原 outline 標記「缺少」為舊記錄，實際已補齊。
