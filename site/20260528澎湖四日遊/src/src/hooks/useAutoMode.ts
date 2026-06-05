import { useCallback, useEffect, useState } from "react";
import type { PlaybackMode } from "./useAudioPlayer";

const ORDER: PlaybackMode[] = ["manual", "audio", "auto"];

function readModeFromURL(): PlaybackMode {
  if (typeof window === "undefined") return "manual";
  const q = new URLSearchParams(window.location.search);
  if (q.get("auto") === "1") return "auto";
  if (q.get("audio") === "1") return "audio";
  return "manual";
}

export function useAutoMode() {
  const [mode, setModeState] = useState<PlaybackMode>(() => readModeFromURL());
  const [autoStarted, setAutoStarted] = useState(false);

  const setMode = useCallback((m: PlaybackMode) => {
    setModeState(m);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("audio");
    url.searchParams.delete("auto");
    if (m === "audio") url.searchParams.set("audio", "1");
    if (m === "auto") url.searchParams.set("auto", "1");
    window.history.replaceState(null, "", url.toString());
    if (m !== "auto") setAutoStarted(false);
  }, []);

  const cycleMode = useCallback(() => {
    setMode(ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length]!);
  }, [mode, setMode]);

  // Space starts auto playback (satisfies browser autoplay policy).
  // M cycles mode.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        cycleMode();
      } else if (e.key === " " && mode === "auto" && !autoStarted) {
        e.preventDefault();
        setAutoStarted(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, autoStarted, cycleMode]);

  return { mode, setMode, cycleMode, autoStarted, setAutoStarted };
}
