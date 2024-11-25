import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { StockHistory} from './schema'
import { CellAction } from './cell-action'
import { format } from 'date-fns'

export const columns: ColumnDef<StockHistory>[] = [
   
  {
    accessorKey: 'dateTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {format(row.original.dateTime,'dd-MM-yyy HH:mm')}
        
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'itemMaster.code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Code' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.itemMaster?.code}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'itemMaster.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Name' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.itemMaster?.name}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'stockType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('stockType')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'ref',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reference' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('ref')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'warehouse.branch.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Branch' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.warehouse?.branch?.branchName}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'warehouse.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Warehouse' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.warehouse?.name}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'location.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Location' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.location?.name}
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
    accessorKey: 'stockBy',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stock By' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('stockBy')}
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
