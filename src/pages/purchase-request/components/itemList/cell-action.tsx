import { Button } from '@/components/custom/button'

import { PurchaseRequestItems } from './schema'
import { useState } from 'react'
//import { EditModal } from "./edit-modal";
// import { ApiContext } from '@/components/layouts/api-context'
// import { ApiType } from 'types/api'
import { IconEdit } from '@tabler/icons-react'
import { EditModal } from '../edit-modal'
import { findPurchaseRequest } from '@/services/purchaseRequestApi'
import { PurchaseRequest } from '../schema'

interface DataTableRowActionsProps {
  row: PurchaseRequestItems
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


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  // const [loading, setLoading] = useState(false)
  // const [open, setOpen] = useState(false)
  // const [deleteId, setDeleteId] = useState(null)
  // const [deleteTitle, setdeleteTitle] = useState(null)

  const [isEdit, setIsEdit] = useState(false)
  //const [editValue, setEditValue] = useState<PurchaseRequestItems>(initialValue)
  const [editValue, setEditValue] = useState<PurchaseRequest>(initialValue)

 // const { setRefresh } = useContext(ApiContext) as ApiType

  async function updateAction(row: any) {
    //setIsEdit(true)
   // setEditValue(row)
    console.log('update item row', row)
    const res:any = await findPurchaseRequest(row.purchaseRequestId)
  
    if (res.id > 0) {
      console.log('findPurchaseRequest:', res)
      setIsEdit(true)
      setEditValue(res)
    }
  }

  
  // const onConfirm = async () => {
  //   const res: any = await deletePurchaseRequest(deleteId)
  //   if (res.status == 200) {
  //     console.log('deletePurchaseRequest -success', res.status)
  //     setOpen(false)
  //   }
  //   setTimeout(() => {
  //     setLoading(false)
  //     //setRefresh(true)
  //   }, 1000)
  // }

  

  // async function deleteAction(row: any) {
  //   setOpen(true)
  //   setDeleteId(row.id)
  //   setdeleteTitle(row.code)
  // }

  function closeEditModal() {
    setIsEdit(false)
  }

  // async function updateData(row: any) {
  //   console.log('updateData', row)    
  //     const res: any = await updatePurchaseRequestItem(row)
  
  //     if (res.status == 200) {
  //       console.log('updatePurchaseItem:', res)
  //       setIsEdit(false)
  //     }
     
  // }

  return (
    <>
      <EditModal
          isOpen={isEdit}
          onClose={closeEditModal}         
          data={editValue}
          editble={true}
      />
     
      {/* <EditModal
        createData={(e) => updateData(e)}
        loading={false}
        isOpen={isEdit}
        onClose={closeEditModal}
        editData={editValue}
      /> */}
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={deleteTitle}
      /> */}

      <Button
        variant='ghost'
        className='h-8 w-8 p-0'
        onClick={() => updateAction(row)}
      >
        <IconEdit className='h-4 w-4 text-button' />
      </Button>
    </>
  )
}
