import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
  id: z.number(),
  date: z.string(),  
  createAt: z.string(),
  code: z.string(),
  warehouseDestination: z.object({    
      name: z.string()      
  }),
  locationDestination: z.object({   
      name: z.string(),      
  }),
  transferItems: z.array(z.object({  
    id: z.number(),
    itemMasterId: z.number(),
    itemMaster: z.object({
      id: z.number(),
      code: z.string(),
      name: z.string()
    }),
    location: z.object({     
      name: z.string()
    }),
    warehouse: z.object({     
      name: z.string()
    }),
    quantity: z.number(),
    remark: z.string()
  })),
  remark: z.string(),
  user: z.object({
    firstName: z.string(),
  }),
})

export type Transfer = z.infer<typeof schema>
