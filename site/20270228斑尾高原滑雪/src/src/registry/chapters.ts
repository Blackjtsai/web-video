import type { ChapterDef } from "./types";
import ColdOpen from "../chapters/01-sp-coldopen/ColdOpen";
import { narrations as coldopenNarrations } from "../chapters/01-sp-coldopen/narrations";
import Day1 from "../chapters/02-sp-day1/Day1";
import { narrations as day1Narrations } from "../chapters/02-sp-day1/narrations";
import Day2 from "../chapters/03-sp-day2/Day2";
import { narrations as day2Narrations } from "../chapters/03-sp-day2/narrations";
import Day3 from "../chapters/04-sp-day3/Day3";
import { narrations as day3Narrations } from "../chapters/04-sp-day3/narrations";
import Day4 from "../chapters/05-sp-day4/Day4";
import { narrations as day4Narrations } from "../chapters/05-sp-day4/narrations";
import MustKnow from "../chapters/06-sp-must-know/MustKnow";
import { narrations as mustKnowNarrations } from "../chapters/06-sp-must-know/narrations";

/**
 * Order = order of presentation.
 *
 * Chapter ids are prefixed `sp-` (split-web) so their audio folders
 * (public/audio/sp-coldopen/, public/audio/sp-day1/, ...) never collide
 * with the pre-existing mobile-narrations audio folders (public/audio/
 * coldopen/, day1/, day2/, day3/, day4/, must-know/, overview/, budget/),
 * which reuse the same short ids and must not be overwritten.
 *
 * Each chapter MUST provide a `narrations: Narration[]` array. Its length
 * is the chapter's step count — there is no `totalSteps` to maintain
 * separately.
 */
export const CHAPTERS: ChapterDef[] = [
  { id: "sp-coldopen", title: "開場", narrations: coldopenNarrations, Component: ColdOpen },
  { id: "sp-day1", title: "Day 1 去程交通・直奔斑尾高原", narrations: day1Narrations, Component: Day1 },
  { id: "sp-day2", title: "Day 2 斑尾全山攻略日", narrations: day2Narrations, Component: Day2 },
  { id: "sp-day3", title: "Day 3 斑尾 → Tangram", narrations: day3Narrations, Component: Day3 },
  { id: "sp-day4", title: "Day 4 Best Snow Day・回程", narrations: day4Narrations, Component: Day4 },
  { id: "sp-must-know", title: "住宿與出發前必知", narrations: mustKnowNarrations, Component: MustKnow },
];
