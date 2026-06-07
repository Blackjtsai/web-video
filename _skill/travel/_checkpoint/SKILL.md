---
name: travel-checkpoint
description: 掃描當前旅遊簡報專案，自動更新 blueprint.md，並將新發現的 hack / 模式同步記錄到 SKILL.md
---

# /checkpoint — 旅遊簡報專案存檔

執行時自動掃描專案狀態 → 寫入（或更新）`site/{project}/blueprint.md`。
若本次有新的 hack 或架構決策，同步補充到 `_skill/travel/SKILL.md`。

---

## 文件分工規則（寫 blueprint vs CLAUDE.md 的判斷依據）

| 放 CLAUDE.md | 放 blueprint.md |
|---|---|
| 狀態（完成/進行中）、章節表（無 NN）、主題色摘要（3 行）、URL、port | 章節登錄（帶 NN）、完整 token、圖片資產清單、關鍵檔案表、特殊 hack、TTS 狀態、新增章節流程 |
| 對話起點：Claude 讀了就知道這個專案是什麼 | 技術快照：程式碼對照、一致性驗證、操作細節 |

> **原則**：CLAUDE.md = 「session 第一眼」；blueprint.md = 「需要查的時候才翻」。
> 不要在 CLAUDE.md 放 blueprint 裡已有的完整細節，最後一行加 `→ 完整技術細節見 blueprint.md` 即可。

---

## Step 0：回顧本次 session

在掃描檔案前，先回想這次對話做了什麼，方便後續判斷哪些文件需要回寫：

- 新增 / 刪除了哪些章節或 step？
- 解決了哪些 bug 或版面問題？
- 建立或調整了哪些架構規則？
- STORAGE_KEY 有沒有 bump？

---

## Step 1：偵測當前專案

```bash
# 列出所有旅遊專案
ls -d /Users/blackjtsai/Documents/web-video/site/*/

# 若使用者沒有指定，找最近修改的
ls -dt /Users/blackjtsai/Documents/web-video/site/*/ | head -3
```

若有多個專案存在，詢問使用者選哪個，或根據對話上下文判斷。
確認後，設定 `PROJECT_DIR=site/{project}` 和 `SRC_DIR=site/{project}/src`。

---

## Step 2：掃描專案狀態

一次執行以下所有指令，收集全部資料：

```bash
PROJECT="20261006北海道八日遊"   # 依 Step 1 填入
ROOT="/Users/blackjtsai/Documents/web-video"
PROJ="$ROOT/site/$PROJECT"
SRC="$PROJ/src"

# ── 章節清單（id + 順序）──
echo "=== CHAPTERS ===" && grep -E "id:|Component" "$SRC/src/registry/chapters.ts" | head -40

# ── 每章 step 數（讀 narrations.ts 陣列長度）──
echo "=== STEPS ===" && for dir in "$SRC/src/chapters"/*/; do
  id=$(basename "$dir" | sed 's/^[0-9]*-//')
  count=$(grep -c '^\s*"' "$dir/narrations.ts" 2>/dev/null || echo "?")
  echo "$id: $count"
done

# ── STORAGE_KEY ──
echo "=== STORAGE_KEY ===" && grep "STORAGE_KEY" "$SRC/src/hooks/useStepper.ts"

# ── CSS Token（主題色）──
echo "=== TOKENS ===" && grep -E "^\s+--" "$SRC/src/styles/tokens.css" | head -12

# ── SEGMENTS 段數（MobilePage）──
echo "=== SEGMENTS ===" && grep -c "{ id:" "$SRC/src/components/MobilePage.tsx" 2>/dev/null

# ── TTS 已合成 mp3 數量 ──
echo "=== AUDIO ===" && find "$SRC/public/audio" -name "*.mp3" | wc -l

# ── audio-segments.json 總段數 ──
echo "=== SEGMENTS_JSON ===" && python3 -c "import json,sys; d=json.load(open('$SRC/audio-segments.json')); print(len(d))" 2>/dev/null || echo "not found"

# ── split.css hack（重要覆蓋規則）──
echo "=== SPLIT_HACKS ===" && grep -E "display:\s*none|!important" "$SRC/src/styles/split.css" 2>/dev/null | head -20

# ── 圖片清單 ──
echo "=== IMAGES ===" && ls "$SRC/public/images/" 2>/dev/null | head -20

# ── 現有 blueprint.md（若存在）──
echo "=== EXISTING BLUEPRINT ===" && [ -f "$PROJ/blueprint.md" ] && cat "$PROJ/blueprint.md" || echo "none"
```

