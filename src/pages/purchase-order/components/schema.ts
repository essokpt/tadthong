import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
    id: z.string(),
    code: z.string(),    
    description: z.string(),
    cause: z.string(),
    currency: z.string(),
    paymentTerm: z.string(),
    paymentType: z.string(),
    deliveryDate: z.string(),
    createAt: z.string(),
    locationId: z.number(),
    branchId : z.number(),
    location: z.object({
        id: z.number(),
        name: z.string()
    }),
    approveBy: z.string(),
    userId: z.string(),
    venderId: z.string(),
    vender: z.object({
        code: z.string(),
        companyName : z.string()
    }),
    user: z.object({        
        firstName : z.string()
    }),
    discount : z.number(),
    amount : z.number(),
    vat : z.number(),
    remark: z.string(),   
    status: z.string(),
    purchaseOrderFileAttach: z.array(z.object({
        id: z.number(),
        fileName: z.string(),
        path: z.string()
    })),
    purchaseOrderItems : z.array(z.object({
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
        receiveOrderItems : z.array(z.object({ 
            purchaseOrderItemId: z.number(),         
            receiveQuantity: z.number(), 
            locationId: z.number(),            
            status: z.string(),
            userId:z.number(),
            receiveDate: z.string()           
        })) 

    })) 
       
})

export type PurchaseOrder = z.infer<typeof customerSchema>
