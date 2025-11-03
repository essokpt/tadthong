/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Trash } from 'lucide-react'
//import { useState } from 'react'
import { IconSettingsDown } from '@tabler/icons-react'
//import usePermission from '@/hooks/use-permission'
import { ExpenseInterface } from './type'
import { AlertModal } from '@/components/custom/alert-modal'
import { useContext, useState } from 'react'
import { ApiType } from 'types/api'
import { ApiContext } from '@/components/layouts/api-context'
import { deleteExpense } from '@/services/expenseApi'
//import { EditModal } from './edit-modal'

interface DataTableRowActionsProps {
  row: ExpenseInterface
}

// const initialValue = {
//   id: 0,
//   createAt: '',
//   actualDate: '',
//   expenseMonth: '',
//   expenseTypeId: 0,
//   expenseType: {
//     id: 0,
//     name: '',
//     remark: ''
//   },
//   remark: '',
// }

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(0)
  const [title, setTitle] = useState("")

  // const rule: any = usePermission('expense')
  const { setRefresh } = useContext(ApiContext) as ApiType

  function deleteAction(row: ExpenseInterface) {
    setDeleteId(row.id)
    setTitle(`Expense of ${row.expenseMonth} Type: ${row.expenseType?.name} Value: ${row.value}`)
    setOpen(true)
    console.log('update row', row)
  }

   const onConfirm = async () => {
    setLoading(true)
     const res:any = await deleteExpense(deleteId)
    if(res.status == 200) {
      console.log('delete -success', res.status)
      setOpen(false)
    }
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  }

  return (
    <>
      {/* <EditModal
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        data={editValue}
      /> */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={title}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconSettingsDown className='h-4 w-4 text-button' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => deleteAction(row)}>
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
