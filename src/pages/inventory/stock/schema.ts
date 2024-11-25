import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
  id: z.number(),
  unit: z.string(),  
  receiveQuantity: z.number(),
  locationId: z.number(),
  location: z.object({
    name: z.string(),     
    warehouse: z.object({
      name: z.string(),      
      branch: z.object({
        name: z.string(),
      }),
    }),
  }),   
  itemMasterId: z.number(),
  itemMaster: z.object({
    id: z.number(),
    code: z.string(),
    name: z.string()
  }),
  
})

export type StockOnhand = z.infer<typeof schema>
