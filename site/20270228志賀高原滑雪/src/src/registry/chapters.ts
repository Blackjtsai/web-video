import type { ChapterDef } from "./types";
import ColdOpen from "../chapters/01-coldopen/ColdOpen";
import { narrations as coldopenNarrations } from "../chapters/01-coldopen/narrations";
import NaganoOverview from "../chapters/02-nagano-overview/NaganoOverview";
import { narrations as naganoOverviewNarrations } from "../chapters/02-nagano-overview/narrations";
import Day1 from "../chapters/02-day1/Day1";
import { narrations as day1Narrations } from "../chapters/02-day1/narrations";
import Day2 from "../chapters/03-day2/Day2";
import { narrations as day2Narrations } from "../chapters/03-day2/narrations";
import Day3 from "../chapters/04-day3/Day3";
import { narrations as day3Narrations } from "../chapters/04-day3/narrations";
import Day4 from "../chapters/05-day4/Day4";
import { narrations as day4Narrations } from "../chapters/05-day4/narrations";
import Day5 from "../chapters/06-day5/Day5";
import { narrations as day5Narrations } from "../chapters/06-day5/narrations";
import MustKnow from "../chapters/07-must-know/MustKnow";
import { narrations as mustKnowNarrations } from "../chapters/07-must-know/narrations";

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
  { id: "coldopen", title: "開場", narrations: coldopenNarrations, Component: ColdOpen },
  { id: "nagano-overview", title: "長野雪場總覽", narrations: naganoOverviewNarrations, Component: NaganoOverview },
  { id: "day1", title: "Day 1 紅眼班機・直奔志賀高原高天原", narrations: day1Narrations, Component: Day1 },
  { id: "day2", title: "Day 2 高天原・中央區", narrations: day2Narrations, Component: Day2 },
  { id: "day3", title: "Day 3 一之瀨・燒額山・奧志賀", narrations: day3Narrations, Component: Day3 },
  { id: "day4", title: "Day 4 機動滑雪日", narrations: day4Narrations, Component: Day4 },
  { id: "day5", title: "Day 5 歸途", narrations: day5Narrations, Component: Day5 },
  { id: "must-know", title: "出發前必知", narrations: mustKnowNarrations, Component: MustKnow },
];
