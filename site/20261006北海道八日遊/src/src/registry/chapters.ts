import type { ChapterDef } from "./types";

import ColdOpen from "../chapters/01-coldopen/ColdOpen";
import { narrations as coldOpenNarrations } from "../chapters/01-coldopen/narrations";

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

import Day6 from "../chapters/07-day6/Day6";
import { narrations as day6Narrations } from "../chapters/07-day6/narrations";

import Day7 from "../chapters/08-day7/Day7";
import { narrations as day7Narrations } from "../chapters/08-day7/narrations";

import Day8 from "../chapters/09-day8/Day8";
import { narrations as day8Narrations } from "../chapters/09-day8/narrations";

import MustKnow from "../chapters/10-must-know/MustKnow";
import { narrations as mustKnowNarrations } from "../chapters/10-must-know/narrations";

export const CHAPTERS: ChapterDef[] = [
  { id: "coldopen",  title: "開場：六人，秋日北海道見",             narrations: coldOpenNarrations, Component: ColdOpen  },
  { id: "day1",      title: "Day 1：順利抵達，札幌市區慢活",        narrations: day1Narrations,     Component: Day1      },
  { id: "day2",      title: "Day 2：白色戀人 & T38 璀璨夜景",       narrations: day2Narrations,     Component: Day2      },
  { id: "day3",      title: "Day 3：美玲指定！海鮮市場 & 定山溪",   narrations: day3Narrations,     Component: Day3      },
  { id: "day4",      title: "Day 4：螃蟹大宴 & 洞爺湖花火",         narrations: day4Narrations,     Component: Day4      },
  { id: "day5",      title: "Day 5：網美牧場 & 二世谷神仙沼",       narrations: day5Narrations,     Component: Day5      },
  { id: "day6",      title: "Day 6：積丹海岸自駕 & Glow 和牛 BBQ", narrations: day6Narrations,     Component: Day6      },
  { id: "day7",      title: "Day 7：小樽運河遊船 & 和牛慶功宴",     narrations: day7Narrations,     Component: Day7      },
  { id: "day8",      title: "Day 8：新千歲大補貨 & 快樂賦歸",       narrations: day8Narrations,     Component: Day8      },
  { id: "must-know", title: "出發前必知 & 北海道名產攻略",           narrations: mustKnowNarrations, Component: MustKnow  },
];
