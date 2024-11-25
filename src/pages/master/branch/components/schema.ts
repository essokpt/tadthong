import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
  id: z.string(),
  code: z.string(),
  branchName: z.string(),
  address: z.string(),
  district: z.string(),
  subDistrict: z.string(),
  province: z.string(),
  zipcode: z.string(),
  phone: z.string(),
  fax: z.string(),
  tax: z.string(), 
  email: z.string(), 
  remark: z.string(),
  companyId: z.string(),
})

export type Branches = z.infer<typeof customerSchema>
