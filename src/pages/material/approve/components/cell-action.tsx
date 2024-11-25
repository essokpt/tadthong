import { Button } from '@/components/custom/button'
import { ImportMaterial } from '../../components/schema'
import { useContext, useState } from 'react'
import { EditModal } from './edit-modal'
import { IconEdit } from '@tabler/icons-react'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'


interface DataTableRowActionsProps {
  row: ImportMaterial
}

const initialValue = {
  id: '',
  code: '',
  importDate: '',
  remark: '',
  status: '',
  stockIn: '',
  locationId: 0,
  location: {
    id: 0,
    name: '',
  },
  user: {
    firstName: '',
    lastName: '',
  },
  materials: [],
}



export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
 
  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<ImportMaterial>(initialValue)
  const { setRefresh } = useContext(ApiContext) as ApiType

  function updateAction(row: any) {
    setIsEdit(true)
    setEditValue(row)
    console.log('update row', row)
  }

  function closeEditModal() {
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
        <IconEdit size={20} />
      </Button>
      
    </>
  )
}
