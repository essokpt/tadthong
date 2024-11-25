import { Button } from '@/components/custom/button'
import { useState } from 'react'
import { PurchaseRequestItem } from './schema'
import { IconEdit } from '@tabler/icons-react'
import { EditItemModal } from './editItem-modal'

interface DataTableRowActionsProps {
  row: PurchaseRequestItem
}

const initialValue = {
  id: '',
  specification: '',
  quantity: 0,
  price:0,
  total:0,
  amount : 0,
  includeVat : 0,   
  venderId: '',
  vender: {
      code: '',
      companyName : '',
      currency : '',
      paymentTerm : '',
      venderType : '',
  },
  itemMaster: {
      code: '',
      name: ''          

  },
  purchaseRequests: {
      code: '',
      locationId : 0,
  },        
  remark: '',   
  status: '',
}

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
 
  
  const [isEdit, setIsEdit] = useState(false);

  const [editValue, setEditValue] = useState<PurchaseRequestItem>(initialValue)

  function updateAction(row: any) {
   
    setIsEdit(true)
    setEditValue(row)
   
    console.log('update row', row)
  }

  return (
    <>
     <EditItemModal
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}                  
          editData={editValue}
        />
      
     
      <Button
        size='icon'
        variant='ghost'
        className='rounded-full'
        onClick={() => updateAction(row)}
      >
        <IconEdit size={20} />
      </Button>
    </>
  )
}
