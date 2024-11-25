import { Permission } from "types/permission"

export interface RoleType{
    id: number    
    name :string
    description: string
    status: string
    permission : Permission []
}