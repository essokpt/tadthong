
export interface ForecastType{
    id: string
   
    quantity: number
    planDate: string
    remark:string
    customer : {
        code: string
        company: string
    }
    itemMaster: {
        code: string
        name: string
      }
    user: {
        firstName: string
    }
   
}