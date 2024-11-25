import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(), 
  phoneNumber: z.string(),
  email: z.string(),
  subDistrict: z.string(),
  district: z.string(),
  userId : z.string(),
  employeeId : z.string(),
  province : z.string(),
  zipcode : z.string(),
  country : z.string(),
  idCard : z.string(),
  dateOfBirth : z.string(),
  dateOfHire : z.string(),
  division : z.string(),
  status : z.string(),
  username : z.string(),
  password : z.string(),
  userImage : z.string()
})

export type User = z.infer<typeof schema>


