import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(), 
  status: z.string(), 
  permission : z.array(z.object({
    id : z.string(),
    name : z.string(),
    checked : z.boolean()
  }))
 
})

export type Role = z.infer<typeof customerSchema>
