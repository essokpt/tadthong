import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { WeightScalePrice} from '../components/schema'
import { CellAction } from './cell-action'
import { format } from 'date-fns'

export const columns: ColumnDef<WeightScalePrice>[] = [
   
  {
    accessorKey: 'priceNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price Number' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('priceNumber')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'inEffectiveDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='In Effective Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            { format(row.original.inEffectiveDate, 'dd-MM-yyy')}

          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'outEffectiveDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Out Effective Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {/* {row.getValue('outEffectiveDate')} */}
          { format(row.original.outEffectiveDate, 'dd-MM-yyy')}

          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'createAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Create Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          { format(row.original.createAt, 'dd-MM-yyy')}


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
