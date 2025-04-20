import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    description: z.string(),
    status: z.string(),
    category: z.string(),
    subCategory1: z.string(),
    subCategory2: z.string(),
    subCategory3: z.string(),
    brand: z.string(),
    type: z.string(),
    size: z.string(),
    model: z.string(),
    feature: z.string(), 
    material: z.string(), 
    specification: z.string(),   
    group : z.string(),
    purchaseLeadTime : z.string(),
    manufacturingLeadTime : z.string(),
    weight : z.string(),
    safetyStock : z.string(),
    stockingUom : z.string(),
    cubicVolumn : z.string(),
    lenght : z.string(),
    width : z.string(),
    height : z.string(),
    standardCost : z.number(),
    averageCost : z.number(),
    convertFactor : z.number(),
    locationId: z.string(), 
    location : z.object({
        id : z.number(),
        name : z.string()
    }),
    combineMtFlag : z.boolean(),
    lotControlFlag : z.boolean(),
    shefLifeDay : z.string(),
    specialInstruction : z.string(),
    itemType : z.object({
        id : z.number(),
        name : z.string()
    }),
    itemTypeId: z.string(),
    itemGroupId: z.string(),
    itemGroup : z.object({
        id : z.number(),
        name : z.string()
    }),
    alternateUom: z.string(),
    itemCategoryId: z.string(),
    itemCategory : z.object({
        id : z.number(),
        name : z.string()
    }),
    itemMasterFileAttach: z.array(z.object({
        id: z.number(),
        fileName: z.string(),
        path: z.string()
    })),
    accountCode1: z.string(),
    accountCode2: z.string(),
    accountCode3: z.string(),
    accountCode4: z.string(),
    accountCode5: z.string(),
})

export type Item = z.infer<typeof customerSchema>
