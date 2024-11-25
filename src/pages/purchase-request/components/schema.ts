import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
    id: z.string(),
    reason: z.string(),
    cause: z.string(),
    department: z.string(),
    companyId : z.string(),
    branchId : z.string(),
    total : z.number(),
    sumVat : z.number(),
    sumQty : z.number(),
    amount : z.number(),
    code: z.string(),    
    description: z.string(),
    requirmentDate: z.string(),
    createAt: z.string(),
    userId: z.string(),
    approveBy: z.string(),
    venderId: z.string(),
    vender: z.object({
        code: z.string(),
        companyName : z.string()
    }),
    locationId: z.number(),
    location: z.object({
        id: z.number(),
        name: z.string(),       
    }),
    user: z.object({        
        firstName : z.string()
    }),
    remark: z.string(),   
    status: z.string(),
    purchaseRequestItems : z.array(z.object({
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
        })
    })),
    purchaseRequestFileAttach: z.array(z.object({
        id: z.number(),
        fileName: z.string(),
        path: z.string()
    }))
       
})

export type PurchaseRequest = z.infer<typeof customerSchema>
