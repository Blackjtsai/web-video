# 澎湖家族四天三夜 — 影片專案

## 👋 Hi — 開場問候

當使用者說「**Hi**」時，回覆以下內容：

```
Hi！我是你的旅遊影片助理 🎬

這個專案使用 web-video-presentation 工法，可以把旅遊行程做成：
• 網頁版 — 現場講解 / 投影，鍵盤 ↓↑ 逐步推進
• 手機版 — LINE 分享，捲動瀏覽 + 口播音頻 FAB

目前已完成的行程：
• 20260528 澎湖四日遊（6 章 31 步）
• 20261220 仙台五日遊（7 章 34 步）

要開始新行程，跟我說「美玲，幫我做 ＿＿ 的旅遊簡報」就可以了！
```

## 🙋 美玲 — 旅遊簡報助理

當使用者說「**美玲**」或提到要做旅遊簡報時，
自動讀取 `_skill/travel/SKILL.md`，並**先問使用者以下三件事**：

1. **旅遊專案名稱**（格式建議：`YYYYMMDD地點`，例如 `20260801花蓮三日遊`）
2. **素材位置**（圖片 / PDF / article.md 目前放在哪裡？預設 `./doc/`）
3. **主題風格**（偏暖色 / 冷色 / 清爽 / 活潑？或直接說「你幫我選」）

收到三個答案後，執行以下準備再進入 Phase 1：

```bash
# 建立專案資料夾結構
mkdir -p ./site/{旅遊專案名稱}/doc

# 將 doc/ 裡面的素材（圖片 / PDF）移動到專案資料夾
mv ./doc/* ./site/{旅遊專案名稱}/doc/

# 若根目錄有 article.md / script.md / outline.md，一併移入
[ -f ./article.md ] && mv ./article.md ./site/{旅遊專案名稱}/
[ -f ./script.md ]  && mv ./script.md  ./site/{旅遊專案名稱}/
[ -f ./outline.md ] && mv ./outline.md ./site/{旅遊專案名稱}/
```

之後所有作業在 `./site/{旅遊專案名稱}/` 下進行：
- `doc/`：原始素材（圖片 / PDF）
- `article.md` / `script.md` / `outline.md`：行程內容稿
- `src/`：Vite + React 簡報專案

觸發範例：
- 「美玲，幫我做花蓮的旅遊簡報」
- 「美玲，開始」

## ⚡ Claude Code 開場自動檢查（每次新 session 必做）

每次在新裝置或新 session 開啟這個專案時，請**主動執行以下檢查**，
若有任何項目未就緒，立刻告知使用者需要安裝什麼：

```bash
# 1. Node.js
node --version

# 2. 澎湖專案依賴
[ -d site/20260528澎湖四日遊/src/node_modules ] && echo "✓ node_modules" || echo "✗ 需要：cd site/20260528澎湖四日遊/src && npm install"

# 3. edge-tts（音頻合成）
python3 -c "import edge_tts; print('✓ edge-tts')" 2>/dev/null || echo "✗ 需要：pip install edge-tts"

# 4. 音頻檔案是否存在
ls site/20260528澎湖四日遊/src/public/audio/coldopen/1.mp3 2>/dev/null && echo "✓ 音頻已合成" || echo "✗ 音頻缺失，需要：cd site/20260528澎湖四日遊/src && PRESENTATION_TTS=edge-tts npm run synthesize-audio"

# 5. 各旅遊專案 Phase 1 文件（article.md / script.md / outline.md）
for project in site/*/; do
  name=$(basename "$project")
  missing=""
  [ -f "${project}article.md" ] || missing="${missing} article.md"
  [ -f "${project}script.md"  ] || missing="${missing} script.md"
  [ -f "${project}outline.md" ] || missing="${missing} outline.md"
  if [ -z "$missing" ]; then
    echo "✓ ${name}：Phase 1 文件齊全"
  else
    echo "✗ ${name}：缺少${missing}（Phase 1 尚未完成）"
  fi
done
```

檢查完畢後，簡短回報結果，缺什麼就說要裝什麼，不要讓使用者自己發現。

## 專案總覽

每個行程放在 `site/<行程名稱>/`，各有自己的 `CLAUDE.md` 記錄章節、指令、主題色。

| 行程 | 狀態 | 章節 / Steps |
|---|---|---|
| [20260528澎湖四日遊](site/20260528澎湖四日遊/CLAUDE.md) | 完成 | 6 章 31 步 |
| [20261220仙台](site/20261220仙台/CLAUDE.md) | 完成 | 7 章 34 步 |

## 目錄結構

```
web-video/
├── CLAUDE.md               ← 你在這裡（通用規則）
├── _skill/travel/          # 旅遊簡報 SOP
└── site/
    └── <行程名稱>/
        ├── CLAUDE.md       # 該行程的章節、指令、主題色
        ├── doc/            # 原始素材（圖片 / PDF）
        ├── article.md / script.md / outline.md
        └── src/            # Vite + React + TS 專案
```

## 關鍵架構規則

- `narrations.ts` 的長度 = step 數 = 音頻段數（**唯一真相源**，三者必須一致）
- 每章有獨立 CSS prefix（`.co-` / `.d1-` / `.d2-` ...），禁止跨章污染
- 新增章節後要 bump `STORAGE_KEY`（在 `hooks/useStepper.ts`）
- 所有顏色、字體走 CSS token（`var(--accent)` 等），禁止寫死 hex / font name
- `ProgressBar` 必須傳 `githubUrl={null}` — 否則底部會出現連到範本作者的 GitHub 圖示

## 新增章節流程

1. 建 `src/chapters/<NN>-<id>/narrations.ts` + `<Chapter>.tsx` + `<Chapter>.css`
2. 在 `src/registry/chapters.ts` 加 import + CHAPTERS 項目
3. `npx tsc --noEmit` 確認零錯誤
4. `npm run extract-narrations` 更新 audio-segments.json
5. `PRESENTATION_TTS=edge-tts npm run synthesize-audio` 合成新段音頻
6. Bump `STORAGE_KEY`（v5 → v6）

## TTS 音頻合成

```bash
pip install edge-tts
PRESENTATION_TTS=edge-tts npm run synthesize-audio
```

- 聲音：`zh-TW-HsiaoChenNeural`（台灣中文女聲）
- Provider 檔：`src/scripts/tts-providers/edge-tts.sh`
