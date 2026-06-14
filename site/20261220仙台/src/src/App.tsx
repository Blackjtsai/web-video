import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/animations.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { AutoStartGate } from "./components/AutoStartGate";
import { AutoToggle } from "./components/AutoToggle";
import { MobilePage } from "./components/MobilePage";
import { ProgressBar } from "./components/ProgressBar";
import { SplitEnding } from "./components/SplitEnding";
import { SplitLayout } from "./components/SplitLayout";
import { Stage } from "./components/Stage";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useAutoMode } from "./hooks/useAutoMode";
import { useStepper } from "./hooks/useStepper";
import { CHAPTERS } from "./registry/chapters";

const base = import.meta.env.BASE_URL;
const SPLIT_IMAGES: Record<string, string[]> = {
  day1: [
    `${base}images/spots/sendai-airport.jpg`,       // step 0: 機場取車
    `${base}images/spots/hotel-metropolitan.jpg`,   // step 1: 飯店入住
    `${base}images/spots/beef-tongue.jpg`,          // step 2: 牛舌盛宴
    `${base}images/spots/izakaya.jpg`,              // step 3: 居酒屋
    `${base}images/spots/hotel-metropolitan.jpg`,   // step 4: 早點睡
  ],
  day2: [
    `${base}images/spots/eboshi.jpg`,               // step 0: 今日行程
    `${base}images/spots/eboshi.jpg`,               // step 1: Eboshi 介紹
    `${base}images/spots/eboshi.jpg`,               // step 2: 全日飆雪
    `${base}images/spots/snow-road.jpg`,            // step 3: 翻山越嶺
    `${base}images/spots/sukiyaki.jpg`,             // step 4: 山形牛晚餐
    `${base}images/spots/zao-onsen.jpg`,            // step 5: 藏王溫泉
  ],
  day3: [
    `${base}images/spots/zao.jpg`,                  // step 0: 今日不用開車
    `${base}images/spots/zao.jpg`,                  // step 1: 藏王雪場介紹
    `${base}images/spots/zao.jpg`,                  // step 2: 全日滑雪
    `${base}images/spots/zao-onsen.jpg`,            // step 3: 公共浴場
    `${base}images/spots/genghis-khan.jpg`,         // step 4: 成吉思汗烤肉
  ],
  day4: [
    `${base}images/spots/snow-road.jpg`,            // step 0: 告別藏王出發
    `${base}images/spots/sendai-beef.jpg`,          // step 1: 仙台牛燒肉
    `${base}images/spots/spring-valley.jpg`,        // step 2: Spring Valley 介紹
    `${base}images/spots/spring-valley.jpg`,        // step 3: 夜滑體驗
    `${base}images/spots/ramen.jpg`,                // step 4: 深夜拉麵
  ],
  day5: [
    `${base}images/spots/souvenirs.jpg`,            // step 0: 東北名產採購
    `${base}images/spots/outlet.jpg`,               // step 1: 仙台港 Outlet
    `${base}images/spots/sendai-airport.jpg`,       // step 2: 還車 → 機場
    `${base}images/spots/sendai-airport.jpg`,       // step 3: 圓滿落幕
  ],
  "must-know": [
    `${base}images/spots/sendai-airport.jpg`,       // step 0: 必備文件
    `${base}images/spots/snow-road.jpg`,            // step 1: 租車攻略
    `${base}images/spots/snow-road.jpg`,            // step 2: 雪地自駕原則
    `${base}images/spots/zao.jpg`,                  // step 3: 三座雪場速查
    `${base}images/spots/beef-tongue.jpg`,          // step 4: 東北美食清單
  ],
};

const params = new URLSearchParams(window.location.search);
const isMobileMode = params.get("layout") === "mobile";

function estimateMs(text: string): number {
  if (!text) return 1500;
  return Math.max(1500, text.length * 250);
}

function Presentation() {
  const stepper = useStepper(CHAPTERS);
  const ch = CHAPTERS[stepper.cursor.chapter]!;
  const Cmp = ch.Component;
  const stepText = ch.narrations[stepper.cursor.step] ?? "";

  const { mode, cycleMode, autoStarted, setAutoStarted } = useAutoMode();

  const [showEnding, setShowEnding] = useState(false);
  const stepperRef = useRef(stepper);
  stepperRef.current = stepper;
  const showEndingRef = useRef(showEnding);
  showEndingRef.current = showEnding;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (showEndingRef.current) { setShowEnding(false); return; }
        stepperRef.current.prev();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (showEndingRef.current) return;
        const { cursor } = stepperRef.current;
        const isLast =
          cursor.chapter === CHAPTERS.length - 1 &&
          cursor.step === CHAPTERS[cursor.chapter]!.narrations.length - 1;
        if (isLast) { setShowEnding(true); return; }
        stepperRef.current.next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const audioSrc =
    mode === "manual" || stepText === ""
      ? null
      : `${import.meta.env.BASE_URL}audio/${ch.id}/${stepper.cursor.step + 1}.mp3`;

  const onAutoAdvance = useCallback(() => stepper.next(), [stepper]);

  useAudioPlayer({
    src: audioSrc,
    mode,
    trailMs: 200,
    estimateFallbackMs: estimateMs(stepText),
    onAutoAdvance,
    autoStarted,
  });

  const splitImages = SPLIT_IMAGES[ch.id];
  const splitImage = splitImages
    ? (splitImages[stepper.cursor.step] ?? splitImages[0]!)
    : undefined;

  return (
    <>
      <AutoStartGate
        visible={mode === "auto" && !autoStarted}
        onStart={() => setAutoStarted(true)}
      />
      <Stage onAdvance={stepper.next}>
        {splitImage ? (
          <SplitLayout key={ch.id} imageSrc={splitImage}>
            <Cmp step={stepper.cursor.step} />
          </SplitLayout>
        ) : (
          <div key={ch.id} className="scene">
            <Cmp step={stepper.cursor.step} />
          </div>
        )}
        {showEnding && (
          <SplitEnding baseUrl={import.meta.env.BASE_URL} />
        )}
      </Stage>
      <ProgressBar
        chapters={CHAPTERS}
        cursor={stepper.cursor}
        onJumpChapter={stepper.jumpToChapter}
        githubUrl={null}
      />
      <AutoToggle mode={mode} onCycle={cycleMode} />
    </>
  );
}

export default function App() {
  if (isMobileMode) {
    return <MobilePage baseUrl={import.meta.env.BASE_URL} />;
  }
  return <Presentation />;
}
