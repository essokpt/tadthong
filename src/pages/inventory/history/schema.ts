import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
  id: z.number(),
  stockType: z.string(),
  ref: z.string(),
  dateTime: z.string(),
  status: z.string(),
  unit: z.string(),  
  quantity: z.number(),
  locationId: z.number(),
  location: z.object({
    name: z.string(),   
  }),
  warehouseId: z.number(), 
  warehouse: z.object({
    name: z.string(),
    branch: z.object({
      branchName: z.string(),
    }),
  }),
  branchId: z.number(),  
  itemMasterId: z.number(),
  itemMaster: z.object({
    id: z.number(),
    code: z.string(),
    name: z.string()
  }), 
  stockBy: z.string(),
   
})

export type StockHistory = z.infer<typeof schema>
