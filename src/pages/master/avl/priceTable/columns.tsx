import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { VenderList } from './schema'
import { CellAction } from './cell-action'
//import { CellAction } from './cell-action'

export const columns: ColumnDef<VenderList>[] = [
  
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vender Code' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.vender.code}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vender Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.original.vender?.companyName}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: 'cost',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cost' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {parseFloat(row.getValue('cost')).toFixed(2)}
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
    cell: ({ row }) => <CellAction row={row.original} />,
  },
]
