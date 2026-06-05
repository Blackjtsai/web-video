import type { ChapterDef } from "./types";

import ColdOpen from "../chapters/01-coldopen/ColdOpen";
import { narrations as coldopenNarrations } from "../chapters/01-coldopen/narrations";

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

export const CHAPTERS: ChapterDef[] = [
  {
    id: "coldopen",
    title: "開場",
    narrations: coldopenNarrations,
    Component: ColdOpen,
  },
  {
    id: "day1",
    title: "Day 1",
    narrations: day1Narrations,
    Component: Day1,
  },
  {
    id: "day2",
    title: "Day 2",
    narrations: day2Narrations,
    Component: Day2,
  },
  {
    id: "day3",
    title: "Day 3",
    narrations: day3Narrations,
    Component: Day3,
  },
  {
    id: "day4",
    title: "Day 4",
    narrations: day4Narrations,
    Component: Day4,
  },
  {
    id: "day5",
    title: "Day 5",
    narrations: day5Narrations,
    Component: Day5,
  },
  {
    id: "must-know",
    title: "出發前必知",
    narrations: mustKnowNarrations,
    Component: MustKnow,
  },
];
