import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
  id: z.string(),
  code: z.string(),
  companyName: z.string(),
  address: z.string(),
  subDistrict: z.string(),
  district: z.string(),
  province: z.string(),
  zipcode: z.string(),
  country : z.string(),
  paymentType : z.string(),
  phone: z.string(),
  phoneExt: z.string(),
  fax: z.string(),
  faxExt: z.string(),
  tax: z.string(), 
  email: z.string(), 
  contactName : z.string(),
  status : z.string(),
  specialIntruction : z.string(),
  paymentTerm : z.string(),
  currency : z.string(),
  alternatePhone : z.string(),
  latitude : z.string(),
  longtitude : z.string(),
  bankAccount : z.string(),
  remark: z.string(), 
  venderTypeId : z.number(),
  venderType : z.object({
    id: z.number(),
    typeName: z.string()
  }),
  venderFileAttach: z.array(z.object({
    id: z.number(),
    fileName: z.string(),
    path: z.string()
  })),
  venderBillings : z.array(z.object({
    id: z.number(),
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
  }))
 
})

export type Venders = z.infer<typeof customerSchema>
