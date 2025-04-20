import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
    id: z.string(),
    soNumber : z.string(),
   custoemrCode : z.string(),
     soDate : z.string(),
   customerName : z.string(),
   customerPO : z.string(),
   driverName : z.string(),
   licensePlate : z.string(),
   soStatus : z.string(),
   
})

export type PurchaseRequestReport = z.infer<typeof schema>
