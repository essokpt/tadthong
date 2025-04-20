import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
  poNumber: z.string(),
  poStatus: z.string(),
  poCreate: z.string(),
  vendorName: z.string(),
  paymentType: z.string(),
  deliveryDate: z.string(),
  itemNumber: z.string(),
  itemName: z.string(), 
  quantity: z.number(),
  price: z.number(),
  amount: z.number(),
  quantitReceived: z.number(),
  quantityRemain: z.number(),
     
})

export type PurchaseOrderReport = z.infer<typeof schema>
