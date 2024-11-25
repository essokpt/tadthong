import { AlertModal } from '@/components/custom/alert-modal'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WorkOrder } from './schema'
import { Edit, Trash } from 'lucide-react'
import { useContext, useState } from 'react'
import { EditModal } from './edit-modal'
import { deleteWorkOrder } from '@/services/workOrderApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { IconSettingsDown } from '@tabler/icons-react'

interface DataTableRowActionsProps {
  row: WorkOrder
}

const initialValue = {
  id: '',
  selectLocation: '',
  selectItem: '',
  unit: '',
  createBy: '',
  code: '',
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
    stockingUom: '' ,
    specification: ''    
},
  remark: '',
  status: '',
  cause: '',
  workOrderUsages: [{
    id: '', 
    itemMaster: {
        code: '',
        name: '', 
        specification: ''
    },
    quantity: 0, 
    pickingQuantity: 0, 
    pickingRequest: 0, 
    pickingDate: '', 
    pickingBalance: 0,
    remark: '',   
    status: '',      
}],
workOrderFileAttach: [{
  id: 0,
  fileName: '',
  path: ''
}]
}

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)

  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<WorkOrder>(initialValue)
  const { setRefresh } = useContext(ApiContext) as ApiType
  function updateAction(row: any) {
    row.selectLocation = row.location?.name
    row.selectItem = row.itemMaster?.name
    row.createBy = row.user.firstName
   
    setEditValue(row)
    setIsEdit(true)
    console.log('update row', row)
  }

  const onConfirm = async () => {
    setLoading(true)
    const res: any = await deleteWorkOrder(deleteId)
    if (res.status == 200) {
      console.log('deleteWorkOrder -success', res.status)
      setOpen(false)
    }
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  }

  async function deleteAction(row: any) {
    setOpen(true)
    setDeleteId(row.id)
    setdeleteTitle(row.code)
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
              row.status == 'Cancle' ||
              row.status == 'Completed' 
            }
            onClick={() => updateAction(row)}
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              row.status == 'Cancle' ||
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
