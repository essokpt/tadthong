import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { WorkOrderReport } from './schema'
import { toCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { AppStatus } from '@/components/custom/status'
//import { AppStatus } from '@/components/custom/status'

export const columns: ColumnDef<WorkOrderReport>[] = [
  
  {
    accessorKey: 'woNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='WO-Number' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('woNumber')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'cause',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cause' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('cause')}
          </span>
        </div>
      )
    },
  },  
 
  {
    accessorKey: 'woDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='WO-Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {format(row.getValue('woDate'), 'dd-MM-yyy')}
          </span>
        </div>
      )
    },
  }, 
  
  {
    accessorKey: 'itemNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item No' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('itemNo')}
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
    accessorKey: 'unit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Unit' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('unit')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'woStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='WO-Status' />
    ),
    cell: ({ row }) => {   
      return  <AppStatus status={row.original.woStatus?.toLocaleLowerCase()} />
    }
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
            {toCurrency(row.getValue('quantity'))}
          </span>
        </div>
      )
    },
  }, 
  
  {
    accessorKey: 'quantityReceived',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity Received' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {toCurrency(row.getValue('quantityReceived'))}
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
