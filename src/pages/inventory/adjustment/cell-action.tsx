import { AlertModal } from "@/components/custom/alert-modal";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Adjustment } from "./schema";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { EditModal } from "./edit-modal";
import { IconSettingsDown } from "@tabler/icons-react";

interface DataTableRowActionsProps{
    row: Adjustment
  }

const initialValue = {
  id: 0,
  date: '', 
  createAt: '', 
  code: '',
  remark: '',
  userId: 0,
  adjustmentReason: {
    desc : ''
  },
  user: {
    firstName: '',
   },
  inventoryAdjustItems: [{  
    id: 0,
    stockOnHandId: 0,
    stockOnHand:{
      itemMasterId: 0,
      itemMaster: {
        id: 0,
        code: '',
        name: ''
      }
    },  
    quantity: 0,
    flag: 0
  }] 
  
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState<Adjustment>(initialValue)

  function updateAction(row:any) {   
    setIsEdit(true) 
    setEditValue(row)
    console.log('update row',row);  
  }

  const onConfirm = async () => {
    console.log('deleteForecast -success',deleteId)      

    // const res:any = await deleteForecast(deleteId)
    // if(res.status == 200) {
    //   console.log('deleteForecast -success', res.status)      
    //   setOpen(false)
    // } 
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  };

  async function deleteAction(row:any) {   
    setOpen(true) 
    setDeleteId(row.id)  
    setdeleteTitle(row.planDate + row.itemMaster?.code + row.customer?.code)
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
            <Edit className="mr-2 h-4 w-4" /> Detail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteAction(row)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      
      </DropdownMenu>
    </>
  );
};