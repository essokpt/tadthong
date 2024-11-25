import { AlertModal } from "@/components/custom/alert-modal";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PurchaseRequest } from "./schema";
import { Edit, Trash } from "lucide-react";
import { useContext, useState } from "react";
import { EditModal } from "./edit-modal";
import { ApproveModal } from "@/components/custom/approve-modal";
import { approvePurchaseRequest, deletePurchaseRequest } from "@/services/purchaseRequestApi";
import { ApiContext } from "@/components/layouts/api-context";
import { ApiType } from "types/api";
import { IconSettingsDown } from "@tabler/icons-react";

interface DataTableRowActionsProps{
    row: PurchaseRequest
  }

const initialValue = {
  id: '',
  code: '',  
  companyId : '',
  branchId : '',
  discount : 0,
  vat : 0,
  amount : 0,  
  description: '',
  requirmentDate: '',
  createAt: '',
  approveBy: '',
  userId: '',
  venderId: '',
  vender : {
    code: '',
    companyName: ''
  },
  locationId: 0,
  location : {
    id: 0,
    name: ''
  },
  user : {
    firstName: ''
  },
  remark: '',   
  status: '', 
  reason: '',
  cause: '',
  department: '',
  purchaseRequestItems : [],
  total : 0,
  sumVat : 0,
  sumQty : 0,
  purchaseRequestFileAttach: [{
    id: 0,
    fileName: '',
    path: ''
}]

}

const initialApprove = {
  id : 0,
  status : '',
  cause : ','
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [deleteId, setDeleteId] = useState(null)
  const [approveId, setApproveId] = useState(initialApprove)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [approveTitle, setApproveTitle] = useState(null)

  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState<PurchaseRequest>(initialValue)
  const { setRefresh } = useContext(ApiContext) as ApiType


  function updateAction(row:any) {   
    setIsEdit(true) 
    setEditValue(row)
    console.log('update row',row);  
  }

  function approveAction(row:any) {   
    setOpenApprove(true) 
    setApproveId(row)
    setApproveTitle(row.code)   
    console.log('Approve data',row);  
  }

  const onConfirm = async () => {
    const res:any = await deletePurchaseRequest(deleteId)
    if(res.status == 200) {
      console.log('deletePurchaseRequest -success', res.status)      
      setOpen(false)
    } 
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  };

  const sendApprove = async () => {
    setLoading(true)
    const sendData = {
      id: approveId.id,
      remark : approveId.cause,
      type: 'Wait Approve'
    }
    console.log('sendApprove', sendData)  
    const res:any = await approvePurchaseRequest(sendData)
    if(res.status == 200) {
      console.log('sendApprove', res.status)    
      setLoading(false)  
      setOpen(false)
    } 
    setTimeout(() => {     
      setOpenApprove(false)
      setRefresh(true)

    }, 1000)
  };

  async function deleteAction(row:any) {   
    setOpen(true) 
    setDeleteId(row.id)  
    setdeleteTitle(row.code)
  }

  function closeEditModal() {   
    setIsEdit(false) 
    setRefresh(true)
  }

  return (
    <>
     <ApproveModal
        isOpen={openApprove}
        onClose={() => setOpenApprove(false)}
        onConfirm={sendApprove}
        loading={loading}
        title={approveTitle}
      />
      
      <EditModal
          isOpen={isEdit}
          onClose={closeEditModal}         
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
            disabled={row.status == 'Wait Approve' || row.status == 'Approved'} 
            onClick={() => approveAction(row)}> 
            <Edit className="mr-2 h-4 w-4" />  Send Approve
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={row.status == 'Wait Approve' || row.status == 'Approved'} 
            onClick={() => updateAction(row)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem 
            disabled={row.status == 'Wait Approve' || row.status == 'Approved'} 
            onClick={() => deleteAction(row)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      
      </DropdownMenu>
    </>
  );
};