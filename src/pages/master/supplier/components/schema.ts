import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  address: z.string(),
  district: z.string(),
  province: z.string(),
  zipcode: z.string(),
  phone: z.string(),
  fax: z.string(),
  tax: z.string(), 
  contactName: z.string(),
  email: z.string(),
  mobile: z.string(),
  remark: z.string(),
})

export type Supplier = z.infer<typeof customerSchema>
