import type { ChapterDef } from "./types";
import Coldopen from "../chapters/01-coldopen/Coldopen";
import { narrations as coldopenNarrations } from "../chapters/01-coldopen/narrations";
import Day1 from "../chapters/02-day1/Day1";
import { narrations as day1Narrations } from "../chapters/02-day1/narrations";
import Day2 from "../chapters/03-day2/Day2";
import { narrations as day2Narrations } from "../chapters/03-day2/narrations";
import Day3 from "../chapters/04-day3/Day3";
import { narrations as day3Narrations } from "../chapters/04-day3/narrations";
import Day4 from "../chapters/05-day4/Day4";
import { narrations as day4Narrations } from "../chapters/05-day4/narrations";
import MustKnow from "../chapters/06-must-know/MustKnow";
import { narrations as mustKnowNarrations } from "../chapters/06-must-know/narrations";

/**
 * Order = order of presentation.
 *
 * Each chapter MUST provide a `narrations: Narration[]` array. Its length
 * is the chapter's step count — there is no `totalSteps` to maintain
 * separately. This guarantees the audio synthesis pipeline, the runtime
 * stepper, and the chapter `.tsx` switch on `step` cannot drift apart.
 *
 * Visual styling (color, fonts) comes entirely from the active theme —
 * chapters never hard-code palette / font names. See THEMES.md.
 */
export const CHAPTERS: ChapterDef[] = [
  {
    id: "coldopen",
    title: "開場：九個人，澎湖見",
    narrations: coldopenNarrations,
    Component: Coldopen,
  },
  {
    id: "day1",
    title: "Day 1：花火慶典日",
    narrations: day1Narrations,
    Component: Day1,
  },
  {
    id: "day2",
    title: "Day 2：員貝島嶼遊 & 水族館",
    narrations: day2Narrations,
    Component: Day2,
  },
  {
    id: "day3",
    title: "Day 3：西嶼探秘 & 晶翔號夜釣",
    narrations: day3Narrations,
    Component: Day3,
  },
  {
    id: "day4",
    title: "Day 4：市區巡禮，圓滿賦歸",
    narrations: day4Narrations,
    Component: Day4,
  },
  {
    id: "must-know",
    title: "出發前必知 & 伴手禮攻略",
    narrations: mustKnowNarrations,
    Component: MustKnow,
  },
];
