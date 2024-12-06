export interface Permission{
    id: string
    name: string
    description: string
    checked : boolean
  }

  export interface PermissionRole{
    ddid: number
    permission: string
    description: string
    canView: boolean
    canCreate : boolean
    canUpdate: boolean
    canDelete : boolean
  }

  export interface AccessPermission{
    id: number
    roleBranchesId: number
    description: string
    permission: string
    canView: boolean
    canCreate : boolean
    canUpdate: boolean
    canDelete : boolean
  }

  
  export interface PermissionContext{
    permission: string
    canView: boolean
    canCreate : boolean
    canUpdate: boolean
    canDelete : boolean
  }