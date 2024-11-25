import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
  id: z.number(),
  code: z.string().min(1, { message: 'Please enter your email' }),
  companyName: z.string().min(1, {
    message: 'Please enter your password',
  }),
  address: z.string(),
  fax: z.string(),
  ext: z.string(),
  tax: z.string(),
  type: z.string(),
  phone: z.string(),
  attn: z.string(),
  email: z.string().email({ message: 'Invalid email address' }),
  status: z.string(),
  remark: z.string(),
  country: z.string(),
  district: z.string(),
  subDistrict: z.string(),
  province: z.string(),
  zipcode: z.string(),
  paymentTerm: z.string(),
  currency: z.string(),
  creditHold: z.boolean(),
  creditLimitOrder: z.string(),
  creditLimitItem: z.string(),
  alternatePhone: z.string(),
  phoneExt: z.string(),
  alternateFax: z.string(),
  specialIntruction: z.string(),
  meng: z.string(),
  costmarkup: z.string(),
  paymenTerm: z.string(),
  createAt: z.string(),
  customerBillings: z.array(
    z.object({
      id:z.number(),
      type: z.string(),
      code: z.string(),
      name: z.string(),
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
      branch: z.string()
    })
  ),
})

export type Customer = z.infer<typeof customerSchema>
