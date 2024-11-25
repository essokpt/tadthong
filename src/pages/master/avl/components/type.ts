
export interface AvlType{
    id: string
    code : string
    name :string  
    stockingUom :string
    description : string  
    itemVenderLists :  [{
        cost: number
        remark : string
        itemMasterId: number
        vender: {
            id: number
            code: string
            companyName: string
        }
    }]      
}