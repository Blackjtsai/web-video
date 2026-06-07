# 20261006 北海道八日遊

## 專案狀態

**進行中** — 10 章 41 步全部實作，**TTS 尚未合成**。

| 章節 | 標題 | Steps | CSS prefix |
|---|---|---|---|
| coldopen  | 開場：六人，秋日北海道見            | 4 | `.co-` |
| day1      | Day 1：順利抵達，札幌市區慢活       | 4 | `.d1-` |
| day2      | Day 2：白色戀人 & T38 璀璨夜景      | 4 | `.d2-` |
| day3      | Day 3：美玲指定！海鮮市場 & 定山溪  | 4 | `.d3-` |
| day4      | Day 4：螃蟹大宴 & 洞爺湖花火        | 5 | `.d4-` |
| day5      | Day 5：網美牧場 & 二世谷神仙沼      | 4 | `.d5-` |
| day6      | Day 6：積丹海岸自駕 & Glow 和牛 BBQ | 4 | `.d6-` |
| day7      | Day 7：小樽運河遊船 & 和牛慶功宴    | 4 | `.d7-` |
| day8      | Day 8：新千歲大補貨 & 快樂賦歸      | 3 | `.d8-` |
| must-know | 出發前必知 & 北海道名產攻略         | 5 | `.mk-` |

## 常用指令

```bash
cd site/20261006北海道八日遊/src
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

## 主題色：楓葉秋光

- `--surface: #f5ece0`（暖米色）
- `--accent: #bf4400`（楓葉橙紅）
- `--text: #2a1a0e`（深棕）

## 手機版特性

- Hero + 每日封面圖：`height: 100dvh`（滿版） + 底部漸層 overlay
- 播放時啟用 scroll lock（`position: fixed` 透明遮罩，z-index: 50）
- 點遮罩或暫停 → 解鎖手動捲動
- 詳細架構見 `blueprint.md`
