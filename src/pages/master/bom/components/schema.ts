import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
  id: z.string(),
  description: z.string(),
  name: z.string(),
  quantity: z.number(),
  scrap: z.number(),
  inEffectiveDate: z.string(),
  outEffectiveDate: z.string(),
  itemMaster: z.object({
    code: z.string()
  })
})

export type Bom = z.infer<typeof customerSchema>
