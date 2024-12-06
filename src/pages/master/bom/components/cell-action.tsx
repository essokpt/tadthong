import { AlertModal } from "@/components/custom/alert-modal";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bom } from "./schema";
import { Edit, Trash } from "lucide-react";
import { useContext, useState } from "react";
import { EditModal } from "./edit-modal";
import { BomType } from "./type";
import { deleteBom } from "@/services/bomApi";
import { ApiContext } from "@/components/layouts/api-context";
import { ApiType } from "types/api";
import { IconEye, IconSettingsDown } from "@tabler/icons-react";
import usePermission from "@/hooks/use-permission";

interface DataTableRowActionsProps{
    row: Bom
  }

const initialValue = {
  id: '',
  code: '',
  name: '',
  description: '',
  quantity: 0,
  scrap: 0,
  inEffectiveDate: '',
  outEffectiveDate: '',
  status: '',
  bomItems: [],
  itemMasterId: 0,
  selectedItemmaster: '',
  itemMaster: {
    code: ''
  }
 
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [isEdit, setIsEdit] = useState(false);
  const [editble, setEditble] = useState(false);
  const [editValue, setEditValue] = useState<BomType>(initialValue)
  const { setRefresh } = useContext(ApiContext) as ApiType
  const rule: any = usePermission('bom')

  function updateAction(row:any) {   
    setIsEdit(true) 
    row.selectedItemmaster = row.itemMaster.name
    setEditValue(row)
    console.log('update row',row);  
  }

  const onConfirm = async () => {
    const res:any = await deleteBom(deleteId)
    if(res.status == 200) {
      console.log('deleteCustomer -success', res.status)      
      setOpen(false)
    } 
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  };

  function deleteAction(row:any) {   
    setOpen(true) 
    setDeleteId(row.id)  
    setdeleteTitle(row.name)
  }

  function closeEditModal() {
    setIsEdit(false)
    setRefresh(true)
   
  }

  return (
    <>
      <EditModal
          isOpen={isEdit}
          onClose={closeEditModal}        
          data={editValue}
          editble={!editble}
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
          <DropdownMenuItem 
           disabled={!rule[0]?.canDelete}
            onClick={() => deleteAction(row)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      
      </DropdownMenu>
    </>
  );
};