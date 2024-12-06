import { Button } from '@/components/custom/button'
import { Price } from './schema'
import { useState } from 'react'
import { EditModal } from './edit-modal'
//import { PriceType } from './type'
import { IconEdit } from '@tabler/icons-react'
import usePermission from '@/hooks/use-permission'

interface DataTableRowActionsProps {
  row: Price
}

const initialValue = {
  id: '',
  code: '',
  name: '',
  description: '',
  itemMasterId: 0,
  stockingUom: '',
  priceMaster: [
    {
      id: '',
      price: 0,
      customers: {
        code: '',
        companyName: '',
      },
      itemMasterId: 0,
      customersId: 0,
    },
  ],
}

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<Price>(initialValue)
  const rule: any = usePermission('price')

  function updateAction(row: any) {
    setIsEdit(true)
    setEditValue(row)
    console.log('update row', row)
  }

  return (
    <>
      <EditModal
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        data={editValue}
      />

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
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => updateAction(row)}>
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteAction(row)}>
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </>
  )
}
