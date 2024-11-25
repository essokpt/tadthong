import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const BillingSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  type: z.string(),
  address: z.string(),
  district: z.string(),
  subDistrict: z.string(),
  province: z.string(),
  zipcode: z.string(),
  country: z.string(),
  phone: z.string(),
  email: z.string(),
  contactName: z.string(),
  latitude: z.string(),
  longtitude: z.string(),
  branch: z.string(),
  remark: z.string()
})


export type CustomerBilling = z.infer<typeof BillingSchema>
