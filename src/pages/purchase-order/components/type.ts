
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

export interface PurchaseOrderItemType {   
    id: number   
    purchaseOrderId : number 
    itemName: string   
    itemMasterId : string      
    quantity: number       
    specification: string
    discountPercent: number
    discountUnit: number
   // discountTotal: number
   // vat: number
    remark: string
    price:number
    //amount : number           
    // itemMaster: {
    //     code: string
    //     name: string   
    // }    
}


