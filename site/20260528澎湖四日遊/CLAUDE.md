# 20260528 澎湖四日遊

## 專案狀態

**已完成** — 6 章 31 步全部實作，音頻合成完畢。

| 章節 | 標題 | Steps | CSS prefix |
|---|---|---|---|
| coldopen | 開場：九個人，澎湖見 | 4 | `.co-` |
| day1 | Day 1：花火慶典日 | 6 | `.d1-` |
| day2 | Day 2：員貝島嶼遊 & 水族館 | 6 | `.d2-` |
| day3 | Day 3：西嶼探秘 & 晶翔號夜釣 | 5 | `.d3-` |
| day4 | Day 4：市區巡禮，圓滿賦歸 | 4 | `.d4-` |
| must-know | 出發前必知 & 伴手禮攻略 | 6 | `.mk-` |

## 常用指令

```bash
cd site/20260528澎湖四日遊/src
npm install
npm run dev

npx tsc --noEmit
npm run extract-narrations
PRESENTATION_TTS=edge-tts npm run synthesize-audio
```

## 版本網址

| 版本 | 網址 |
|---|---|
| 網頁版 | `http://localhost:5173/` |
| 手機版 | `http://localhost:5173/?layout=mobile` |

## 主題色：藍天白雲

- `--surface: #f0f8ff`（雲白）
- `--accent: #1e8fcc`（海洋藍）
- `--text: #1a3858`（深海深藍）
