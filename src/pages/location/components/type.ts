export interface LocationType{
    id: number    
    name: string
    description:string
    status: string
    remark: string
    warehouseId : number
    warehouse:{
        name: string
    }
}