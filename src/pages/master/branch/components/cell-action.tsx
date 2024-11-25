//import { AlertModal } from '@/components/custom/alert-modal'
import { Button } from '@/components/custom/button'

import { Branches } from './schema'
import { useState } from 'react'
//import { deleteBranch } from '@/services/branchApi'
import { EditModal } from './edit-modal'
import { BranchType } from './type'
import { IconEdit } from '@tabler/icons-react'

interface DataTableRowActionsProps {
  row: Branches
}

const initBranch = {
  id: 0,
  code: '',
  branchName: '',
  address: '',
  district: '',
  subDistrict: '',
  province: '',
  zipcode: '',
  country: '',
  phone: '',
  fax: '',
  tax: '',
  email: '',
  remark: '',
  ext: '',
  attn: '',
  status: '',
  companyId: 0,
}

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
 // const [loading, setLoading] = useState(false)
//  const [open, setOpen] = useState(false)
 // const [deleteId, setDeleteId] = useState(null)
 // const [deleteTitle, setdeleteTitle] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<BranchType>(initBranch)

  function updateAction(row: any) {
    setIsEdit(true)
    setEditValue(row)
    console.log('update row', row)
  }

  // const onConfirm = async () => {
  //   const res: any = await deleteBranch(deleteId)
  //   if (res.status == 200) {
  //     console.log('deleteCustomer -success', res.status)
  //     setOpen(false)
  //   }
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 1000)
  // }

  // async function deleteAction(row: any) {
  //   setOpen(true)
  //   setDeleteId(row.id)
  //   setdeleteTitle(row.branchName)
  // }

  return (
    <>
      <EditModal
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        data={editValue}
      />
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={deleteTitle}
      /> */}

      <Button
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
