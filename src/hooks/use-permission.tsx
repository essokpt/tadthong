import { useEffect, useState } from 'react'
import { PermissionRole } from 'types/permission'

// const init = {
//   canCreate : false,
//   canView : false,
//   canUpdate : false,
//   canDelete : false
// }

export default function usePermission( args: string) {
 // const [access, setAcl] = useState<PermissionRole[]>([])
  const [rule, setRule] = useState<PermissionRole>()
  const [resource, setResource] = useState(args)
 
  function findModule(){
    const aclRule:any = localStorage.getItem('accessPermissions')
    const aclPermission = JSON.parse(aclRule)
    const isPermission = aclPermission.find((a:any) => a.permission == resource)
  
    if(isPermission){ 
      setRule(isPermission)
     // return isPermission
     console.log('find resource', isPermission);   
    }   
  }
  useEffect(() => {
    setResource(args)
    findModule()
   
  }, [])

  return [ rule ] as const 
 
}
