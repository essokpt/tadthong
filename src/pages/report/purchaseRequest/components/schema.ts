import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
    id: z.string(),
    prCode : z.string(),
    companyName : z.string(),
    prAmount : z.number(),
    prStatus : z.string(),
    requirmentDate : z.string(),
    createAt : z.string(),
    quantity : z.number(),
    price : z.number(),
    amount : z.number(),
    name: z.string(),
   
})

export type PurchaseRequestReport = z.infer<typeof schema>
