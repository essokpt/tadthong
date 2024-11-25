import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { SaleOrder } from './schema'
import { CellAction } from './cell-action'
import { format } from 'date-fns'
import { AppStatus } from '@/components/custom/status'

export const columns: ColumnDef<SaleOrder>[] = [
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
    accessorKey: 'customer.code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Code' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.customer?.code}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'customer.companyName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.customer?.companyName}
          </span>
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'vat',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Vat' />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex space-x-2'>

  //         <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
  //           {row.getValue('vat')}
  //         </span>
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('amount')}
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
            {row.original.user?.firstName}
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
      return <AppStatus status={row.original.status?.toLocaleLowerCase()} />
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction row={row.original} />,
  },
]
