import { Button } from '@/components/custom/button'

import { Avl } from './schema'
import { useContext, useState } from 'react'
import { EditModal } from './edit-modal'
import { IconEdit } from '@tabler/icons-react'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import usePermission from '@/hooks/use-permission'
//import Venders from "../../supplier";

interface DataTableRowActionsProps {
  row: Avl
}

const initialValue = {
  id: '',
  code: '',
  name: '',
  stockingUom: '',
  description: '',
  itemVenderLists: [
    {
      id: '',
      cost: 0,
      remark: '',
      itemMasterId: 0,
      vender: {
        id: 0,
        code: '',
        companyName: '',
      },
    },
  ],
}

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<Avl>(initialValue)

  const { setRefresh } = useContext(ApiContext) as ApiType
  const rule: any = usePermission('avl')

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
      <EditModal isOpen={isEdit} onClose={closeEditModal} data={editValue} />

      <Button
        disabled={!rule[0]?.canUpdate}
        size='icon'
        variant='outline'
        className='rounded-full bg-primary text-white'
        onClick={() => updateAction(row)}
      >
        <IconEdit size={20} />
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
  )
}
