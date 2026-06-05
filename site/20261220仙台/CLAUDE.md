# 20261220 仙台五日遊

## 專案狀態

**已完成** — 7 章 34 步全部實作，音頻合成完畢。

| 章節 | 標題 | Steps | CSS prefix |
|---|---|---|---|
| coldopen | 開場：三位型男，東北雪季自駕 | 4 | `.co-` |
| day1 | Day 1：抵達仙台・牛舌初夜 | 5 | `.d1-` |
| day2 | Day 2：Eboshi 衝鋒・翻越山脈・藏王溫泉 | 6 | `.d2-` |
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

## 素材備注

左側 split-left 圖片（day1~5.jpg）已放入 `src/public/images/`，
原 outline 標記「缺少」為舊記錄，實際已補齊。
