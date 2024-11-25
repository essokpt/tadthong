import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
    id: z.string(),
    specification: z.string(),
    quantity: z.number(),
    price:z.number(),
    total:z.number(),
    amount : z.number(),
    includeVat : z.number(),   
    venderId: z.string(),
    vender: z.object({
        code: z.string(),
        companyName : z.string(),
        currency : z.string(),
        paymentTerm : z.string(),
        venderType : z.string(),
    }),
    itemMaster: z.object({
        code: z.string(),
        name: z.string()          

    }),
    purchaseRequests: z.object({
        code: z.string(),
        locationId : z.number()
    }),        
    remark: z.string(),   
    status: z.string(),
          
})

export type PurchaseRequestItem = z.infer<typeof customerSchema>
