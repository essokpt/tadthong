// import { AlertModal } from "@/components/custom/alert-modal";
// import { Button } from "@/components/custom/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { StockHistory } from "./schema";
// import { Trash } from "lucide-react";
// import { useState } from "react";
// import { deleteHistory } from "@/services/inventoryApi";
// import { IconSettingsDown } from "@tabler/icons-react";

interface DataTableRowActionsProps{
    row: StockHistory
  }

export const CellAction: React.FC<DataTableRowActionsProps> = () => {
  // const [loading, setLoading] = useState(false);
  // const [open, setOpen] = useState(false);
  // const [deleteId, setDeleteId] = useState(null)
  // const [deleteTitle, setdeleteTitle] = useState(null)
  
  // const onConfirm = async () => {
  //   const res:any = await deleteHistory(deleteId)
  //   if(res.status == 200) {
  //     console.log('deleteHistory -success', res.status)      
  //     setOpen(false)
  //   } 
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 1000)
  // };

  // async function deleteAction(row:any) {   
  //   setOpen(true) 
  //   setDeleteId(row.id)  
  //   setdeleteTitle(row.stockType + row.ref)
  // }

  return (
    <>
    
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={deleteTitle}
      /> */}
      {/* <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconSettingsDown className="h-4 w-4 text-button" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

         
          <DropdownMenuItem onClick={() => deleteAction(row)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      
      </DropdownMenu> */}
    </>
  );
};