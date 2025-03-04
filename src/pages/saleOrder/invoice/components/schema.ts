import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const schema = z.object({   
    id: z.number(),
    code: z.string(),    
    cause: z.string(),
    currency: z.string(),
    paymentTerm: z.string(),
    total: z.number(),
    vat: z.number(),
    amount : z.number(), 
    createAt: z.string(),
    status: z.string(),      
    customerId: z.number(),
    customer: z.object({
        code: z.string(),
        companyName : z.string(),
        attn:z.string(),
        address: z.string(),
        district: z.string(),
        subDistrict: z.string(),
        province: z.string(),
        zipcode: z.string(),
        country: z.string(),
        tax: z.string(),
        paymentTerm: z.string(),
        customerBillings: z.object({
            address: z.string(),
            district: z.string(),
            subDistrict: z.string(),
            province: z.string(),
            zipcode: z.string(),
            country: z.string(),
            contactName: z.string(),
        })
    }),
    invoiceItems: z.array(z.object({
        id: z.string(),
        saleOrderItems: z.object({
            id: z.number(),
            itemMasterId: z.number(),
            itemMaster: z.object({
                id: z.number(),
                code: z.string(),
                name: z.string(),
                stockingUom: z.string(),
                convertFactor: z.number()
            }),
            quantity: z.number(),
            unitPrice: z.number(),
            amount: z.number(),
            underCutPrice: z.number(),
            cuttingWeight: z.number(),
            afterCutPrice: z.number(),
            afterCutQuantity: z.number(),
            afterAmount: z.number(),
            sourceHumidity: z.number(),
            destinationHumidity: z.number(),
            destinationWeighingScale: z.string(),
            remark: z.string(),
            uomType: z.string(),
            saleOrder: z.object({
                id: z.number(),
                code: z.string()
            }),
        })
    }))      
       
})

export type Invoice = z.infer<typeof schema>
