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
    `${base}images/day1.jpg`, // step 0: 桃園→羽田
    `${base}images/day1.jpg`, // step 1: 電車轉乘
    `${base}images/day1.jpg`, // step 2: 巴士→高天原
    `${base}images/day1.jpg`, // step 3: 志賀百樂酒店
    `${base}images/day1.jpg`, // step 4: 若開放夜滑
  ],
  day2: [
    `${base}images/day2.jpg`, // step 0: 3日券Day1開通
    `${base}images/day2.jpg`, // step 1: 高天原・中央區
    `${base}images/day2.jpg`, // step 2: 東館山・寺小屋
    `${base}images/day2.jpg`, // step 3: 串到一之瀨
  ],
  day3: [
    `${base}images/day3.jpg`, // step 0: 3日券Day2開通
    `${base}images/day3.jpg`, // step 1: 一之瀨
    `${base}images/day3.jpg`, // step 2: 燒額山
    `${base}images/day3.jpg`, // step 3: 奧志賀
  ],
  day4: [
    `${base}images/day4.jpg`, // step 0: 3日券Day3開通
    `${base}images/day4.jpg`, // step 1: 收板底線
  ],
  day5: [
    `${base}images/day4.jpg`, // step 0: 下山回長野
    `${base}images/day4.jpg`, // step 1: 羽田→桃園
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
