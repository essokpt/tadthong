import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { PurchaseRequestReport } from './schema'
import { toCurrency } from '@/lib/utils'
import { format } from 'date-fns'
//import { AppStatus } from '@/components/custom/status'

export const columns: ColumnDef<PurchaseRequestReport>[] = [
  
  {
    accessorKey: 'soNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='soNumber' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('soNumber')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'custoemrCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='custoemrCode' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('custoemrCode'))}
          </span>
        </div>
      )
    },
  },  
 
  {
    accessorKey: 'soDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='soDate' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {format(row.getValue('soDate'), 'dd-MM-yyy')}
          </span>
        </div>
      )
    },
  }, 
  
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='customerName' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('customerName')}
          </span>
        </div>
      )
    },
  }, 

  {
    accessorKey: 'customerPO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='customerPO' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('customerPO')}
          </span>
        </div>
      )
    },
  },  
 
]
