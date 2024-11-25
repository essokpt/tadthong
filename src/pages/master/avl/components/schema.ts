import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const formSchema = z.object({
    id: z.string(),
    code : z.string(),
    name :z.string(),  
    description :z.string(),  
    stockingUom :z.string(),
    itemVenderLists: z.array(z.object({
        id: z.string(),
        cost: z.number(),
        remark: z.string(),
        itemMasterId: z.number(),
        vender:z.object({
            id: z.number(),
            code: z.string(),
            companyName : z.string()
        })
    }))
})

export type Avl = z.infer<typeof formSchema>
