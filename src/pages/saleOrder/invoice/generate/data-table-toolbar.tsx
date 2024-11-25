import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { saleOrderItems } from './schema'
import { ConvertModal } from './convert-modal'
//import { createPurchaseOrder } from '@/services/purchaseOrderApi'
import { format } from 'date-fns'
import { createInvoice, updateSaleOrderCompleted } from '@/services/saleOrderApi'
import { useNavigate } from 'react-router-dom'
import { PlusCircleIcon, SearchIcon } from 'lucide-react'
//import { useNavigate } from 'react-router-dom';
//import { DataTableViewOptions } from './data-table-view-options'

// import { priorities, statuses } from '../mockdata/data'
// import { DataTableFacetedFilter } from './data-table-faceted-filter'


interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchData: (str: any) => void
  link: string  
}

type AlertData = {
  title: string
  error: boolean
}


const initialValue = {
  title: '',
  error: true
}



export function DataTableToolbar<TData>({
  table,
  searchData,
  link,
}: DataTableToolbarProps<TData>) {
  
  const [alertData, setAlertData] = useState<AlertData>(initialValue);
  const [isEdit, setIsEdit] = useState(false);
  const [onloading, setOnloading] = useState(false);
  const [selectItems, setSelectItem] = useState<saleOrderItems[]>([])
  const [confirmSelect, setConfirmSelect] = useState<saleOrderItems[]>([])
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  async function GenerateInvoice(){
    //setOnloading(true)
    console.log('GenerateInvoice Data:',confirmSelect);
    let today = new Date()    
    let dateCode = format(today, 'yyyy-MM-dd')
    let newCode = dateCode.split('-')
    const newInvoice = {
      code: 'INV-' + newCode[0] + newCode[1] + newCode[2],   
      currency: 'THA',
      paymentTerm: '50%- Delivery', 
      cause: '',
      total: 1,
      customerId: confirmSelect[0].saleOrder?.customerId,      
      amount: 1,
      
      createAt: format(today, 'yyyy-MM-dd'),
      status: 'New',
      remark: 'Auto generate invoice',
      invoiceItems: confirmSelect,
    }
    console.log('create invoice :', newInvoice)

    const convert: any = await createInvoice(newInvoice)
    if (convert.status == 200) {
      console.log('createInvoice-completed')
      setOnloading(false)
      setIsEdit(false)
      await updateSaleOrderCompleted(newInvoice.invoiceItems)
      navigate('/invoice', { replace: true })
    }
  }

  function getRowSeletion(t:any){
    setSelectItem([])
    if( t.getSelectedRowModel().rows.length > 0){
      for (let index = 0; index < t.getSelectedRowModel().rows.length; index++) {
        const selectData = t.getSelectedRowModel().rows[index].original       
        selectItems.push(selectData)        
      }
      setConfirmSelect([...selectItems])
      console.log('row selected:',selectItems);
    }

    //check invalid vender
    if(selectItems.length > 0){
       const checkCustomerId = selectItems[0].saleOrder.customerId
       const invalidVender = selectItems.filter(item => item.saleOrder.customerId != checkCustomerId)
    
      if(invalidVender.length > 0){
        setAlertData({
          title : 'Invalid Customer please try again',
          error : true
        })
      }else{
        setConfirmSelect([...selectItems])
        setAlertData({
          title : 'Ready to generate....',
          error : false
        })
      }
    
    //   setIsEdit(true)
    }
    setIsEdit(true)
  }
 

  const reset = () => {
    searchData('')
    setQuery('')
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <Button
          variant='outline'
          size='sm'        
          className='h-8 px-2 lg:px-3'
          onClick={() => searchData(query)}
        >
          <SearchIcon className='mr-2 h-4 w-4' />
          Search
        </Button>
      

        {query && (
          <Button variant='ghost' onClick={reset} className='h-8 px-2 lg:px-3'>
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      {link && (
      <Button
        variant='outline'
        size='sm'
        className='h-8 border bg-button text-white'
        onClick={() => navigate(link)}
      >
        <PlusCircleIcon className='mr-2 h-4 w-4' />
        New
      </Button>
      )}
      <Button
        variant='button'
        size='sm'
        className='h-8 border'   
        onClick={()=>getRowSeletion(table)}
      >
    
        Generate Invoice
      </Button>
     
      <ConvertModal
          loading={onloading}
          isOpen={isEdit}
          onClose={() => {setIsEdit(false); setOnloading(false)}}         
          data={alertData}
          onConfirm={GenerateInvoice}
      />
    </div>
  )
}
