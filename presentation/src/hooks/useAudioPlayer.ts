import { useEffect, useRef } from "react";

export type PlaybackMode = "manual" | "audio" | "auto";

interface Options {
  src: string | null;
  mode: PlaybackMode;
  trailMs?: number;
  estimateFallbackMs?: number;
  onAutoAdvance: () => void;
  autoStarted: boolean;
}

export function useAudioPlayer({
  src,
  mode,
  trailMs = 200,
  estimateFallbackMs = 1500,
  onAutoAdvance,
  autoStarted,
}: Options) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onAdvanceRef = useRef(onAutoAdvance);
  onAdvanceRef.current = onAutoAdvance;

  useEffect(() => {
    const prev = audioRef.current;
    if (prev) {
      prev.pause();
      prev.removeAttribute("src");
      prev.load();
      audioRef.current = null;
    }

    if (mode === "manual") return;
    if (mode === "auto" && !autoStarted) return;

    let advanced = false;
    let timer: number | null = null;

    const advanceAfter = (ms: number) => {
      if (mode !== "auto" || advanced) return;
      timer = window.setTimeout(() => {
        if (advanced) return;
        advanced = true;
        onAdvanceRef.current();
      }, Math.max(0, ms));
    };

    if (src) {
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.preload = "auto";

      audio.addEventListener("ended", () => advanceAfter(trailMs));
      audio.addEventListener("error", () => {
        if (mode === "auto") advanceAfter(estimateFallbackMs);
      });

      audio.play().catch((err) => {
        console.warn("audio play failed:", err);
        if (mode === "auto") advanceAfter(estimateFallbackMs);
      });
    } else if (mode === "auto") {
      advanceAfter(estimateFallbackMs);
    }

    return () => {
      advanced = true;
      if (timer != null) clearTimeout(timer);
      const a = audioRef.current;
      if (a) {
        a.pause();
        a.removeAttribute("src");
        a.load();
        audioRef.current = null;
      }
    };
  }, [src, mode, trailMs, estimateFallbackMs, autoStarted]);
}
