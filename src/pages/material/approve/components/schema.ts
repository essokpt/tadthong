import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
    sumWeightIn: z.number(),
    sumWeightOut: z.number(),
    sumWeightNet: z.number(),
    sumHumiduty: z.number(),
    sumadulteration: z.number(),
    sumWeightBalace: z.number(),
    sumOther: z.number(),  
    sumPrice: z.number(),  
    sumAmount: z.number(),  
    sumCol7: z.number(),  
    sumShiping: z.number(),  
    sumMoney: z.number(),  
    sumBalance: z.number(),
})

export type Summary = z.infer<typeof schema>
