import { Button } from '@/components/custom/button'

import { WorkOrder } from '../components/schema'
import { useContext, useState } from 'react'
import { EditModal } from './edit-modal'
import { IconEyeCheck } from '@tabler/icons-react'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'

interface DataTableRowActionsProps {
  row: WorkOrder
}

const initialValue = {
  id: '',
  code: '',
  selectLocation: '',
  selectItem: '',
  unit: '',
  createBy: '',
  quantity: 0,
  received: 0,
  balance: 0,
  createAt: '',
  userId: '',
  locationId: 0,
  location: {
    id: 0,
    name: '',
    warehouseId: 0
  },
  user: {
    firstName: '',
  },
  itemMasterId: 0,
  itemMaster: {
    code: '',
    name: '',
    stockingUom: '',
  },
  remark: '',
  status: '',
  cause: '',
  workOrderUsages: [],
  workOrderFileAttach: [{
    id: 0,
    fileName: '',
    path: ''
}]
  
}

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  
  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<WorkOrder>(initialValue)

  const { setRefresh } = useContext(ApiContext) as ApiType
  function updateAction(row: any) {
    setIsEdit(true)
    setEditValue(row)
    console.log('update row', row)
  }

  function closeEditModal(){
    setIsEdit(false)
    setRefresh(true)
  }

  
  return (
    <>
      <EditModal
        isOpen={isEdit}
        onClose={closeEditModal}
        data={editValue}
      />

      <Button
        size='icon'
        variant='outline'
        className='rounded-full bg-primary text-white'
        onClick={() => updateAction(row)}
      >
        <IconEyeCheck size={20} />
      </Button>

      
    </>
  )
}
