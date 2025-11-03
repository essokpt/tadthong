/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/custom/button'
import { PurchaseRequestItem } from './schema'
import { IconEdit } from '@tabler/icons-react'
import { EditItemModal } from './editItem-modal'
import { AlertModal } from '@/components/custom/alert-modal'
import { ApiType } from 'types/api'
import { ApiContext } from '@/components/layouts/api-context'
import { useContext, useState } from 'react'

interface DataTableRowActionsProps {
  row: PurchaseRequestItem
}

const initialValue = {
  id: '',
  specification: '',
  quantity: 0,
  price: 0,
  total: 0,
  amount: 0,
  includeVat: 0,
  venderId: '',
  vender: {
    code: '',
    companyName: '',
    currency: '',
    paymentTerm: '',
    venderType: '',
  },
  itemMaster: {
    code: '',
    name: '',
  },
  purchaseRequests: {
    code: '',
    locationId: 0,
  },
  remark: '',
  status: '',
}

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const [editValue, setEditValue] = useState<PurchaseRequestItem>(initialValue)
  const { setRefresh } = useContext(ApiContext) as ApiType

  const onConfirm = async () => {
    setLoading(true)
    //  const res:any = await deleteExpense(deleteId)
    // if(res.status == 200) {
    //   console.log('delete -success', res.status)
    //   setOpen(false)
    // }
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  }

  function updateAction(row: any) {
    setIsEdit(true)
    setEditValue(row)

    console.log('update row', row)
  }

  return (
    <>
      <EditItemModal
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        editData={editValue}
      />

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={'Test'}
      />

      <Button
        size='icon'
        variant='ghost'
        className='rounded-full'
        onClick={() => updateAction(row)}
      >
        <IconEdit size={20} />
      </Button>
    </>
  )
}