---

## Step 3：分析數據，計算一致性

從 Step 2 的輸出中計算：

| 數值 | 來源 | 計算方式 |
|------|------|---------|
| 總步數 | narrations.ts | 每章步數相加 |
| SEGMENTS 段數 | MobilePage.tsx | grep 結果 |
| 音頻已合成 | public/audio/*.mp3 | find 計數 |
| 音頻應有總數 | audio-segments.json | python 計數 |

**⚠️ 一致性警告**：若總步數 ≠ SEGMENTS 段數 ≠ 音頻應有總數 → 在 blueprint.md 標注紅字警告。

---

## Step 4：寫入 blueprint.md

寫入（或完全覆蓋更新）`site/{project}/blueprint.md`，格式如下：

````markdown
# 系統藍圖 — {project}
> 最後更新：{YYYY-MM-DD}

## 章節登錄

| NN  | id        | CSS prefix | Steps | 標題    |
|-----|-----------|------------|-------|---------|
| 01  | coldopen  | `.co-`     |   4   | 開場：… |
| 02  | day1      | `.d1-`     |   6   | Day 1：… |
| … |

**總步數：{N} 步 = narrations.ts 段數 = 音頻數量（三者必須一致）**

⚠️ 若不一致在此標注，例如：`SEGMENTS(40) ≠ 音頻已合成(38)`

## 關鍵檔案

| 檔案（相對 src/）                     | 關鍵內容 |
|--------------------------------------|---------|
| `src/registry/chapters.ts`           | CHAPTERS 陣列，章節順序唯一真相源 |
| `src/App.tsx`                        | SPLIT_IMAGES 對照、isMobileMode 判斷 |
| `src/hooks/useStepper.ts`            | `STORAGE_KEY = "{key}"` |
| `src/styles/tokens.css`              | 主題色 token（{主題名}） |
| `src/styles/split.css`               | 網頁版右側 panel 修正 |
| `src/components/MobilePage.tsx`      | SEGMENTS 陣列（{N} 段） |
| `src/components/SplitEnding.tsx`     | 結尾資源面板（MAPS 陣列） |
| `public/audio/<id>/<N>.mp3`          | 口播音頻（共 {N} 段） |
| `public/images/`                     | 封面圖 + 每日圖（{列出有的檔名}） |

## 主題色

```css
{直接貼 tokens.css 的 --surface / --accent / --text / --text-mute 等關鍵行}
```

## 特殊 hack（踩過的坑）

{從現有 blueprint.md 保留；若有新增的在此加入}

- `split.css`：{根據 SPLIT_HACKS 輸出列出哪些章節背景圖被 display:none}
- `MobilePage.css`：`.mp-root { padding-bottom: 0 }`（底部留白由最後元素自管）
- `ProgressBar` 必須傳 `githubUrl={null}`
- Stage 使用 `min(100vw, 100vh*16/9)` 純 CSS aspect-ratio
- 字體全用 `clamp()`

## TTS 狀態

| 項目 | 值 |
|------|----|
| Provider | edge-tts |
| Voice | `zh-TW-HsiaoChenNeural` |
| 已合成 | {mp3 count} / {segments.json count} 段 |
| 合成指令 | `cd site/{project}/src && PRESENTATION_TTS=edge-tts npm run synthesize-audio` |

## 啟動指令

```bash
cd site/{project}/src
npm run dev
# 網頁版：http://localhost:{port}/web-video/
# 手機版：http://localhost:{port}/web-video/?layout=mobile
```

## 新增章節流程

1. 建 `src/chapters/<NN>-<id>/narrations.ts` + `.tsx` + `.css`
2. 在 `src/registry/chapters.ts` 加 import + CHAPTERS 項目
3. 在 `src/App.tsx` 的 `SPLIT_IMAGES` 加 `<id>: \`${base}images/<id>.jpg\``（若有圖）
4. 在 `src/components/MobilePage.tsx` 的 `SEGMENTS` + `CHAPTER_GROUPS` 補段落
5. `npx tsc --noEmit`
6. `npm run extract-narrations`
7. `PRESENTATION_TTS=edge-tts npm run synthesize-audio`
8. Bump `STORAGE_KEY`
````

---

## Step 5：記錄新經驗到 SKILL.md

從本次對話或本次 checkpoint 中找出**值得沉澱**的新 pattern：

| 有就記錄 | 舉例 |
|---------|------|
| 新的 split.css hack | 某章節右側面板溢出的修法 |
| 新的 CSS pattern | 第一次用某 layout 技巧 |
| TTS 踩坑 | 某種字元導致合成失敗 |
| 手機版新需求 | 滿版圖、scroll lock |

若有新內容，補充到 `_skill/travel/SKILL.md` 的「重要技術細節」段落，
和 `_skill/travel/_references/MOBILE-CRAFT.md`（若是手機版相關）。

若無新內容，跳過 Step 5。

---

## Step 6：回寫共用文件

### ① 根目錄 `CLAUDE.md`

- [ ] 新增旅遊專案 → 「專案狀態」表格補上（章節數 / Step 數 / Port / 主題色）
- [ ] 發現影響所有專案的框架規則 → 「關鍵架構規則」段落更新
- [ ] 否則跳過

### ② 根目錄 `index.html`（GitHub Pages 總入口）

**觸發條件：新專案實際部署到 GitHub Pages 之後才更新。** TTS 未合成 / 未部署的專案不加。

index.html 的連結格式是部署後的短路徑（如 `penghu/`、`sendai/`），
**不是** `site/20260528澎湖四日遊/`。新專案的短路徑需配合 `deploy.yml` 確認。

加一個 `.card` 區塊，格式參考現有卡片：
```html
<div class="card">
  <div class="card-tag">{YYYY · MM}</div>
  <div class="card-title">{地點名稱}</div>
  <div class="card-meta">{N} 章 · {M} 步 · {一句話描述}</div>
  <div class="card-links">
    <a class="btn btn-primary" href="{short-path}/">網頁版</a>
    <a class="btn btn-secondary" href="{short-path}/?layout=mobile">手機版</a>
  </div>
</div>
```

若此次 checkpoint 的專案尚未部署 → 跳過。

---

## Step 7：更新 memory

若本次 checkpoint 發現新的使用者偏好或新的重要設計決策，
寫入 `/Users/blackjtsai/.claude/projects/-Users-blackjtsai-Documents-web-video/memory/`
並更新 `MEMORY.md` index。

---

## 觸發時機建議

- 使用者說「/checkpoint」或「存檔」
- 完成一個完整功能後（新章節、部署、架構調整）
- **不要等到 context 快滿才做** — 那樣會來不及回寫

---

## 完成回報格式

```
✅ blueprint.md 已更新 — {project}
   {N} 章 · {M} 步 · TTS {x}/{y} 段
   {若有不一致：⚠️ 不一致項目}
   {若有新經驗：📝 新增到 SKILL.md：{一句話描述}}
   根目錄 CLAUDE.md   — [✓ 已更新 / ✗ 無需更新]
   site/index.html    — [✓ 已更新 / ✗ 無需更新]
```
