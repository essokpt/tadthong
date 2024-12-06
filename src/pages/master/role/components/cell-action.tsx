import { AlertModal } from "@/components/custom/alert-modal";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "./schema";
import { Edit, Trash } from "lucide-react";
//import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { deleteRole, getPermissions } from "@/services/roleApi";
import { EditModal } from "./edit-modal";
import { RoleType } from "./type";
import { AccessPermission, Permission } from "types/permission";
import { ApiContext } from "@/components/layouts/api-context";
import { ApiType } from "types/api";
import { IconEye, IconSettingsDown } from "@tabler/icons-react";
import usePermission from "@/hooks/use-permission";

// interface CellActionProps {
//   data: Employee;
// }
interface DataTableRowActionsProps{
    row: Role
  }

  const initialValue = {
    id: 0,   
    name: '',
    description: '',
    status: '',
    permission : []   
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [isEdit, setIsEdit] = useState(false);
  const [isMounted, setIsMounted] = useState(false)
  const [editValue, setEditValue] = useState<RoleType>(initialValue)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [editble, setEditble] = useState(false);

  const [newPermissionsRole, setNewPermissionsRole] = useState<
    AccessPermission[]
  >([])

  const { setRefresh } = useContext(ApiContext) as ApiType
  const rule: any = usePermission('managerole')

  const addACLForm = (row: any) => {
    console.log('permission:', row.accessPermissions);
    
    const temp = permissions?.map((data) => {
       const seleted:any = row.accessPermissions?.find((item:any) => item.permission == data.name)
      // console.log('permission seleted:', seleted);
      
      let acl = {
        id: parseInt(data.id),
        permission: data.name,
        description: data.description,
        roleBranchesId: row.id,
        canCreate: seleted? seleted.canCreate : false,
        canView:  seleted? seleted.canView : false,
        canUpdate:  seleted? seleted.canUpdate : false,
        canDelete:  seleted? seleted.canDelete : false,
      }
      return acl
    
    })
    setNewPermissionsRole(temp) // Save the copy to state
  }

  
  function updateAction(row:any) { 
    addACLForm(row)
    checkUserPermission(row)  
    setIsEdit(true) 
    setEditValue(row)
    console.log('update row',permissions);  
  }

  function checkUserPermission(data:RoleType) {   
      console.log('checkUserPermission',data);  
      for (let index = 0; index < permissions.length; index++) {
        const hasPermission = data.permission.find(p => p.id == permissions[index].id)
        if(hasPermission){
          permissions[index].checked = true
        }else{
          permissions[index].checked = false
        }
      }
  }

  const onConfirm = async () => {
    setLoading(true)
    const res:any = await deleteRole(deleteId)
    if(res.status == 200) {
      console.log('deleteRole -success', res.status)      
     
    } 
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
      setRefresh(true)
    }, 1000)
  };

  async function deleteAction(row:any) {   
    setOpen(true) 
    setDeleteId(row.id)  
    setdeleteTitle(row.name)
  }
  useEffect(() => {
    setIsMounted(true)
    getPermissions().then((data) => setPermissions(data))
    //initalCheck()
  }, [])

  if (!isMounted) {
    return null
  }
  return (
    <>
     <EditModal
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}        
          data={editValue}
          role={newPermissionsRole}
          editble={!editble}
          permissions={permissions}
      />
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={deleteTitle}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconSettingsDown className="h-4 w-4 text-button" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={!rule[0]?.canView}
            onClick={() => {
              setEditble(false)
              updateAction(row)
            }}
          >
            <IconEye className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
           disabled={!rule[0]?.canUpdate}
            onClick={() => { 
              setEditble(true)
              updateAction(row)
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem disabled={row.status == 'New' ||  !rule[0]?.canDelete}
           onClick={() => deleteAction(row)}>

            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      
      </DropdownMenu>
    </>
  );
};