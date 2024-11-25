import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({ 
    id: z.string(),
    itemMasterId : z.number(),
    venderId: z.number(),
    vender: z.object({
        code: z.string(),
        companyName : z.string()
    }),
    quantity: z.number(),
    price:z.number(),
    total:z.number(),
    amount : z.number(),
    includeVat : z.number(),
    remark: z.string(),
    status: z.string(),
    specification: z.string(),
    itemMaster: z.object({
        code: z.string(),
        name: z.string()        
    }),
    purchaseRequestId: z.string(),   
    purchaseRequests: z.object({
        id: z.number(),
        code: z.string(),
        createDate : z.string()
    }),
})

export type PurchaseRequestItems = z.infer<typeof customerSchema>
