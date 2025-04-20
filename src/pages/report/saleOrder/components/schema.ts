import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
  soNumber: z.string(),
  custoemrCode: z.string(),
  soDate: z.string(),
  customerName: z.string(),
  customerPO: z.string(),
  driverName: z.string(),
  licensePlate: z.string(),
  soStatus: z.string(),
  scaleNumber: z.string(),
  workorderNo: z.string(),
  itemNumber: z.string(),
  itemName: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  amount: z.number(),
  humidityQtyDeduct: z.number(),
  adulterationQtyDeduct: z.number(),
  otherQtyDeduct: z.number(),
  customerQuantity: z.number(),
  weightPriceDeduct: z.number(),
  shipPriceDeduct: z.number(),
  otherPriceDeduct: z.number(),
  customerUnitPrice: z.number(),
  customerAmount: z.number(),
  diffQuantity: z.number(),
  diffUnitPrice: z.number(),
  destinationHumidity: z.number(),
  customerScaleNumber: z.string(),
  invoiceNumber: z.string(),
})

export type SaleOrderReport = z.infer<typeof schema>
