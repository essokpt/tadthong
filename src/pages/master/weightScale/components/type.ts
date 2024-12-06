
export interface VenderType  { 
    id: number   
    typeName: string
    description : string
    remark: string   
}


export interface weightScaleItem {

    id: number
    selectedItem: string
    itemMasterId: number
    selectedVenderType: string
    venderTypeId: number
    price: number 
    
  }