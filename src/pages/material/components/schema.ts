import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({
    id: z.string(),
    code: z.string(),
    importDate: z.string(),
    remark : z.string(),
    status : z.string(),
    approvedBy : z.string(),
    stockIn : z.string(),
    user: z.object({
        firstName: z.string(),
        lastName : z.string()
    }),
    locationId: z.number(),
    location: z.object({
        id: z.number(),
        name : z.string()
    }),
    materials: z.array(z.object({
        id: z.number(),
        importId: z.string(),
        queueNo: z.string(),
        cardNo: z.string(),
        carNo: z.string(),
        dateIn: z.string(),
        timeIn: z.string(),
        weightIn: z.string(),
        dateOut: z.string(),
        timeOut: z.string(),
        weightOut: z.string(),
        typeCode: z.string(),
        customerCode: z.string(),
        productCode: z.string(),
        col1: z.string(),
        col2: z.string(),
        col3: z.string(),
        remark: z.string(),
        priceReceipt: z.string(),
        col4: z.string(),
        col5: z.string(),
        col6: z.string(),
        col7: z.string(),
        col8: z.string(),
        col9: z.string(),
        col10: z.string(),
        col11: z.string(),
        col12: z.string(),
        col13: z.string(),
    }))
})

export type ImportMaterial = z.infer<typeof schema>
