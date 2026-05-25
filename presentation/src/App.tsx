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

const SPLIT_IMAGES: Record<string, string> = {
  day1: "images/day1.jpg",
  day2: "images/day2.jpg",
  day3: "images/day3.jpg",
  day4: "images/day4.jpg",
};

const params = new URLSearchParams(window.location.search);
const isSplitMode = params.get("layout") === "split";
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

  // Unified keyboard handler for both modes.
  // Both modes: ↑ = prev, ↓ = next.
  // Split mode extra: ↓ on last step → ending overlay; ↑ on ending → dismiss.
  // Regular mode extra: Home / End / 1–9 chapter jump.
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
        if (isSplitMode && showEndingRef.current) {
          setShowEnding(false);
        } else {
          stepperRef.current.prev();
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (showEndingRef.current) return;
        if (isSplitMode) {
          const { cursor } = stepperRef.current;
          const isLast =
            cursor.chapter === CHAPTERS.length - 1 &&
            cursor.step === CHAPTERS[cursor.chapter]!.narrations.length - 1;
          if (isLast) { setShowEnding(true); return; }
        }
        stepperRef.current.next();
      } else if (!isSplitMode) {
        // Regular-mode-only shortcuts
        if (e.key === "Home") {
          stepperRef.current.jumpToChapter(0, 0);
        } else if (e.key === "End") {
          const last = CHAPTERS.length - 1;
          stepperRef.current.jumpToChapter(last, CHAPTERS[last]!.narrations.length - 1);
        } else if (e.key >= "1" && e.key <= "9") {
          const n = Number(e.key) - 1;
          if (n < CHAPTERS.length) stepperRef.current.jumpToChapter(n, 0);
        }
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

  const splitImage = isSplitMode ? SPLIT_IMAGES[ch.id] : undefined;

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
        {isSplitMode && showEnding && (
          <SplitEnding baseUrl={import.meta.env.BASE_URL} />
        )}
      </Stage>
      <ProgressBar
        chapters={CHAPTERS}
        cursor={stepper.cursor}
        onJumpChapter={stepper.jumpToChapter}
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
