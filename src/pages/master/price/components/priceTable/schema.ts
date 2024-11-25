import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const formSchema = z.object({ 
    id: z.string(),
    price: z.number(),
    customers : z.object({
        code : z.string(),
        companyName :z.string(),  
    }),
    itemMasterId : z.number(),
    customersId : z.number(),
})

export type PriceList = z.infer<typeof formSchema>
