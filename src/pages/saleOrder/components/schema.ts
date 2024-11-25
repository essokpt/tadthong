import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({   
    id: z.number(),
    selectLocation: z.string(),
    selectCustomer: z.string(),
    createBy: z.string(),
    code: z.string(),    
    poNumber: z.string(),
    cause: z.string(),
    carRegistration: z.string(),
    driverName: z.string(),
    vat: z.number(),
    amount : z.number(),   
    locationId: z.number(),
    location: z.object({
        id: z.number(),
        name: z.string()
    }),    
    customerId: z.number(),
    customer: z.object({
        code: z.string(),
        companyName : z.string()
    }),
    userId: z.number(),
    user: z.object({        
        firstName : z.string()
    }),
    createAt: z.string(),
    remark: z.string(),   
    status: z.string(),
    saleOrderItems: z.array(z.object({
        id: z.number(),
        itemMasterId: z.number(),
        itemMaster: z.object({
            id: z.number(),
            code: z.string(),
            name: z.string(),
        }),
        saleOrderId: z.number(),
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
    //new
        humidity:z.number(),
        adulteration :z.number(),
        other:z.number(),
        weighingMoney:z.number(),
        shipDown :z.number(),
        cashOther : z.number()
    })),
    saleOrderAttachFiles: z.array(z.object({
        id: z.number(),
        fileName: z.string(),
        path: z.string()
    }))
    
       
})

export type SaleOrder = z.infer<typeof schema>
