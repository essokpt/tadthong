import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { Adjustment} from './schema'
import { CellAction } from './cell-action'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<Adjustment>[] = [
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
    accessorKey: 'inventoryAdjustItems',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Adjust Item' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          <Badge className='border-primary hover:bg-button hover:border-button' >{row.original.inventoryAdjustItems?.length > 0 ? row.original.inventoryAdjustItems?.length : 0}</Badge>
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'user.firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Adjust By' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.original.user?.firstName}
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
