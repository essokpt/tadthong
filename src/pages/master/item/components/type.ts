import { PriceType } from "../../price/components/type"
import { VenderType } from "../../vender/components/type"

export interface ItemType{
    id: string
    code: string
    name: string
    description: string
    status: string
    itemCategoryId: string
    itemTypeId: string
    locationId: string
    itemGroupId: string
    category: string
    type: string
    subCategory1: string
    subCategory2: string
    subCategory3: string
    brand: string
    size: string
    model: string
    feature: string 
    material: string 
    specification: string   
    group : string
    purchaseLeadTime : string
    manufacturingLeadTime : string
    weight : string
    safetyStock : string
    stockingUom : string
    cubicVolumn : string
    lenght : string
    width : string
    height : string
    standardCost : number
    averageCost : number
    defualtLocation: string 
    combineMtFlag : boolean
    lotControlFlag : boolean
    shefLifeDay : string
    specialInstruction : string
    alternalUom: string
    priceMaster : PriceType []
    venders : VenderType []   
    itemMasterFileAttach: [{
        id : number
        fileName : string
        path: string
    }]
    itemType : {
        id : number
        name : string
    }
    location : {
        id : number
        name : string
    }
    itemGroup : {
        id : number
        name : string
    }
    itemCategory : {
        id : number
        name : string
    }
}


