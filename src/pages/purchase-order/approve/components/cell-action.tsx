import { AlertModal } from "@/components/custom/alert-modal";
import { Button } from "@/components/custom/button";

import { useContext, useState } from "react";
import { EditModal } from "./edit-modal";
import { PurchaseOrder } from "../../components/schema";
import { ApproveModal } from "@/components/custom/approve-modal";
import { createApproveMaterial } from "@/services/approveMaterialApi";
import { format } from "date-fns";
import { deletePurchaseRequest } from "@/services/purchaseRequestApi";
import { IconEyeCheck } from "@tabler/icons-react";
import { ApiContext } from "@/components/layouts/api-context";
import { ApiType } from "types/api";

interface DataTableRowActionsProps{
    row: PurchaseOrder
  }

  const initialValue = {
    id: '',
    code: '',
    description: '',
    branchId: 0,
    refPr: '',
    createAt: '',
    userId: '',
    venderId: '',
    received: 0,
    balance: 0,
    cause: '',
    currency: '',
    paymenTerm: '',
    paymentType: '',
    deliveryDate: '',
    vender: {
      code: '',
      companyName: '',
    },
    user: {
      firstName: '',
    },
    locationId: 0,
    location: {
      id: 0,
      name: '',
    },
    remark: '',
    status: '',
    purchaseOrderItems: [],
    amount: 0,
    discount : 0,   
    vat : 0,
    paymentTerm : '',
    purchaseOrderFileAttach: [{
      id: 0,
      fileName: '',
      path: ''
  }]
  }

const initialApprove = {
  id : 0,
  code : '',
  name: ''
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [deleteId, setDeleteId] = useState(null)
  const [approveData, setApproveId] = useState(initialApprove)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [approveTitle, setApproveTitle] = useState(null)

  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState<PurchaseOrder>(initialValue)
const { setRefresh } = useContext(ApiContext) as ApiType
  function updateAction(row:any) {   
    setIsEdit(true) 
    setEditValue(row)
    console.log('update row',row);  
  }

  // function approveAction(row:any) {   
  //   setOpenApprove(true) 
  //   setApproveMatId(row)
  //   setApproveTitle(row.name)   
  //   console.log('Approve data',row);  
  // }

  const onConfirm = async () => {
    const res:any = await deletePurchaseRequest(deleteId)
    if(res.status == 200) {
      setDeleteId(null)
      console.log('deletePurchaseRequest -success', res.status)      
      setOpen(false)
      setdeleteTitle(null)
      setApproveTitle(null)
    } 
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  };

  const sendApprove = async () => {
    setLoading(true)
    let today = new Date();
    const userId:any = localStorage.getItem('userId')
    const newApprove = {
      code: `AP-${approveData.code}`,
      description : `Request for approve -${approveData.name}`,
      priority : 'medium',
      status: 'Pending',
      materialId : approveData.id,
      userId : parseInt(userId),
      createAt: format(today, 'yyyy-MM-dd')
    }

    console.log('sendApprove',newApprove)     
    const res:any = await createApproveMaterial(newApprove)
    if(res.status == 200) {
      console.log('deleteMaterial -success', res.status)    
      setLoading(false)  
      setOpen(false)
      setApproveId(initialApprove)
    } 
    setTimeout(() => {
     
      setOpenApprove(false)
    }, 1000)
  };

  function closeEditModal() {
    setIsEdit(false)
    setRefresh(true)
  }


  // async function deleteAction(row:any) {   
  //   setOpen(true) 
  //   setDeleteId(row.id)  
  //   setdeleteTitle(row.code)
  // }

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
       <Button
        size='icon'
        variant='outline'
        className='rounded-full bg-primary text-white'
        onClick={() => updateAction(row)}
      >
        <IconEyeCheck size={20} />
      </Button>
      {/* <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
          { row.status == "pending" ?
          (
            <DropdownMenuItem
            onClick={() => approveAction(row)}
          >
            <Edit className="mr-2 h-4 w-4" /> Send Approve
          </DropdownMenuItem>

          ) :
          <></>

          }
          <DropdownMenuItem
            onClick={() => updateAction(row)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteAction(row)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      
      </DropdownMenu> */}
    </>
  );
};