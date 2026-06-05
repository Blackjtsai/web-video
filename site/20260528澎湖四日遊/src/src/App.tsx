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
const SPLIT_IMAGES: Record<string, string> = {
  day1: `${base}images/day1.jpg`,
  day2: `${base}images/day2.jpg`,
  day3: `${base}images/day3.jpg`,
  day4: `${base}images/day4.jpg`,
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

  // 鍵盤操作：↑ 上一步 / ↓ 下一步
  // 最後一步 ↓ → 結尾資源面板；結尾面板 ↑ → 回去
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
        if (showEndingRef.current) {
          setShowEnding(false);
        } else {
          stepperRef.current.prev();
        }
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

  const splitImage = SPLIT_IMAGES[ch.id];

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
