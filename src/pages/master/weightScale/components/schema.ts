import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
  id: z.string(),
  priceNumber: z.string(),
  status: z.string(),
  createAt: z.string(),
  reason: z.string(),
  inEffectiveDate: z.string(),
  outEffectiveDate: z.string(),
  // outEffectiveDate: z.date({
  //   required_error: 'A date of birth is required.',
  // }),
  // inEffectiveDate: z.date({
  //   required_error: 'A date of birth is required.',
  // }),
  weightScaleVenderTypeItem: z.array(z.object({
    id: z.number(),
    price: z.number(),
    itemMaster: z.object({
      id: z.number(),
      code: z.string(),
      name:z.string()
    }),
    venderType: z.object({
      id: z.number(),
      typeName: z.string(),
      description:z.string()
    })
  }))
  
})

export type WeightScalePrice = z.infer<typeof customerSchema>
