
type Item = {    
    code: string
    description : string
    name: string   
}

type Bomitems = {
    id: string
    code: string
    description : string
    name: string
    quantity: number
    scrap: number
    inEffectiveDate: string  
    outEffectiveDate: string
    bomId: string
    itemMaster:Item
    status: string

}
export interface BomType{
    id: string
    code: string
    description : string
    name: string
    quantity: number
    scrap: number
    inEffectiveDate: string
    outEffectiveDate: string
    status:string
    bomItems : Bomitems []
    selectedItemmaster: string
    itemMasterId: number
    itemMaster: {
        code: string
      }
   
}