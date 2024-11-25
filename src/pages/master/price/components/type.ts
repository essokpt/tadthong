//import { CustomerType } from "../../customer/components/type" 

export interface PriceType{
    id: string
    code : string
    name :string
    description : string
    itemMasterId: string
    customerId: string
    priceMaster : [] 
}