import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { PurchaseRequestReport } from './schema'
import { toCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { AppStatus } from '@/components/custom/status'

export const columns: ColumnDef<PurchaseRequestReport>[] = [
  
  {
    accessorKey: 'prCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PR-Code' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('prCode')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'prAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PR-Amount' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('prAmount'))}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'prStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PR-Status' />
    ),
    cell: ({ row }) => {   
            return <AppStatus status={row.original.prStatus?.toLocaleLowerCase()} />
      
      // return (
      //   <div className='flex space-x-2'>
         
      //     <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
      //       {row.getValue('prStatus')}
      //     </span>
      //   </div>
      // )
    },
  },  
  {
    accessorKey: 'requirmentDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Requirement Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {format(row.getValue('requirmentDate'), 'dd-MM-yyy')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'createAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Create At' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {format(row.getValue('createAt'), 'dd-MM-yyy')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'companyName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company Name' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('companyName')}
          </span>
        </div>
      )
    },
  }, 

  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('name')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('quantity')}
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
]
