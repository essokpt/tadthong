import { AlertModal } from "@/components/custom/alert-modal";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApproveMaterial } from "./schema";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { EditModal } from "./edit-modal";
import { ApproveMaterialType } from "./type";
import { deleteApproveMaterial } from "@/services/approveMaterialApi";

interface DataTableRowActionsProps{
    row: ApproveMaterial
  }

const initialValue = {
    id: "",
    code: '',   
    description: '',
    priority : '',
    status: '',
    comment: ''  
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState<ApproveMaterialType>(initialValue)

  function updateAction(row:any) {   
    setIsEdit(true) 
    setEditValue(row)
    console.log('update row',row);  
  }

  const onConfirm = async () => {
    const res:any = await deleteApproveMaterial(deleteId)
    if(res.status == 200) {
      console.log('deleteApproveMaterial -success', res.status)      
      setOpen(false)
    } 
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  };

  async function deleteAction(row:any) {   
    setOpen(true) 
    setDeleteId(row.id)  
    setdeleteTitle(row.code)
  }

  return (
    <>
      <EditModal
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}        
          data={editValue}
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
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => updateAction(row)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteAction(row)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      
      </DropdownMenu>
    </>
  );
};