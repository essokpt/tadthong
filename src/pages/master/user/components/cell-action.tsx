import { AlertModal } from '@/components/custom/alert-modal'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from './schema'
import { Edit, Trash } from 'lucide-react'
//import { useNavigate } from "react-router-dom";
import { useContext, useState } from 'react'
import { deleteUser, findUser } from '@/services/userApi'
import { EditModal } from './edit-modal'
import { useNavigate } from 'react-router-dom'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { IconSettingsDown } from '@tabler/icons-react'
import usePermission from '@/hooks/use-permission'

type UserRoleBanch = {
  id: string
  userId: number
  branchId: number
  roleBranchesId: number
  branch: {
    id: string
    branchName: string
    code: string
  }
  roleBranches: {
    id: string
    name: string
  }
}

interface DataTableRowActionsProps {
  row: User
}

const initialValue = {
  id: '',
  firstName: '',
  lastName: '',
  address: '',
  phoneNumber: '',
  email: '',
  userId: '',
  employeeId: '',
  province: '',
  zipcode: '',
  country: '',
  idCard: '',
  dateOfBirth: '',
  dateOfHire: '',
  division: '',
  status: '',
  username: '',
  password: '',
  userImage: '',
  district: '',
  subDistrict: '',
}

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<User>(initialValue)
  const [user, setUser] = useState<UserRoleBanch[]>([])
  const navigate = useNavigate()
  const { setRefresh } = useContext(ApiContext) as ApiType

  const rule: any = usePermission('user')

  function updateAction(row: any) {
    findUser(row.id).then((data) => setUser(data))
    setIsEdit(true)
    setEditValue(row)
    console.log('update row', row)
  }

  const closeModal = () => {
    setIsEdit(false)
    navigate('/master/user', { replace: true })
  }

  const onConfirm = async () => {
    setLoading(true)
    const res: any = await deleteUser(deleteId)
    if (res.status == 200) {
      console.log('deleteUser -success', res.status)
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
    setdeleteTitle(row.firstName)
  }

  return (
    <>
      <EditModal
        isOpen={isEdit}
        onClose={closeModal}
        data={editValue}
        rolebranch={user}
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
            disabled={!rule[0]?.canUpdate}
            onClick={() => updateAction(row)}
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!rule[0]?.canDelete}
            onClick={() => deleteAction(row)}
          >
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
