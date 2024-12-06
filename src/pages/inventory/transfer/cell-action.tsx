import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Transfer } from "./schema";
import { Edit } from "lucide-react";
import { useState } from "react";
import { EditModal } from "./edit-modal";
import { IconSettingsDown } from "@tabler/icons-react";
import usePermission from "@/hooks/use-permission";

interface DataTableRowActionsProps{
    row: Transfer
  }

const initialValue = {
  id: 0,
  date: '',  
  code: '',
  warehouseDestination: {    
      name: ''      
  },
  locationDestination: {   
      name: '',      
  },
  remark: '',
  createAt: '',
  user: {
    firstName: '',
  },
  transferItems: [{ 
    id:0, 
    itemMasterId: 0,
    itemMaster: {
      id: 0,
      code: '',
      name: ''
    },
    location: {      
      name: ''
    },
    warehouse: {      
      name: ''
    },
    quantity: 0,
    remark: ''
  }] 
  
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  // const [loading, setLoading] = useState(false);
  // const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState<Transfer>(initialValue)

  const rule: any = usePermission('inventory')

  function updateAction(row:any) {   
    setIsEdit(true) 
    setEditValue(row)
    console.log('update row',row);  
  }
  
  return (
    <>
      <EditModal
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}
        
          data={editValue}
      />
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={deleteTitle}
      /> */}
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
            onClick={() => updateAction(row)}
          >
            <Edit className="mr-2 h-4 w-4" /> Detail
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => deleteAction(row)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      
      </DropdownMenu>
    </>
  );
};