import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const formSchema = z.object({
    id: z.string(),
    code : z.string(),
    name :z.string(), 
    description :z.string(),  
    stockingUom :z.string(),  
    itemMasterId: z.number(),
    priceMaster: z.array(z.object({
        id: z.string(),
        price: z.number(),
        customers : z.object({
            code : z.string(),
            companyName :z.string(),  
        }),
        itemMasterId: z.number(),
        customersId: z.number()
    }))
   
})

export type Price = z.infer<typeof formSchema>
