import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
  id: z.number(),
  date: z.string(),  
  createAt: z.string(),  
  code: z.string(),
  remark: z.string(),
  adjustmentReason: z.object({
    desc : z.string()
  }),
  userId : z.number(),
  user:z.object({
    firstName : z.string()
  }),
  inventoryAdjustItems: z.array(z.object({  
    id:z.number(),
    stockOnHandId: z.number(),
    stockOnHand: z.object({
      itemMasterId: z.number(),
      itemMaster: z.object({
        id: z.number(),
        code: z.string(),
        name: z.string()
      }),
    }),   
    quantity: z.number() ,
    flag: z.number()    
  })) 
})

export type Adjustment = z.infer<typeof schema>
