# 澎湖家族四天三夜 — 影片專案

## ⚡ Claude Code 開場自動檢查（每次新 session 必做）

每次在新裝置或新 session 開啟這個專案時，請**主動執行以下檢查**，
若有任何項目未就緒，立刻告知使用者需要安裝什麼：

```bash
# 1. Node.js
node --version

# 2. presentation 依賴
[ -d presentation/node_modules ] && echo "✓ node_modules" || echo "✗ 需要：cd presentation && npm install"

# 3. edge-tts（音頻合成）
python3 -c "import edge_tts; print('✓ edge-tts')" 2>/dev/null || echo "✗ 需要：pip install edge-tts"

# 4. 音頻檔案是否存在
ls presentation/public/audio/coldopen/1.mp3 2>/dev/null && echo "✓ 音頻已合成" || echo "✗ 音頻缺失，需要：cd presentation && PRESENTATION_TTS=edge-tts npm run synthesize-audio"
```

檢查完畢後，簡短回報結果，缺什麼就說要裝什麼，不要讓使用者自己發現。

這是一個用 `web-video-presentation` skill 製作的家族旅遊說明影片。
產出物：16:9 Vite + React + TS 網頁，配合口播音頻，錄屏即成片。

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

## 目錄結構

```
web-video/
├── CLAUDE.md             ← 你在這裡
├── article.md            # 原始行程資料（不刪）
├── script.md             # 口播稿（--- 為 step 分隔線）
├── outline.md            # 章節計畫 + 每章信息池
└── presentation/         # Vite + React + TS 專案
    ├── src/
    │   ├── registry/chapters.ts       # 章節總登錄
    │   ├── chapters/<NN>-<id>/        # 每章 .tsx + .css + narrations.ts
    │   ├── styles/tokens.css          # 主題色（藍天白雲）
    │   └── hooks/useStepper.ts        # localStorage 已停用，刷新從頭
    ├── public/
    │   ├── audio/<chapter-id>/<N>.mp3 # 口播音頻（31 段）
    │   └── images/                    # cover/day1-4/overview.jpg
    ├── audio-segments.json            # extract-narrations 產出
    └── scripts/tts-providers/edge-tts.sh  # 自訂 TTS provider
```

## 常用指令

```bash
cd presentation
npm install                 # 第一次 clone 後裝依賴
npm run dev                 # 啟動 dev server（http://localhost:5173）

npx tsc --noEmit            # TypeScript 檢查

npm run extract-narrations  # 掃所有 narrations.ts → audio-segments.json
PRESENTATION_TTS=edge-tts npm run synthesize-audio  # 合成音頻（增量）
```

## TTS 音頻合成

使用 **edge-tts**（免費，Microsoft 神經語音，無需 API key）。

```bash
pip install edge-tts        # 第一次需要安裝
PRESENTATION_TTS=edge-tts npm run synthesize-audio
```

- 聲音：`zh-TW-HsiaoChenNeural`（台灣中文女聲）
- Provider 檔：`scripts/tts-providers/edge-tts.sh`

## 錄屏

音頻合成後，開瀏覽器：

```
http://localhost:5173/?auto=1
```

先啟動螢幕錄影，按 **Space**，全片自動播完（約 4 分鐘）。停止錄影，裁頭尾即成片。

## 關鍵架構規則

- `narrations.ts` 的長度 = step 數 = 音頻段數（**唯一真相源**，三者必須一致）
- 每章有獨立 CSS prefix（`.co-` / `.d1-` / `.d2-` ...），禁止跨章污染
- 新增章節後要 bump `STORAGE_KEY`（在 `hooks/useStepper.ts`）
- 所有顏色、字體走 CSS token（`var(--accent)` 等），禁止寫死 hex / font name

## 新增章節流程

1. 建 `src/chapters/<NN>-<id>/narrations.ts` + `<Chapter>.tsx` + `<Chapter>.css`
2. 在 `src/registry/chapters.ts` 加 import + CHAPTERS 項目
3. `npx tsc --noEmit` 確認零錯誤
4. `npm run extract-narrations` 更新 audio-segments.json
5. `PRESENTATION_TTS=edge-tts npm run synthesize-audio` 合成新段音頻
6. Bump `STORAGE_KEY`（v5 → v6）

## 主題色（已從 sunset-zine 暖橘改為藍天白雲）

`src/styles/tokens.css` 已修改：
- `--surface: #f0f8ff`（雲白）
- `--accent: #1e8fcc`（海洋藍）
- `--text: #1a3858`（深海深藍）
- 字體 / motion / border-radius 維持 sunset-zine 原設計
