import { AlertModal } from '@/components/custom/alert-modal'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ImportMaterial } from './schema'
import { Edit, Trash } from 'lucide-react'
import { useContext, useState } from 'react'
import { EditModal } from './edit-modal'
import { deleteMaterial } from '@/services/materialApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { IconEye, IconSettingsDown } from '@tabler/icons-react'
import usePermission from '@/hooks/use-permission'
//import { ApproveModal } from '@/components/custom/approve-modal'
//import { createApproveMaterial } from '@/services/approveMaterialApi'
//import { format } from 'date-fns'

interface DataTableRowActionsProps {
  row: ImportMaterial
}

const initialValue = {
  id: '',
  code: '',
  importDate: '',
  approvedBy: '',
  remark: '',
  status: '',
  stockIn: '',
  user: {
    firstName: '',
    lastName: '',
  },
  locationId: 0,
  location: {
    id: 0,
    name: '',
  },
  materials: [],
}

// const initialApprove = {
//   id: 0,
//   code: '',
//   name: '',
// }

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  // const [canEdit, setCanEdit] = useState(false)
  const [editble, setEditble] = useState(false)

  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)

  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<ImportMaterial>(initialValue)

  const { setRefresh } = useContext(ApiContext) as ApiType
  const rule: any = usePermission('material')

  function updateAction(row: any) {
    setIsEdit(true)
    setEditValue(row)
    console.log('update row', row)
  }

  const onConfirm = async () => {
    setLoading(true)
    const res: any = await deleteMaterial(deleteId)
    if (res.status == 200) {
      console.log('deleteMaterial -success', res.status)
    }
    setTimeout(() => {
      setOpen(false)
      setRefresh(true)
      setLoading(false)
    }, 1000)
  }

  // const sendApprove = async () => {
  //   setLoading(true)
  //   let today = new Date()
  //   const userId: any = localStorage.getItem('userId')
  //   const newApprove = {
  //     code: `AP-${approveData.code}`,
  //     description: `Request for approve -${approveData.name}`,
  //     priority: 'medium',
  //     status: 'Pending',
  //     materialId: approveData.id,
  //     userId: parseInt(userId),
  //     createAt: format(today, 'yyyy-MM-dd'),
  //   }

  //   console.log('sendApprove', newApprove)
  //   const res: any = await createApproveMaterial(newApprove)
  //   if (res.status == 200) {
  //     console.log('deleteMaterial -success', res.status)
  //     setLoading(false)
  //     setOpen(false)
  //   }
  //   setTimeout(() => {
  //     setOpenApprove(false)
  //   }, 1000)
  // }

  function deleteAction(row: any) {
    setOpen(true)
    setDeleteId(row.id)
    setdeleteTitle(row.code)
  }

  function closeEditModal() {
    setIsEdit(false)
    setRefresh(true)
  }

  return (
    <>
      {/* <ApproveModal
        isOpen={openApprove}
        onClose={() => setOpenApprove(false)}
        onConfirm={sendApprove}
        loading={loading}
        title={approveTitle}
      /> */}

      <EditModal
        isOpen={isEdit}
        onClose={closeEditModal}
        data={editValue}
        isEdit={editble}
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
            <IconSettingsDown className='h-4 w-4 text-button' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={!rule[0]?.canView}
            onClick={() => {
              setEditble(false)
              updateAction(row)
            }}
          >
            <IconEye className='mr-2 h-4 w-4' /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={row.status == 'approved' || !rule[0]?.canUpdate}
            onClick={() => {
              setEditble(true)
              updateAction(row)
            }}
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={row.status != 'New' || !rule[0]?.canDelete}
            onClick={() => deleteAction(row)}
          >
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
