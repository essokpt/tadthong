import { AlertModal } from '@/components/custom/alert-modal'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SaleOrder } from './schema'
import { Edit, Trash } from 'lucide-react'
import { useContext, useState } from 'react'
import { EditModal } from './edit-modal'
import { deleteSaleOrder } from '@/services/saleOrderApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { IconSettingsDown } from '@tabler/icons-react'
import usePermission from '@/hooks/use-permission'

interface DataTableRowActionsProps {
  row: SaleOrder
}

const initialValue = {
  id:0,
  selectLocation: '',
  selectCustomer: '',
  createBy: '',
  code: '',    
  poNumber: '',
  cause: '',
  carRegistration: '',
  driverName: '',
  vat:0,
  amount :0,   
  locationId:0,
  location: {
      id:0,
      name: ''
  },    
    customerId:0,
    customer: {
        code: '',
        companyName : ''
    },
    userId:0,
    user: {        
        firstName : ''
    },
    createAt: '',
    remark: '',   
    status: '',
    saleOrderItems: [{
      id: 0,
      itemMasterId: 0,
      itemMaster: {
          id: 0,
          code: "",
          name: "",
      },
      saleOrderId: 0,
      quantity: 0,
      unitPrice: 0,
      amount: 0,
      underCutPrice: 0,
      cuttingWeight: 0,
      afterCutPrice: 0,
      afterCutQuantity: 0,
      afterAmount: 0,
      sourceHumidity: 0,
      destinationHumidity: 0,
      destinationWeighingScale: "",
      humidity: 0,
      adulteration : 0,
      other: 0,
      weighingMoney: 0,
      shipDown : 0,
      cashOther :  0, 
      remark: "",
  }] ,
  saleOrderAttachFiles: [{
    id: 0,
    fileName: '',
    path: ''
}]
}

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editble, setEditble] = useState(false)
  const [approveId, setApproveId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)

  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<SaleOrder>(initialValue)
  const { setRefresh } = useContext(ApiContext) as ApiType
  const rule: any = usePermission('saleOrder')

  function updateAction(row: any) {
    row.createBy = row.user.firstName 
    row.selectCustomer = row.customer.companyName
    row.selectLocation = row.location.name

   
    setEditValue(row)
    console.log('update row', row)
    setIsEdit(true)
  }

  const onConfirm = async () => {
    setLoading(true)
    const res: any = await deleteSaleOrder(approveId)
    if (res.status == 200) {
      console.log('deleteSaleOrder -success', res.status)
      setOpen(false)
    }
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  }

  async function deleteAction(row: any) {
    setOpen(true)
    setApproveId(row.id)
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
            <IconSettingsDown className="h-4 w-4 text-button" />
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
            <Edit className='mr-2 h-4 w-4' /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              row.status == 'Wait Approve' ||
              row.status == 'Approved' ||
              row.status == 'Completed' || 
              !rule[0]?.canUpdate
            }
            onClick={() => { 
              setEditble(true)
              updateAction(row)
            }}
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
             disabled={
              row.status == 'Wait Approve' ||
              row.status == 'Approved' ||
              row.status == 'Completed' ||  !rule[0]?.canDelete
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
