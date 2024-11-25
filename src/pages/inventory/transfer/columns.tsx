import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { Transfer} from './schema'
import { CellAction } from './cell-action'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<Transfer>[] = [
  {
    accessorKey: 'createAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('createAt')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Code' />
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
    accessorKey: 'warehouseDestination?.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='From Warehouse' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.warehouseDestination?.name}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'locationDestination?.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='From Location' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.locationDestination?.name}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'transferItems',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          <Badge className='border-primary hover:bg-button hover:border-button' >{row.original.transferItems?.length > 0 ? row.original.transferItems?.length : 0}</Badge>
          </span>
        </div>
      )
    },
  },   
 
  {
    accessorKey: 'remark',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Remark' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('remark')}
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
