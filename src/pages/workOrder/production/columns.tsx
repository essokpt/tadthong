import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { WorkOrder } from '../components/schema'
import { CellAction } from './cell-action'
import { format } from 'date-fns'

export const columns: ColumnDef<WorkOrder>[] = [
  {
    accessorKey: 'createAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Create Date' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-28 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {format(row.original.createAt,"dd-MM-yyyy")}
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
    accessorKey: 'itemMaster.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Master' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.original.itemMaster.name}
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
  // {
  //   accessorKey: 'itemMaster.stockingUom',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Unit' />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex space-x-2'>
  //         <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
  //         {row.original.itemMaster.stockingUom}
  //         </span>
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: 'received',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Received' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('received')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Balance' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('balance')}
          </span>
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'location.name',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Location' />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex space-x-2'>
  //         <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
  //         {row.original.location.name}
  //         </span>
  //       </div>
  //     )
  //   },
  // },
 
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
    cell: ({ row }) => <CellAction row={row.original} />,
  },
]
