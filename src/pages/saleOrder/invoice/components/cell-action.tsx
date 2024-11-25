import { AlertModal } from '@/components/custom/alert-modal'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Invoice } from './schema'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { deleteInvoice } from '@/services/saleOrderApi'
import { useNavigate } from 'react-router-dom'
import { IconEye, IconPrinter, IconSettingsDown } from '@tabler/icons-react'
import { EditModal } from './edit-modal'

interface DataTableRowActionsProps {
  row: Invoice
}

const initialValue = {
  id: 0,
  code: '',    
  cause: '',
  currency: '',
  paymentTerm: '',
  total: 0,
  vat: 0,
  amount : 0, 
  createAt: '',
  status: '',      
  customerId: 0,
  customer: {
      code: '',
      companyName : '',
      attn:'',
      address: '',
      district: '',
      subDistrict: '',
      province: '',
      zipcode: '',
      country: '',
      customerBillings: {
          address: '',
          district: '',
          subDistrict: '',
          province: '',
          zipcode: '',
          country: '',
          contactName: '',
      }
  },
  invoiceItems: [{
      id: '',
      saleOrderItems: {
          id: 0,
          itemMasterId: 0,
          itemMaster: {
              id: 0,
              code: '',
              name: '',
          },
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
          destinationWeighingScale: '',
          remark: '',
          saleOrder: {
              code: ''
          },
      }
  }]        
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [editValue, setEditValue] = useState<Invoice>(initialValue)

  
  const navigate = useNavigate()

  function viewAction(row: any) {
    setIsEdit(true)
    setEditValue(row)
    console.log('update row', row)
  }

  const onConfirm = async () => {
    const res: any = await deleteInvoice(deleteId)
    if (res.status == 200) {
      console.log('deleteSaleOrder -success', res.status)
      setOpen(false)
    }
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  async function deleteAction(row: any) {
    console.log('Invoice Detail: ',row);
    setOpen(true)
    setDeleteId(row.id)
    setdeleteTitle(row.code)
  }

  return (
    <>
      
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={deleteTitle}
      />

    <EditModal
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}         
          data={editValue}
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
           
            onClick={() => viewAction(row)}
          >
            <IconEye className='mr-2 h-4 w-4' /> View
          </DropdownMenuItem>
          <DropdownMenuItem            
            //onClick={() => updateAction(row)}
            onClick={() => navigate(`/invoice/view/${row.id}`)}
          >
            <IconPrinter className='mr-2 h-4 w-4' /> Print
          </DropdownMenuItem>
          <DropdownMenuItem
          
            onClick={() => deleteAction(row)}
          >
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
