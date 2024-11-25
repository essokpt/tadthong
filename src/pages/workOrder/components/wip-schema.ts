import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
    
    id: z.string(),
    code: z.string(),
    name: z.string(),   
    wips: z.array(z.object({
        id: z.string(),
        name: z.string(),
        level: z.number(),
        wipValues: z.array(z.object({
            id: z.string(),
            date: z.string(),
            value: z.string()
        }))
    }))
})

export type Wip = z.infer<typeof customerSchema>
