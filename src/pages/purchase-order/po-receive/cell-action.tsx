//import { AlertModal } from '@/components/custom/alert-modal'
import { Button } from '@/components/custom/button'
import { PurchaseOrder } from '../components/schema'
import { useContext, useState } from 'react'
import { ReceiveModal } from './receive-modal'
import { IconEdit } from '@tabler/icons-react'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'

interface DataTableRowActionsProps {
  row: PurchaseOrder
}

const initialValue = {
  id: '',
  code: '',
  description: '',
  refPr: '',
  createAt: '',
  userId: '',
  venderId: '',
  branchId: 0,
  received: 0,
  balance: 0,
  cause: '',
  currency: '',
  paymenTerm: '',
  paymentType: '',
  deliveryDate: '',
  vender: {
    code: '',
    companyName: '',
  },
  user: {
    firstName: '',
  },
  locationId: 0,
  location: {
    id: 0,
    name: '',
  },
  remark: '',
  status: '',
  purchaseOrderItems: [],
  paymentTerm: '',
  amount: 0,
  discount :0,  
  vat :0,
  purchaseOrderFileAttach: [{
    id: 0,
    fileName: '',
    path: ''
}]
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  //const [loading, setLoading] = useState(false)
  //const [open, setOpen] = useState(false)
  //const [deleteId, setDeleteId] = useState(null)
  //const [deleteTitle, setdeleteTitle] = useState(null)

  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<PurchaseOrder>(initialValue)
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
      
      <ReceiveModal
        isOpen={isEdit}
        onClose={closeEditModal}
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
        <IconEdit size={15} />
      
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
            
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteAction(row)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      
      </DropdownMenu> */}
    </>
  )
}