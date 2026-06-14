# 系統藍圖 — 新疆精選旅遊路線
> 最後更新：2026-06-14

## 架構說明

此專案為**純手機版**旅遊攻略，無網頁版 stepper/章節架構。
主要入口：`src/src/components/MobilePage.tsx`（單一長頁）

## SEGMENTS（語音導讀段數）

| id      | step | cardId               | 說明              |
|---------|------|----------------------|-------------------|
| intro   | 1    | mp-s-hero            | 開場介紹          |
| intro   | 2    | mp-s-overview        | 五條路線總覽      |
| winter  | 1    | mp-s-r1-winter       | 將軍山冬季線說明  |
| winter  | 2    | mp-s-r1-winter       | 冬季行程細節      |
| r1      | 1    | mp-s-r1              | 北疆大環線介紹    |
| r1      | 2    | mp-s-r1              | 北疆亮點景點      |
| r1      | 3    | mp-c-r1-days         | 北疆逐日行程      |
| r2      | 1    | mp-s-r2              | 南疆大環線介紹    |
| r2      | 2    | mp-s-r2              | 南疆亮點景點      |
| r2      | 3    | mp-c-r2-days         | 南疆逐日行程      |
| r3      | 1    | mp-s-r3              | 伊犁河谷線介紹    |
| r3      | 2    | mp-s-r3              | 伊犁亮點景點      |
| r3      | 3    | mp-c-r3-days         | 伊犁逐日行程      |
| r4      | 1    | mp-s-r4              | 東疆絲路線介紹    |
| r4      | 2    | mp-s-r4              | 東疆亮點景點      |
| r4      | 3    | mp-c-r4-days         | 東疆逐日行程      |
| know    | 1    | mp-s-know            | 行前必知（前半）  |
| know    | 2    | mp-s-know            | 行前必知（後半）  |

**總 SEGMENTS：18 段 = mobile-narrations.ts 段數 = 音頻數量（三者一致 ✓）**

## 路線資料結構

- **ROUTES** 陣列（4 條）：r1 北疆 / r2 南疆 / r3 伊犁 / r4 東疆
- **ROUTE1_WINTER**：冬季限定滑雪版（5天）
- **SPOTS**：24 個景點物件，含 `name / img / desc / food / tip`
- **CHAPTER_GROUPS**（scrubber 章節分組）：7 組對應 SEGMENTS

## 關鍵檔案

| 檔案（相對 src/）                            | 關鍵內容                                        |
|----------------------------------------------|------------------------------------------------|
| `src/components/MobilePage.tsx`              | ROUTES、SPOTS、SEGMENTS（18段）、CHAPTER_GROUPS、MobileAudioFab、scroll lock |
| `src/components/MobilePage.css`              | sunset-zine 主題樣式、白色卡片、雜誌風排版      |
| `src/mobile-narrations.ts`                   | 18 段語音稿（唯一真相源）                      |
| `src/styles/tokens.css`                      | 主題色 token（sunset-zine）                    |
| `src/scripts/extract-mobile-narrations.ts`   | 產生 audio-segments.json（非章節版）           |
| `scripts/tts-providers/edge-tts.sh`          | TTS provider                                   |
| `public/audio/`                              | 18 段 mp3（按 id/step 命名）                   |
| `public/images-spots/`                       | 24 張景點照片（Wikimedia CC，sips 縮至 1200px）|
| `public/images-mobile/`                      | 手機版圖片（封面、路線規劃圖等）               |

## 主題色（sunset-zine）

```css
--shell:        #1a0d05;
--surface:      #efece7;   /* 暖灰白底（2026-06 改版）*/
--surface-2:    #e8e3db;
--surface-3:    #ddd6cb;
--text:         #2d1a0a;
--text-2:       #3d2a1a;
--text-mute:    #6b4520;   /* WCAG AA 合規（2026-06 改版）*/
--accent:       #c4571a;   /* 胡楊橙紅 */
--rule:         #d4b890;
```

## 特殊 hack / 設計決策

- **純手機版**：無 stepper、無 STORAGE_KEY、無 `chapters/` 目錄
- **TTS pipeline 不同**：`extract-mobile-narrations.ts` → `audio-segments.json`（非 `extract-narrations.ts`）
- **scroll lock**：touchmove ref（`scrollLockedRef.current`）配合 `e.preventDefault({ passive: false })`。**勿用透明 overlay** — iOS Safari 解除後 scroll 狀態有時不恢復
- **導航**：全面使用 Google Maps（`gmapUrl`），已移除所有高德地圖（`amapUrl`）
- **景點圖片**：24 張 Wikimedia Commons CC 授權，`sips -Z 1200` 縮圖後放 `public/images-spots/`
- **卡片樣式**：白色卡片（`#ffffff`）+ 陰影，背景暖灰白（`#efece7`），雜誌感
- **FAB 語音導讀**：MobileAudioFab 含 progress ring、long-press scrubber panel

## TTS 狀態

| 項目        | 值                                          |
|-------------|---------------------------------------------|
| Provider    | edge-tts                                    |
| Voice       | `zh-TW-HsiaoChenNeural`                    |
| 已合成      | 18 / 18 段 ✓                               |
| 合成指令    | `cd site/新疆精選旅遊路線/src && PRESENTATION_TTS=edge-tts npm run synthesize-audio` |

## 啟動指令

```bash
cd site/新疆精選旅遊路線/src
npm run dev
# 手機版：http://localhost:5180/mobile
```

## 新增 SEGMENT 流程

1. 在 `src/mobile-narrations.ts` 新增 `{ id, step, cardId, text }`
2. 在 `MobilePage.tsx` 的 `SEGMENTS` 陣列新增對應項目
3. 在 `CHAPTER_GROUPS` 確認 scrubber 章節對應
4. `npm run extract-narrations`（產生 audio-segments.json）
5. `PRESENTATION_TTS=edge-tts npm run synthesize-audio`（合成新段音頻）
