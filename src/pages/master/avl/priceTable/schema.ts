import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const formSchema = z.object({    
    id: z.string(),
    cost: z.number(),
    remark: z.string(),
    itemMasterId: z.number(),
    vender:z.object({
        id: z.number(),
        code: z.string(),
        companyName : z.string()
    })
  
})

export type VenderList = z.infer<typeof formSchema>
