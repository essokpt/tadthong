import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
    id: z.number(),
    itemMasterId: z.number(),
    itemMaster: z.object({
        id: z.number(),
        code: z.string(),
        name: z.string(),
    }),
    quantity: z.number(),
    unitPrice: z.number(),
    amount: z.number(),
    underCutPrice: z.number(),
    cuttingWeight: z.number(),
    afterCutPrice: z.number(),
    afterCutQuantity: z.number(),
    afterAmount: z.number(),
    sourceHumidity: z.number(),
    destinationHumidity: z.number(),
    destinationWeighingScale: z.string(),
    remark: z.string(),
    saleOrder: z.object({
        id: z.number(),
        code: z.string(),    
        poNumber: z.string(),
        cause: z.string(),
        carRegistration: z.string(),
        driverName: z.string(),
        vat: z.number(),
        amount : z.number(), 
        createAt: z.string(), 
        customerId: z.number(),
        customer: z.object({
            code: z.string(),
            companyName : z.string()
        }),
    })
   
          
})

export type saleOrderItems = z.infer<typeof customerSchema>
