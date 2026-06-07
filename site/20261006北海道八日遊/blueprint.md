# 系統藍圖 — 20261006北海道八日遊
> 最後更新：2026-06-07

## 章節登錄

| NN  | id        | CSS prefix | Steps | 標題                                |
|-----|-----------|------------|-------|-------------------------------------|
| 01  | coldopen  | `.co-`     |   4   | 開場：六人，秋日北海道見            |
| 02  | day1      | `.d1-`     |   4   | Day 1：順利抵達，札幌市區慢活       |
| 03  | day2      | `.d2-`     |   4   | Day 2：白色戀人 & T38 璀璨夜景      |
| 04  | day3      | `.d3-`     |   4   | Day 3：美玲指定！海鮮市場 & 定山溪  |
| 05  | day4      | `.d4-`     |   5   | Day 4：螃蟹大宴 & 洞爺湖花火        |
| 06  | day5      | `.d5-`     |   4   | Day 5：網美牧場 & 二世谷神仙沼      |
| 07  | day6      | `.d6-`     |   4   | Day 6：積丹海岸自駕 & Glow 和牛 BBQ |
| 08  | day7      | `.d7-`     |   4   | Day 7：小樽運河遊船 & 和牛慶功宴    |
| 09  | day8      | `.d8-`     |   3   | Day 8：新千歲大補貨 & 快樂賦歸      |
| 10  | must-know | `.mk-`     |   5   | 出發前必知 & 北海道名產攻略         |

**總步數：41 步 = narrations.ts 段數 = SEGMENTS 段數（三者一致 ✓）**

> ⚠️ TTS 尚未合成（audio-segments.json 不存在；public/audio/ 不存在）
> 需執行：`cd src && npm run extract-narrations && PRESENTATION_TTS=edge-tts npm run synthesize-audio`

## 關鍵檔案

| 檔案（相對 src/）                     | 關鍵內容 |
|--------------------------------------|---------|
| `src/registry/chapters.ts`           | CHAPTERS 陣列，章節順序唯一真相源 |
| `src/App.tsx`                        | `isMobile` 判斷 (`?layout=mobile`)；AudioPlayer；Stage 佈局 |
| `src/hooks/useStepper.ts`            | `STORAGE_KEY = "presentation-cursor-v4"` |
| `src/styles/tokens.css`              | 主題色 token（楓葉秋光） |
| `src/components/MobilePage.tsx`      | SEGMENTS 陣列（41 段）+ CHAPTER_GROUPS（10 組） |
| `src/components/MobilePage.css`      | 手機版：滿版封面（100dvh）+ scroll lock overlay |
| `src/components/ProgressBar.tsx`     | 傳 `githubUrl={null}` |
| `public/images/`                     | 封面 + 每日圖（見下方清單） |

## 主題色（楓葉秋光）

```css
--surface:      #f5ece0;
--surface-2:    #faf4ec;
--surface-3:    #e8daca;
--text:         #2a1a0e;
--text-2:       #3a2516;
--text-mute:    #7a5c3e;
--text-faint:   #b09070;
--rule:         #c4a882;
--accent:       #bf4400;             /* 楓葉橙紅 */
--accent-soft:  rgba(191, 68, 0, 0.10);
--accent-glow:  rgba(191, 68, 0, 0.32);
```

## 圖片資產

```
public/images/
  cover.jpg                  封面（hero）
  day1.jpg ~ day8.jpg        每日滿版封面
  jozankei.jpg               定山溪溫泉
  koibito-park.jpg           白色戀人公園
  otaru-canal.jpg            小樽運河
  senen-numa.jpg             神仙沼濕地
  shakotan.jpg               積丹海岸
  toya-lake.jpg              洞爺湖花火
  souvenir-rokkatei.jpg      六花亭伴手禮
  souvenir-shiroi-koibito.jpg 白色戀人伴手禮
```

## 手機版架構（MobilePage）

- Hero + 每個 Day section 封面圖：`height: 100dvh` + `object-fit: cover` + 底部漸層 overlay
- 播放時 scroll lock：`position: fixed; z-index: 50; background: transparent` 遮罩攔截觸控
- FAB：`z-index: 100`（在 scroll lock 上方）
- Scrubber（長壓 FAB）：`z-index: 200`
- `scrollIntoView` 是 DOM 操作，不走 pointer 事件，自動捲動不受 scroll lock 影響

## 特殊 hack

- 無 `split.css`（此版本不使用 SplitLayout，網頁版直接 Stage + ProgressBar）
- `ProgressBar` 必須傳 `githubUrl={null}`（否則底部出現範本作者 GitHub 圖示）
- MobilePage 的 `onLock`/`onUnlock` 由 `playing` state 驅動（playing→lock, !playing→unlock）

## TTS 狀態

| 項目 | 值 |
|------|----|
| Provider | edge-tts（待合成） |
| Voice | `zh-TW-HsiaoChenNeural` |
| 已合成 | 0 / 41 段（尚未執行） |
| 合成指令 | `cd site/20261006北海道八日遊/src && npm run extract-narrations && PRESENTATION_TTS=edge-tts npm run synthesize-audio` |

## 啟動指令

```bash
cd site/20261006北海道八日遊/src
npm install      # 第一次需要
npm run dev
# 網頁版：http://localhost:5174/
# 手機版：http://localhost:5174/?layout=mobile
```

## 新增章節流程

1. 建 `src/chapters/<NN>-<id>/narrations.ts` + `.tsx` + `.css`
2. 在 `src/registry/chapters.ts` 加 import + CHAPTERS 項目
3. 在 `src/components/MobilePage.tsx` 的 `SEGMENTS` + `CHAPTER_GROUPS` 補段落
4. `npx tsc --noEmit`
5. `npm run extract-narrations`
6. `PRESENTATION_TTS=edge-tts npm run synthesize-audio`
7. Bump `STORAGE_KEY`（v4 → v5）
