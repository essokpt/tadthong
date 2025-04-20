import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { PurchaseOrderReport } from './schema'
import { toCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { AppStatus } from '@/components/custom/status'
//import { AppStatus } from '@/components/custom/status'

export const columns: ColumnDef<PurchaseOrderReport>[] = [
  
  {
    accessorKey: 'poNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PO-Number' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('poNumber')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'poStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PO-Status' />
    ),
    cell: ({ row }) => {   
      return  <AppStatus status={row.original.poStatus?.toLocaleLowerCase()} />

    },
  },  
 
  {
    accessorKey: 'poCreate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PO-Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('poCreate')? format(row.getValue('poCreate'), 'dd-MM-yyy') : ''}
          </span>
        </div>
      )
    },
  }, 
  
  {
    accessorKey: 'vendorName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vendor Name' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('vendorName')}
          </span>
        </div>
      )
    },
  }, 

  {
    accessorKey: 'paymentType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment Type' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('paymentType')}
          </span>
        </div>
      )
    },
  },  

  {
    accessorKey: 'deliveryDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Delivery Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('deliveryDate') ? format(row.getValue('deliveryDate'), 'dd-MM-yyy') : ''}
          </span>
        </div>
      )
    },
  }, 

  {
    accessorKey: 'itemNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Number' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('itemNumber')}
          </span>
        </div>
      )
    },
  },  

  {
    accessorKey: 'itemName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Name' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('itemName')}
          </span>
        </div>
      )
    },
  },  
  //

  
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('quantity'))}
          </span>
        </div>
      )
    },
  }, 

  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('price'))}
          </span>
        </div>
      )
    },
  }, 

  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('amount'))}
          </span>
        </div>
      )
    },
  }, 
  
  {
    accessorKey: 'quantitReceived',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity Received' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {toCurrency(row.getValue('quantitReceived'))}
          </span>
        </div>
      )
    },
  }, 

  {
    accessorKey: 'quantityRemain',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity Remain' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('quantityRemain'))}
          </span>
        </div>
      )
    },
  },
 
]
