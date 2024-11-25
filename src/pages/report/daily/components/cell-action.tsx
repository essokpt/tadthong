import { AlertModal } from "@/components/custom/alert-modal";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MasterReport } from "./schema";
import { Edit, Trash } from "lucide-react";
import { useContext, useState } from "react";
import { deleteForecast } from "@/services/forecastApi";
import { ApiContext } from "@/components/layouts/api-context";
import { ApiType } from "types/api";
import { IconSettingsDown } from "@tabler/icons-react";

interface DataTableRowActionsProps{
    row: MasterReport
  }

// const initialValue = {
//   id: 0,
//   planDate: '',  
//   quantity: 0,
//   userId: 0,
//   user: {
//     firstName: '',
//   },
//   customerId: 0,
//   customer: {
//     id: 0,
//     code: '',
//     companyName: ''
//   },
//   itemMasterId: 0,
//   itemMaster: {
//     id: 0,
//     code: '',
//     name: ''
//   },
//   remark: '',
//   selectedItemmaster: '',
//   selectedCustomer: '',
//   createBy: '',
 
// }


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  //const [editValue, setEditValue] = useState<MasterReport>(initialValue)
 
  const { setRefresh } = useContext(ApiContext) as ApiType

  function updateAction(row:any) {    
   
   // setEditValue(row)
    console.log('update row',row);  
    
  }

  const onConfirm = async () => {
    setLoading(true)
    const res:any = await deleteForecast(deleteId)
    if(res.status == 200) {
      console.log('deleteForecast -success', res.status)      
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
    setdeleteTitle(row.planDate + row.itemMaster?.code + row.customer?.code)
  }

  return (
    <>
     
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