import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const locationSchema = z.object({
  id: z.number(),
  name: z.string(), 
  Description:z.string(),
  warehouseId : z.number(),
  status: z.string(),
  warehouse: z.object({
    name : z.string()
  }),
  
})

export type Locations = z.infer<typeof locationSchema>
