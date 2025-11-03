import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const PurchaseOrderItemSchema = z.object({
  id: z.number(),
  purchaseOrderId: z.number(),
  itemName: z.string().min(1),
  itemMasterId: z.string(),
  quantity: z.number().min(1),
  specification: z.string(),
  discountPercent: z.number(),
  discountUnit: z.number(),
  //discountTotal: z.number(),
  // vat: z.number(),
  remark: z.string(),
  price: z.number().min(1),
  // amount: z.number(),
})


export type PurchaseOrderItem = z.infer<typeof PurchaseOrderItemSchema>
