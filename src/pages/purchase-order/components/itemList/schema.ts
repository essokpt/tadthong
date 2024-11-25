import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const Schema = z.object({ 
    id: z.string(),
    stockType : z.string(),
    ref : z.string(),
    stockBy : z.string(),
    itemMasterId : z.number(),
    warehouseId : z.number(),
    branchesId : z.number(),
    quantity: z.number(),
    enableUpdate : z.boolean(),
    specification: z.string(),
    discountPercent: z.number(),
    discountUnit: z.number(),
    discountTotal: z.number(),
    vat: z.number(),
    remark: z.string(),
    price:z.number(),
    amount : z.number(),
    received: z.number(),
    balance: z.number(),
    status: z.string(),       
    receiveQuantity: z.number(),
    locationId: z.number(), 
    userId:z.number(),
    receiveDate: z.string(), 
    itemMaster: z.object({
        code: z.string(),
        name: z.string()
    }),
    purchaseOrderId : z.number(),
    purchaseOrder :  z.object({ 
        id: z.number(),         
        code: z.string(),               
    })   
})

export type PurchaseOrderItems = z.infer<typeof Schema>
