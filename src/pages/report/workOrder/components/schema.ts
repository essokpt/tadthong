import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
  woNumber: z.string(),
  cause: z.string(),
  woDate: z.string(),
  itemNo: z.string(),
  itemName: z.string(),
  unit: z.string(),
  woStatus: z.string(),
  quantity: z.number(),
  quantityReceived: z.number(),
  quantityRemain: z.number(),
})

export type WorkOrderReport = z.infer<typeof schema>
