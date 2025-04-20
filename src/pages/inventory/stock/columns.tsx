import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { StockOnhand} from './schema'
import { toCurrency } from '@/lib/utils'

export const columns: ColumnDef<StockOnhand>[] = [
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
    accessorKey: 'location.warehouse.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Warehouse' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.location?.warehouse?.name}
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
    accessorKey: 'receiveQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {toCurrency(row.getValue('receiveQuantity'))}
          </span>
        </div>
      )
    },
  },
  
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
  
 
]
