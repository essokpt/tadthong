import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
   id : z.number(),
   createDate: z.string(),
   itemName : z.string(),
   customer : z.string(),
   queueNo : z.string(),
   licensePlate: z.string(),
   sourceQty : z.number(),
   customerQty : z.number(),
   diffQuantity : z.number(),
   sourceHumandity : z.number() ,
   customerHumandity : z.number(),
   invoiceNo: z.string() ,
   invoiceDate : z.string(),
   unitPrice : z.number(),
   customerPrice : z.number(),
   diffPrice : z.number(),
   amountBeforVat : z.number(),
   vat : z.number(),
   amountVat : z.number(),
})

export type MasterReport = z.infer<typeof schema>
