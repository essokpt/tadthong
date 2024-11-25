import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  phone: z.string(),
  fax: z.string(),
  ext: z.string(),
  attn: z.string(),
  branchId: z.number(),
  status: z.string(), 
  branch : z.object({
    branchName : z.string()
  }),
  
})

export type Warehouse = z.infer<typeof customerSchema>
