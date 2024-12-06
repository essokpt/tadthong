import { Button } from '@/components/custom/button'

import { PurchaseOrderItems } from './schema'
import { useState } from 'react'
//import { EditModal } from "./edit-modal";
// import { ApiContext } from '@/components/layouts/api-context'
// import { ApiType } from 'types/api'
import { IconEdit } from '@tabler/icons-react'
import { EditModal } from '../edit-modal'
import { PurchaseOrder } from '../schema'
import { findPurchaseOrder } from '@/services/purchaseOrderApi'

interface DataTableRowActionsProps {
  row: PurchaseOrderItems
}

const initialValue = {
  id: '',
  code: '',
  description: '',
  refPr: '',
  createAt: '',
  userId: '',
  approveBy: '',
  venderId: '',
  received: 0,
  balance: 0,
  cause: '',
  currency: '',
  paymentTerm: '',
  paymentType: '',
  deliveryDate: '',
  branchId: 0,
  amount: 0,
  discount : 0,
  vat : 0,
  vender: {
    code: '',
    companyName: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    zipcode: '',
    country: '',
    paymentType: '',
    phone: '',
    phoneExt: '',
    fax: '',
    faxExt: '',
    tax: '',
    email: '',
    contactName: '',
    venderBillings: {
      id: 0,
      code: '',
      name: '',
      address: '',
      district: '',
      subDistrict: '',
      province: '',
      zipcode: '',
      country: '',
      phone: '',
    },
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
  purchaseOrderFileAttach: [{
    id: 0,
    fileName: '',
    path: ''
}],
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  
  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<PurchaseOrder>(initialValue)
 // const { setRefresh } = useContext(ApiContext) as ApiType

  async function updateAction(row: any) {
    
    console.log('update row item', row)

    const res: any = await findPurchaseOrder(row.purchaseOrderId)
    if (res.id > 0) {
      console.log('findPurchaseOrder -success', res)
      
      setEditValue(res)
      setIsEdit(true)
    }
  
  }

  function closeEditModal() {
    setIsEdit(false)
  }

  return (
    <>
      <EditModal
        isOpen={isEdit}
        onClose={closeEditModal}
        data={editValue}
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
