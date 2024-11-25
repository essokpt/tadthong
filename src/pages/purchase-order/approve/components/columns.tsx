import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { PurchaseOrder} from '../../components/schema'
import { CellAction } from './cell-action'
import { format } from 'date-fns'

export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: 'createAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {format(row.original.createAt,"dd-MM-yyyy")}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PO-Code' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('code')}
          </span>
        </div>
      )
    },
  },  
  
  {
    accessorKey: 'vender.companyName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vender' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.vender.companyName}
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
            {row.getValue('deliveryDate')}
          </span>
        </div>
      )
    },
  },  
    
  {
    accessorKey: 'user.firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Create By' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.user.firstName}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('status')}
          </span>
        </div>
      )
    },
  },  
  {
    id: 'actions',
    cell: ({row}) => <CellAction row={row.original} />,
  },
]
