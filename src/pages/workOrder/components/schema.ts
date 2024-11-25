import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
    id: z.string(),  
    selectLocation: z.string(),
    selectItem: z.string(),
    unit: z.string(),
    createBy: z.string(), 
    cause: z.string(),   
    quantity : z.number(),
    code: z.string(),  
    createAt: z.string(),
    
    locationId: z.number(),
    location: z.object({
        id: z.number(),
        name: z.string(),   
        warehouseId: z.number(),    
    }),
    userId: z.string(),  
    user: z.object({        
        firstName : z.string()
    }),
    itemMasterId : z.number(),
    itemMaster: z.object({
        code: z.string(),
        name: z.string(), 
        stockingUom: z.string()      
    }),
    received: z.number(),
    balance: z.number(),
    remark: z.string(),   
    status: z.string(),
    workOrderUsages: z.array(z.object({
        id: z.string(), 
        itemMaster: z.object({
            code: z.string(),
            name: z.string(), 
            specification : z.string()
        }),
        quantity: z.number(), 
        pickingQuantity: z.number(), 
        pickingRequest: z.number(), 
        pickingDate: z.string(), 
        pickingBalance: z.number(),
        remark: z.string(),   
        status: z.string(),      
    })),
    workOrderFileAttach:z.array(z.object({
        id: z.number(),
        fileName: z.string(),
        path: z.string()
    }))
       
})

export type WorkOrder = z.infer<typeof customerSchema>
