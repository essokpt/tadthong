import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { ImportMaterial } from './schema'
import { CellAction } from './cell-action'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { AppStatus } from '@/components/custom/status'

export const columns: ColumnDef<ImportMaterial>[] = [
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
    accessorKey: 'importDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Import Date' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {format(row.original.importDate, 'dd-MM-yyyy')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'fileName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='File Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('fileName')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'user.firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Import By' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.user.firstName}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            <Badge
              className='bg-new text-white hover:bg-wait'
              variant='default'
            >
              {formatCurrency(row.getValue('amount'))}
            </Badge>
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
            <AppStatus status={row.original.status?.toLocaleLowerCase()} />
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'approvedBy',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Approved/Reject By' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('approvedBy')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'remark',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Comment' />
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
