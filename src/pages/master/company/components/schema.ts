import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const formchema = z.object({
  id: z.string(),
  code: z.string(),
  companyName: z.string(),
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
  country: z.string(),
  attn: z.string(),
  ext: z.string(),
  foundedDate: z.date(),
  billAddress: z.string(),
  billProvince: z.string(),
  billZipcode: z.string(),
  billCountry: z.string(),
  billDistrict: z.string(),
  billSubDistrict: z.string(),
  logo : z.string(),
  companyFileAttach: z.array(z.object({
    id:z.number(),
    fileName: z.string(),
    path: z.string(),
    remark: z.string(),
    expireDate: z.string()
  }))
  //date: z.date()
})

export type CompanySchema = z.infer<typeof formchema>
