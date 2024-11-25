export interface WareHouseType{
    id: string
    code: string
    name: string
    description: string
    address: string
    phone: string
    fax: string 
    ext: string
    attn: string
    branchId: number
    branch: {
        branchName: string
    }   
    status: string
    
}