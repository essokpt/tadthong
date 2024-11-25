import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
  id: z.number(),
  planDate: z.string(),  
  quantity: z.number(),
  userId: z.number(),
  user: z.object({
    firstName: z.string(),
  }),
  // selectedItemmaster: z.string(),
  // selectedCustomer: z.string(),
  createBy: z.string(),
  customerId: z.number(),
  customer: z.object({
    id: z.number(),
    code: z.string(),
    companyName: z.string()
  }),
  itemMasterId: z.number(),
  itemMaster: z.object({
    id: z.number(),
    code: z.string(),
    name: z.string()
  }),
  remark: z.string()
})

export type Forecast = z.infer<typeof customerSchema>
