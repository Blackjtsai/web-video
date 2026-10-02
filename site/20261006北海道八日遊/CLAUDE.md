# 20261006 北海道八日遊

## 專案狀態

**進行中** — 10 章 41 步，內容已依 2026-10-02 最新版 PDF 重做，**TTS 41 段已重新合成**。

⚠️ 每日英雄圖 `day1–8.jpg` 已換成 `doc/new-2026-10-02-v2/`＋`v3/` 的最新 PNG（2026-10-02），行程與網站一致。圖文已一致，無已知殘留差異。Day 5 晚餐＝札幌らーめん 大心 ニセコ店（使用者確認）；Day 6 晚餐彈性安排（已移除舊 BBQ 內容）。

| 章節 | 標題 | Steps | CSS prefix |
|---|---|---|---|
| coldopen  | 開場：六人，秋日北海道見            | 4 | `.co-` |
| day1      | Day 1：順利抵達，札幌市區慢活       | 4 | `.d1-` |
| day2      | Day 2：札幌市區慢遊 & 藻岩山夜景      | 4 | `.d2-` |
| day3      | Day 3：札幌經典景點 & 白色戀人公園  | 4 | `.d3-` |
| day4      | Day 4：取車自駕 & 洞爺湖萬世閣        | 5 | `.d4-` |
| day5      | Day 5：有珠山纜車 & 二世谷神仙沼      | 4 | `.d5-` |
| day6      | Day 6：積丹・余市 & Glow 別墅 | 4 | `.d6-` |
| day7      | Day 7：小樽慢遊 & 返回札幌    | 4 | `.d7-` |
| day8      | Day 8：JR 赴機場 & 快樂賦歸      | 3 | `.d8-` |
| must-know | 出發前必知 & 伴手禮攻略         | 5 | `.mk-` |

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

完整技術細節（關鍵檔案、主題 token、圖片資產、手機版架構、特殊 hack）→ [blueprint.md](blueprint.md)
