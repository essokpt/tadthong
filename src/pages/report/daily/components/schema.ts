import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
 id : z.number(),
 itemCode : z.string(),
 itemName : z.string(),
 descriptions : z.string(),
 day1  :z.number(),
 day2  :z.number(),
 day3  :z.number(),
 day4  :z.number(),
 day5  :z.number(),
 day6 : z.number(),
 day7  :z.number(),
 day8  :z.number(),
 day9  :z.number(),
 day10 : z.number(),
 day11 : z.number(),
 day12 : z.number(),
 day13 : z.number(),
 day14 : z.number(),
 day15 : z.number(),
 day16 : z.number(),
 day17 : z.number(),
 day18 : z.number(),
 day19 : z.number(),
 day20 : z.number(),
 day21 : z.number(),
 day22 : z.number(),
 day23 : z.number(),
 day24 : z.number(),
 day25 : z.number(),
 day26 : z.number(),
 day27 : z.number(),
 day28 : z.number(),
 day29 : z.number(),
 day30 : z.number(),
 day31 : z.number(),
  

})

export type MasterReport = z.infer<typeof schema>
