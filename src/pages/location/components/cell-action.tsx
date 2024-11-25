import { AlertModal } from "@/components/custom/alert-modal";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Locations } from "./schema";
import { Edit, Trash } from "lucide-react";
import { useContext, useState } from "react";
//import { deleteBranch } from "@/services/branchApi";
import { EditModal } from "./edit-modal";
import { LocationType } from "./type";
import { deleteLocation } from "@/services/locationApi";
import { ApiContext } from "@/components/layouts/api-context";
import { ApiType } from "types/api";
import { IconSettingsDown } from "@tabler/icons-react";

interface DataTableRowActionsProps{
    row: Locations
  }

const initialValue = {
    id: 0,       
    name: "",
    description:"",
    warehouseId : 0,
    status: "",
    remark: "",
    warehouse: {
      name: ''
    }
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState<LocationType>(initialValue)
  const { setRefresh } = useContext(ApiContext) as ApiType

  function updateAction(row:any) {   
    setIsEdit(true) 
    setEditValue(row)
    console.log('update row',row);  
  }

  const onConfirm = async () => {
    setLoading(true)
    const res:any = await deleteLocation(deleteId)
    if(res.status == 200) {
      console.log('deleteLocation -success', res.status)      
      setOpen(false)
    } 
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  };

  async function deleteAction(row:any) {   
    setOpen(true) 
    setDeleteId(row.id)  
    setdeleteTitle(row.name)
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
            <IconSettingsDown className="h-4 w-4 text-button" />
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