import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const formSchema = z.object({
    id: z.string(),
    code : z.string(),
    description :z.string(),  
    status: z.string()
})

export type Uom = z.infer<typeof formSchema>
