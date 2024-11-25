import { AlertModal } from '@/components/custom/alert-modal'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PurchaseOrder } from './schema'
import { Edit, Trash } from 'lucide-react'
import { useContext, useState } from 'react'
import { EditModal } from './edit-modal'
import { ApproveModal } from '@/components/custom/approve-modal'

import {
  deletePurchaseOrder,
  sendPurchaseOrderApprove,
} from '@/services/purchaseOrderApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { IconSettingsDown } from '@tabler/icons-react'

interface DataTableRowActionsProps {
  row: PurchaseOrder
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

// const initialApprove = {
//   id: 0,
//   code: '',
//   name: '',
// }

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [openApprove, setOpenApprove] = useState(false)
  const [approveId, setApproveId] = useState(null)
 // const [approveData, setApproveMatId] = useState(initialApprove)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [approveTitle, setApproveTitle] = useState(null)

  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<PurchaseOrder>(initialValue)

  const { setRefresh } = useContext(ApiContext) as ApiType

  function closeEditModal() {
    setIsEdit(false)
    setRefresh(true)
  }


  function updateAction(row: any) {
    setIsEdit(true)
    setEditValue(row)
    console.log('update row', row)
  }

  function approveAction(row: any) {
    setOpenApprove(true)
    //setApproveMatId(row)
    setApproveId(row.id)
    setApproveTitle(row.code)
    console.log('Approve data', row)
  }

  const onConfirm = async () => {
    setLoading(true)
    const res: any = await deletePurchaseOrder(approveId)
    if (res.status == 200) {
      console.log('deletePurchaseOrder -success', res.status)
      setOpen(false)
    }
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  }

  const sendApprove = async () => {
    setLoading(true)

    console.log('sendApprove', approveId)
    const res: any = await sendPurchaseOrderApprove(approveId)
    if (res.status == 200) {
      console.log('sendPurchaseOrderApprove -success', res.status)
      setTimeout(() => {
        setLoading(false)
        setOpen(false)
        setOpenApprove(false)
        setRefresh(true)
      }, 1000)
    }
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
      setOpenApprove(false)
    }, 1000)
  }

  async function deleteAction(row: any) {
    setOpen(true)
    setApproveId(row.id)
    setdeleteTitle(row.code)
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
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconSettingsDown className="h-4 w-4 text-button" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            disabled={
              row.status == 'Wait Approve' ||
              row.status == 'Approved' ||
              row.status == 'Completed'            
            }
            onClick={() => approveAction(row)}
          >
            <Edit className='mr-2 h-4 w-4' /> Send Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              row.status == 'Wait Approve' ||
              row.status == 'Approved' || 
             row.status == 'Completed'
            }
            onClick={() => updateAction(row)}
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              row.status == 'Wait Approve' ||
              row.status == 'Approved' ||
              row.status == 'Completed'
            }
            onClick={() => deleteAction(row)}
          >
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
