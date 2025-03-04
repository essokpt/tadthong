
export interface PurchaseOrderType{
    id: string
    code: string   
    description: string
    refPr: string
    createAt: string
    venderId: string
    status : string
    userId : string
    remark : string

   
}

export interface ItemList {
    id: number
    itemMasterId: string
    selectedItemMaster : string
    itemMaster: {
      id: string
      code: string
      name: string
    }
    saleOrderId: number
    quantity: number
    unitPrice: number
    amount: number
    underCutPrice: number
    cuttingWeight: number
    afterCutPrice: number
    afterCutQuantity: number
    afterAmount: number
    sourceHumidity: number
    destinationHumidity: number
    destinationWeighingScale: string
    remark: string
    humidity: number
    adulteration : number
    other: number
    weighingMoney: number
    shipDown : number
    cashOther :  number
    uomType: string
  }

  export interface UomType{ 
    name: string   
      
}

export interface CarRegistration{ 
  id: number
  carNo: string   
  description: string  
}



