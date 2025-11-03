import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { CellAction } from './cell-action'
import { ExpenseInterface } from './type'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'

export const columns: ColumnDef<ExpenseInterface>[] = [
  {
    accessorKey: 'createAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
           {format(row.original.createAt, 'dd-MM-yyyy')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'expenseMonth',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Month' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('expenseMonth')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'expenseType?.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Expense Type' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.expenseType?.name}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Value' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {formatCurrency(row.original.value)}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'actualDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Actual Date' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('actualDate')}
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
