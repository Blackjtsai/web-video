import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/animations.css";

import { useCallback } from "react";
import { AutoToggle } from "./components/AutoToggle";
import { NavArrows } from "./components/NavArrows";
import { ProgressBar } from "./components/ProgressBar";
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

const isSplitMode =
  new URLSearchParams(window.location.search).get("layout") === "split";

function estimateMs(text: string): number {
  if (!text) return 1500;
  return Math.max(1500, text.length * 250);
}

export default function App() {
  const stepper = useStepper(CHAPTERS);
  const ch = CHAPTERS[stepper.cursor.chapter]!;
  const Cmp = ch.Component;
  const stepText = ch.narrations[stepper.cursor.step] ?? "";

  const { mode, cycleMode, autoStarted, setAutoStarted } = useAutoMode();

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
      </Stage>
      <ProgressBar
        chapters={CHAPTERS}
        cursor={stepper.cursor}
        onJumpChapter={stepper.jumpToChapter}
      />
      <NavArrows onPrev={stepper.prev} onNext={stepper.next} />
      <AutoToggle mode={mode} onCycle={cycleMode} />
    </>
  );
}
